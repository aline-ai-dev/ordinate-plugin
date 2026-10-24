# Ordinate

Ordinate answers questions over a project's documents, email, drawings and schedules with citations. This plugin connects Claude, ChatGPT and Codex to Ordinate so you can ask about your projects without leaving the assistant.

## Who it is for

The plugin is for existing Ordinate customers whose organization has MCP turned on in Ordinate. If your organization has not turned MCP on, you can still sign in, but the project list is empty and comes with a note explaining why.

## What the plugin connects to

The plugin bundles one skill, described under [Skill](#skill), and no code or hooks. It declares one remote MCP server:

- Name: `ordinate`
- URL: `https://go.ordinate.app/api/mcp`
- Transport: streamable HTTP

That server is the only thing the plugin calls. You sign in with your Ordinate account through OAuth when you first connect; the plugin stores no credentials or API keys. Every request runs as you and sees only the projects your Ordinate account can access.

## Tools

All tools are read-only. None of them create, change or delete data in Ordinate.

- Projects: `listProjects`
- Documents: `searchDocuments`, `grepDocuments`, `inspectDocument`, `listProjectDocuments`, `readDocumentPage`
- Email: `searchEmails`, `grepEmails`, `readEmailThread`, `readEmailMessage`
- Project state and schedule: `querySchedule`, `queryProcurement`, `queryAiduWorklist`, `queryAuthoritySubmissions`, `getProjectContext`
- Drawings and contracts: `searchDrawings`, `searchContracts`
- Library and standards: `searchLibrary`, `listLibraryResources`, `searchBuildingCode`

## Skill

The `ordinate-project-answers` skill lives in `skills/ordinate-project-answers/`. It guides the assistant when you ask about an Ordinate project: read the project context first, gather evidence across Ordinate's tools, cite the record IDs behind each claim, and state what it could not read or verify.

## Support

For help, see https://ordinate.app/support or email hello@aline.sg. The privacy policy is at https://ordinate.app/privacy and the terms of service are at https://ordinate.app/terms.

## Development

The package has no build step. Two checks run in CI (`.github/workflows/check.yml`) and can be run locally from the repository root with Node.js 22 or later:

```bash
npm ci --prefix scripts
node scripts/check-package.mjs
claude plugin validate .
```

`scripts/check-package.mjs` validates `plugin.json` and `mcp.json` against the JSON Schemas they declare in `$schema` (fetched over the network, validated with Ajv), checks that every MCP server URL in `mcp.json` and `.mcp.json` is the production URL, checks that `version` is the same in `plugin.json` and `.claude-plugin/plugin.json`, and checks that no file outside `scripts/` mentions the staging host. OpenAI documents the OAuth settings under each server's `extensions["com.openai"]` in `mcp.json`, which the Agent Plugins 1.0.0 schema does not allow, so the script validates the server without that key and checks the key's exact value separately.

The check dependencies live in `scripts/package.json`, not at the repository root: a `package.json` with a lockfile at the plugin root would make Claude Code install those packages for every user.

## License

The manifests, scripts and text in this repository are licensed under the MIT License; see `LICENSE`. The Ordinate name and icons are trademarks of Aline AI and are not licensed under MIT.
