# Ordinate

Ordinate answers questions over a project's documents, email, drawings and schedules with citations. This plugin connects Claude, ChatGPT and Codex to Ordinate so you can ask about your projects without leaving the assistant.

## Who it is for

The plugin is for existing Ordinate customers whose organization has MCP turned on in Ordinate. If your organization has not turned MCP on, you can still sign in, but the project list is empty and comes with a note explaining why.

## Install

In Claude, add Ordinate from the plugin directory on claude.ai or in Cowork. Claude Code loads it through account sync as `ordinateai@synced`, so no install command is needed there.

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
- Schedule: `searchScheduleTasks`, `listUpcomingScheduleTasks`, `listOverdueScheduleTasks`, `getScheduleTaskDependencies`, `listScheduleMilestones`
- Procurement: `getProcurementItemStatus`, `listProcurementPipeline`, `getProcurementItemEvidence`
- Project context: `getProjectDetails`, `listProjectOrganizations`, `listProjectPeople`, `listProjectContactEmails`, `getProjectInstructions`
- Worklist and authorities: `queryAiduWorklist`, `queryAuthoritySubmissions`
- Drawings and contracts: `searchDrawings`, `searchContracts`
- Library and standards: `searchLibrary`, `listLibraryResources`, `searchBuildingCode`, `getBuildingCodeClause`

## Skill

The `ordinate-project-answers` skill lives in `skills/ordinate-project-answers/`. It guides the assistant when you ask about an Ordinate project: read the project context first, gather evidence across Ordinate's tools, cite the record IDs behind each claim, and state what it could not read or verify.

## Support

For help, see https://ordinate.app/support or email hello@aline.sg. The privacy policy is at https://ordinate.app/privacy and the terms of service are at https://ordinate.app/terms.

## License

The manifests and text in this plugin are licensed under the MIT License; see `LICENSE`. The Ordinate name and icons are trademarks of Aline AI and are not licensed under MIT.
