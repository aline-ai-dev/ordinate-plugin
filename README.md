# ordinate-plugin

Source for the Ordinate plugin for Claude, ChatGPT and Codex. The plugin itself is in [`plugin/`](plugin/); see [`plugin/README.md`](plugin/README.md) for what it does.

## Layout

- `plugin/`: the plugin package. Submit this folder to the Claude plugin directory, not the repository root. It holds only Markdown, JSON, PNG and `LICENSE`: the directory refuses scripts, package-manager files and CI files from organizations that are not Verified.
- `scripts/`: checks, the OpenAI ZIP build and the staging render. Not part of the plugin.
- `.github/workflows/`: CI.

## Development

The package has no build step. Two checks run in CI (`.github/workflows/check.yml`) and can be run locally with Node.js 22 or later:

```bash
npm ci --prefix scripts
node scripts/check-package.mjs
claude plugin validate plugin
```

`scripts/check-package.mjs` checks `plugin/`. It validates `plugin.json` and `mcp.json` against the JSON Schemas they declare in `$schema` (fetched over the network, validated with Ajv), checks that every MCP server URL in `mcp.json` and `.mcp.json` is the production URL, checks that `version` is the same in `plugin.json` and `.claude-plugin/plugin.json`, checks that no file in `plugin/` mentions the staging host, checks that `plugin/` holds only Markdown, JSON (not package files), PNG and `LICENSE`, and checks that the skill names only tools listed under "## Tools" in `plugin/README.md`. Keep that list equal to `MCP_TOOL_NAMES` in the ordinate repo (`apps/web/server/mcp/tool-names.ts`). OpenAI documents the OAuth settings under each server's `extensions["com.openai"]` in `mcp.json`, which the Agent Plugins 1.0.0 schema does not allow, so the script validates the server without that key and checks the key's exact value separately.

The check dependencies live in `scripts/package.json`, not in `plugin/`: a `package.json` with a lockfile in the plugin would make Claude Code install those packages for every user.

`scripts/build-zip.sh` builds the OpenAI plugin ZIP from `plugin/` into `dist/`. A `v*` tag runs it in `.github/workflows/release.yml`.

### Branches

- `main`: development. Every push renders an `ordinate-staging` copy that points at the staging MCP server and pushes it to the private `aline-ai-dev/ordinate-plugin-internal` marketplace (`.github/workflows/render-staging.yml`). Try changes there first.
- `release`: the public package. The Claude plugin directory submission tracks the `plugin/` folder on this branch. Promote a tested `main` by fast-forwarding `release` to it: `git push origin main:release`.

## License

MIT; see [`plugin/LICENSE`](plugin/LICENSE). The Ordinate name and icons are trademarks of Aline AI and are not licensed under MIT.
