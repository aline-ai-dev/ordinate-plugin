---
name: ordinate-project-answers
description: Retrieval and answering playbook for questions about an Ordinate project. Use whenever the user asks about a project connected through the Ordinate MCP tools, including its status, documents, meeting reports, email, schedule, drawings, contracts, procurement, tasks, authority submissions, people and roles, commercial matters, history or standards, and whenever the user asks to change, close, send, approve or submit something in Ordinate. Guides which tools to call, how to read sources fully, how to reconcile conflicts, how to write a cited answer that states its gaps, and how to decline changes because access is read-only.
---

# Project answers

Use this playbook for any question about an Ordinate project. The tools are read-only and each call is stateless, so every call needs the `projectId` from `listProjects`.

The goal is an answer a project manager can act on: the right status first, every claim cited, and the gaps stated so nobody mistakes a missing source for a fact.

## Read-only boundary

Ordinate access through this plugin is read-only. When the user asks to create, change, close, delete, send, reply to, approve, reject or submit anything in Ordinate or on the project, for example "mark these actions as closed" or "approve the variation claim":

1. Say plainly that the Ordinate tools are read-only and that you cannot make the change.
2. Stop there. Do not try another route: do not open the Ordinate web app, do not ask the user to sign in so you can continue, and do not use browser, computer-use or other tools to make the change.
3. Offer read-only help instead: a draft the user can send or paste, a checklist of the items to change with their record IDs, or the current status of the records.

Reason: the user connected Ordinate expecting read access. Acting in Ordinate by another route would bypass that boundary and the permissions the user granted.

## Core workflow

### 1. Pick the project

Call `listProjects` and match the user's wording to one project. If two projects could match, ask which one, because answering from the wrong project is worse than a short delay. If the list is empty, say so and pass on any note the tool returns.

### 2. Read the project context first

Before searching, call `getProjectContext` with the `project` operation, then the `instructions` operation. Page the instructions with the returned cursor until there is no next cursor.

Reason: project instructions often say which sources are authoritative, how the client wants updates written, and what stage the project is in. Skipping this step risks missing whole-project facts, such as a completion certificate or handover, that change the headline of the answer.

Use the `organizations`, `people` and `emails` operations when the question involves parties or people (see the people reference below).

### 3. Choose tools by question type

| Question is about | Start with | Then |
| --- | --- | --- |
| Overall status, weekly update | `getProjectContext`, meeting reports via `searchDocuments` | `queryAiduWorklist`, `querySchedule`, `searchEmails` |
| A document or report | `searchDocuments`, `listProjectDocuments` | `inspectDocument`, `readDocumentPage` |
| An exact phrase, code or reference number | `grepDocuments`, `grepEmails` | Read the full source of each hit |
| Email history or correspondence | `searchEmails`, `grepEmails` | `readEmailThread`, `readEmailMessage` |
| Programme, dates, look-ahead | `querySchedule` | Email and meeting reports for actual progress |
| Materials, orders, deliveries | `queryProcurement` | `searchEmails` for supplier correspondence |
| Actions, issues, decisions | `queryAiduWorklist` | The source email or meeting report of each item |
| Authority or regulatory submissions | `queryAuthoritySubmissions` | `searchEmails`, `searchDocuments` |
| Drawings | `searchDrawings` | `inspectDocument` on the drawing register or transmittal |
| Contract terms | `searchContracts` | `inspectDocument`, `readDocumentPage` |
| Standards, codes, firm library | `listLibraryResources`, `searchLibrary` | `searchBuildingCode` |

### 4. Read full sources, not snippets

Search results are pointers. Before you rely on a hit, read the source behind it.

- Prefer the full meeting report over a pre-read, agenda or summary. Pre-reads are written before the meeting and miss what was decided; the full report records outcomes.
- For long documents, use `inspectDocument` with a focused query, then `readDocumentPage` for the pages that matter.
- For email, read the whole thread with `readEmailThread` and keep paging while the result says there is more. Read long single messages with `readEmailMessage`, following its next cursor to the end.
- Order dated events by the date they happened, not the order the hits came back.

### 5. Read email carefully

- Results come in pages. Continue while the result says there is more or gives a next offset or cursor; a short page is not the end of the results.
- Quoted history is old. A recent reply often quotes earlier messages, so a keyword hit or a date inside a recent email may belong to an older message. Attribute each fact to the message that first stated it, with that message's own date.
- Short codes can match inside links or addresses. Check that a hit for a short code is the code in the text, not part of a URL.
- Literal search matches exact text. If a phrase is not found, search for a shorter distinctive part of it, or for synonyms, before concluding it is absent.
- The email tools read message text, not attachments or files behind transfer or drive links. Look for the same document with `searchDocuments` or `listProjectDocuments`, since many attachments are also filed there. Otherwise name it as unread evidence; do not infer its contents from the file name.

### 6. Reconcile across sources

- Cross-check structured data (schedule, worklist, directory, procurement) against email and meeting reports, because structured data can be stale or incomplete.
- When two sources disagree, for example two different deadlines, show both with their sources and dates, and say which looks more recent or authoritative and why. Do not pick one silently.
- Keyword hits are a sample, not a census. Say "found in the sources searched" rather than "all" or "none" unless you have read an exhaustive register.

### 7. Keep status words exact

Use the word the source supports, because these pairs mean different things to a client:

- submitted, approved, rejected, closed
- proposed, appointed
- invited (invitation recipients), attended (attendees)
- planned, actual (and forecast where the source says so)
- "not marked resolved in the email read" rather than "open", unless a register says open

### 8. Handle failures honestly

- If a call fails with a temporary error or no response, retry it once. If it fails again, report it as a failed call.
- A failed call is not an empty result. Never write "nothing found" for a source you could not read.
- If one source cannot be searched, use the other tools that can answer the question, and say in the answer which checks could not run.
- If a tool returns a recovery hint or a required next step (such as a list of candidate families), follow it before giving up.

## Answer format

1. **Status headline.** One or two sentences that answer the question directly, including whole-project state when it matters (for example: "Project Alpha reached practical completion; defects work continues").
2. **Grouped claims.** Group by theme, party or date. Each claim carries its citation: the record ID, document name and page, email message or thread with its date, or the app link the tool returned.
3. **Conflicts and caveats.** Show conflicting values side by side with their sources.
4. **Evidence and gaps.** A short closing section that lists:
   - Searched: tools and queries used, and the date range covered.
   - Failed: calls that errored after one retry.
   - Unreadable: attachments, linked files, documents that returned errors.
   - Conflicting: values that disagree and were not resolved.

Name people as Organisation (Person), for example "Contractor A (Person X)", so the reader sees who speaks for whom.

## References

Read the reference that matches the question before you search.

| Reference | Read when |
| --- | --- |
| [references/status-and-weekly-update.md](references/status-and-weekly-update.md) | Project status, progress summary, weekly or client update, "where are we" |
| [references/people-and-roles.md](references/people-and-roles.md) | Who is who, stakeholders, consultants, contractors, contacts, responsibilities |
| [references/schedule-look-ahead.md](references/schedule-look-ahead.md) | Programme, look-ahead, upcoming or overdue work, milestones, delays |
| [references/commercial-and-variations.md](references/commercial-and-variations.md) | Variations, claims, costs, quotes, procurement status, approvals with money attached |
| [references/standards-clauses.md](references/standards-clauses.md) | Building codes, standards, clause lookups, firm library documents |
| [references/history-and-decisions.md](references/history-and-decisions.md) | What happened when, why a decision was made, timelines, meeting outcomes |
