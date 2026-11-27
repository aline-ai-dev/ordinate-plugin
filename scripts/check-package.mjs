#!/usr/bin/env node
// Package checks run in CI next to `claude plugin validate .`.
// Run from anywhere: node scripts/check-package.mjs
// Checks the plugin/ folder, which is the folder submitted to the directories.
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { isDeepStrictEqual } from "node:util";
import Ajv from "ajv";
import Ajv2019 from "ajv/dist/2019.js";
import Ajv2020 from "ajv/dist/2020.js";
import addFormats from "ajv-formats";

const PRODUCTION_MCP_URL = "https://go.ordinate.app/api/mcp";
const STAGING_MARKER = "go-staging";
// OpenAI documents auth under each server's extensions["com.openai"] in
// mcp.json, but the Agent Plugins 1.0.0 mcp schema closes server objects.
// The schema check sets this one key aside; checkOpenAiAuth pins its shape.
const OPENAI_SERVER_EXTENSIONS = {
  "com.openai": { auth: { type: "oauth", client: { mode: "cimd" } } },
};
const AJV_BY_META_SCHEMA = {
  "https://json-schema.org/draft/2020-12/schema": Ajv2020,
  "https://json-schema.org/draft/2019-09/schema": Ajv2019,
  "http://json-schema.org/draft-07/schema#": Ajv,
  "http://json-schema.org/draft-07/schema": Ajv,
};

const failures = [];
const fail = (message) => failures.push(message);

process.chdir(fileURLToPath(new URL("../plugin/", import.meta.url)));

// git ls-files from plugin/ lists only plugin/ files, relative to it.
function pluginFiles(...paths) {
  return execFileSync("git", ["ls-files", "--cached", "--others", "--exclude-standard", "-z", ...paths], {
    encoding: "utf8",
  })
    .split("\0")
    .filter(Boolean);
}

// The Claude plugin directory refuses scripts, package-manager files and other
// non-content files from organizations that are not Verified. Keep tooling in
// scripts/ and .github/, outside plugin/.
const ALLOWED_PLUGIN_FILE = /(^LICENSE$|\.md$|\.json$|\.png$)/;
function checkPluginFiles() {
  for (const file of pluginFiles()) {
    if (!ALLOWED_PLUGIN_FILE.test(file) || /(^|\/)package(-lock)?\.json$/.test(file)) {
      fail(`plugin/${file}: only Markdown, JSON (not package files), PNG and LICENSE may ship in plugin/`);
    }
  }
}

function readJson(path) {
  let text;
  try {
    text = readFileSync(path, "utf8");
  } catch {
    fail(`${path}: file is missing`);
    return undefined;
  }
  try {
    return JSON.parse(text);
  } catch (error) {
    fail(`${path}: invalid JSON (${error.message})`);
    return undefined;
  }
}

async function checkSchema(path, manifest) {
  const schemaUrl = manifest.$schema;
  if (typeof schemaUrl !== "string") {
    fail(`${path}: missing "$schema"`);
    return;
  }
  const response = await fetch(schemaUrl);
  if (!response.ok) {
    fail(`${path}: fetching ${schemaUrl} returned HTTP ${response.status}`);
    return;
  }
  const schema = await response.json();
  const AjvClass = AJV_BY_META_SCHEMA[schema.$schema ?? ""];
  if (!AjvClass) {
    fail(`${path}: unsupported meta-schema ${schema.$schema} in ${schemaUrl}`);
    return;
  }
  const ajv = new AjvClass({ allErrors: true, strict: false });
  addFormats(ajv);
  const validate = ajv.compile(schema);
  if (!validate(manifest)) {
    for (const error of validate.errors) {
      fail(
        `${path}: ${error.instancePath || "/"} ${error.message} ${JSON.stringify(error.params)} (schema ${schemaUrl})`
      );
    }
  }
}

function withoutServerExtensions(mcp) {
  const servers = Object.fromEntries(
    Object.entries(mcp.mcpServers ?? {}).map(([name, server]) => {
      const { extensions: _extensions, ...rest } = server ?? {};
      return [name, rest];
    })
  );
  return { ...mcp, mcpServers: servers };
}

function checkOpenAiAuth(path, mcp) {
  for (const [name, server] of Object.entries(mcp.mcpServers ?? {})) {
    if (!isDeepStrictEqual(server?.extensions, OPENAI_SERVER_EXTENSIONS)) {
      fail(
        `${path}: mcpServers.${name}.extensions must be exactly ${JSON.stringify(OPENAI_SERVER_EXTENSIONS)}`
      );
    }
  }
}

function checkUrls(path, mcp) {
  const servers = Object.entries(mcp?.mcpServers ?? {});
  if (servers.length === 0) {
    fail(`${path}: no servers under "mcpServers"`);
  }
  for (const [name, server] of servers) {
    if (server?.url !== PRODUCTION_MCP_URL) {
      fail(`${path}: mcpServers.${name}.url is ${JSON.stringify(server?.url)}, expected ${PRODUCTION_MCP_URL}`);
    }
  }
}

function checkVersions(openAiPlugin, claudePlugin) {
  if (!openAiPlugin || !claudePlugin) return;
  if (typeof openAiPlugin.version !== "string") {
    fail(`plugin.json: missing "version"`);
  }
  if (openAiPlugin.version !== claudePlugin.version) {
    fail(
      `version mismatch: plugin.json has ${JSON.stringify(openAiPlugin.version)}, .claude-plugin/plugin.json has ${JSON.stringify(claudePlugin.version)}`
    );
  }
}

// The staging URL is rendered by scripts/ only; the public package never
// carries it. Lists tracked and untracked files, honouring .gitignore.
function checkNoStagingUrl() {
  for (const file of pluginFiles()) {
    let content;
    try {
      content = readFileSync(file);
    } catch {
      continue; // deleted in the working tree but still in the index
    }
    if (content.includes(STAGING_MARKER)) {
      fail(`plugin/${file}: contains "${STAGING_MARKER}"; only scripts/ may name staging`);
    }
  }
}

// The skill must name only tools the server lists. The README "Tools" section
// is that list (kept equal to MCP_TOOL_NAMES in the ordinate repo, which CI
// cannot read). A backticked camelCase word that starts like a tool verb and
// is not in the list fails, so a server rename cannot leave the skill stale.
const TOOL_VERB = /^(get|list|query|search|grep|read|inspect)[A-Z][A-Za-z]*$/;
function backticked(text) {
  return [...text.matchAll(/`([^`\s]+)`/g)].map((match) => match[1]);
}
function checkSkillToolNames() {
  const readme = readFileSync("README.md", "utf8");
  const section = readme.split(/^## Tools$/m)[1]?.split(/^## /m)[0];
  if (!section) {
    fail(`README.md: missing "## Tools" section`);
    return;
  }
  const listed = new Set(backticked(section).filter((name) => TOOL_VERB.test(name)));
  const files = pluginFiles("skills").filter((file) => file.endsWith(".md"));
  for (const file of files) {
    for (const name of new Set(backticked(readFileSync(file, "utf8")))) {
      if (TOOL_VERB.test(name) && !listed.has(name)) {
        fail(`${file}: names tool "${name}", which README.md "## Tools" does not list`);
      }
    }
  }
}

const openAiPlugin = readJson("plugin.json");
const openAiMcp = readJson("mcp.json");
const claudePlugin = readJson(".claude-plugin/plugin.json");
const claudeMcp = readJson(".mcp.json");

if (openAiPlugin) await checkSchema("plugin.json", openAiPlugin);
if (openAiMcp) {
  await checkSchema("mcp.json", withoutServerExtensions(openAiMcp));
  checkOpenAiAuth("mcp.json", openAiMcp);
  checkUrls("mcp.json", openAiMcp);
}
if (claudeMcp) checkUrls(".mcp.json", claudeMcp);
checkVersions(openAiPlugin, claudePlugin);
checkPluginFiles();
checkNoStagingUrl();
checkSkillToolNames();

if (failures.length > 0) {
  console.error(`check-package: ${failures.length} problem(s)`);
  for (const message of failures) console.error(`  - ${message}`);
  process.exit(1);
}
console.log("check-package: all checks passed");
