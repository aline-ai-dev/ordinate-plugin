#!/usr/bin/env bash
# Renders the private staging marketplace (ADR-0006 in the ordinate repo): a
# copy of this plugin named ordinate-staging that points at the staging MCP
# endpoint, plus marketplace files for Claude Code and Codex / ChatGPT.
# Usage: scripts/render-staging.sh <marketplace-root>
set -euo pipefail

if [[ $# -ne 1 ]]; then
  echo "usage: $0 <marketplace-root>" >&2
  exit 2
fi

src="$(cd "$(dirname "$0")/.." && pwd)"
root="$1"
plugin_dir="$root/plugins/ordinate-staging"

mkdir -p "$root"
rm -rf "$plugin_dir"
mkdir -p "$plugin_dir"
cp -R "$src/plugin.json" "$src/mcp.json" "$src/.claude-plugin" "$src/.mcp.json" \
  "$src/assets" "$src/README.md" "$src/LICENSE" "$plugin_dir/"

node - "$plugin_dir" "$root" <<'EOF'
const fs = require("node:fs");
const path = require("node:path");

const [pluginDir, root] = process.argv.slice(2);
const NAME = "ordinate-staging";
const DISPLAY_NAME = "Ordinate (staging)";
const PRODUCTION_URL = "https://go.ordinate.app/api/mcp";
const STAGING_URL = "https://go-staging.ordinate.app/api/mcp";
const DESCRIPTION =
  "Internal staging build of the Ordinate plugin. Points at the staging MCP endpoint.";

const read = (file) => JSON.parse(fs.readFileSync(file, "utf8"));
const write = (file, value) => {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`);
};

for (const file of ["mcp.json", ".mcp.json"]) {
  const target = path.join(pluginDir, file);
  const config = read(target);
  for (const [name, server] of Object.entries(config.mcpServers)) {
    if (server.url !== PRODUCTION_URL) {
      throw new Error(`${file}: ${name} url is ${server.url}, expected ${PRODUCTION_URL}`);
    }
    server.url = STAGING_URL;
  }
  write(target, config);
}

const readme = path.join(pluginDir, "README.md");
fs.writeFileSync(readme, fs.readFileSync(readme, "utf8").replaceAll(PRODUCTION_URL, STAGING_URL));

const openAi = read(path.join(pluginDir, "plugin.json"));
openAi.name = NAME;
openAi.description = DESCRIPTION;
openAi.extensions["com.openai"].interface.displayName = DISPLAY_NAME;
write(path.join(pluginDir, "plugin.json"), openAi);

const claude = read(path.join(pluginDir, ".claude-plugin/plugin.json"));
claude.name = NAME;
claude.displayName = DISPLAY_NAME;
claude.description = DESCRIPTION;
write(path.join(pluginDir, ".claude-plugin/plugin.json"), claude);

const source = `./plugins/${NAME}`;
write(path.join(root, ".claude-plugin/marketplace.json"), {
  name: "ordinate-internal",
  owner: { name: "Aline AI" },
  description: "Internal Ordinate plugins for testing against staging.",
  plugins: [{ name: NAME, source, description: DESCRIPTION }],
});
write(path.join(root, ".agents/plugins/marketplace.json"), {
  name: "ordinate-internal",
  interface: { displayName: "Ordinate internal" },
  plugins: [
    {
      name: NAME,
      source: { source: "local", path: source },
      policy: { installation: "AVAILABLE", authentication: "ON_INSTALL" },
      category: "Productivity",
    },
  ],
});
EOF

echo "rendered $plugin_dir"
