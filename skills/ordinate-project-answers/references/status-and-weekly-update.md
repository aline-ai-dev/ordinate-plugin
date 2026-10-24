# Status and weekly updates

Read this for "where is the project", progress summaries, and weekly or client updates.

## Start from the whole project

A status answer leads with the project's overall stage, because a reader who sees a list of open items without the stage can badly misjudge the position. Before listing items:

1. Read `getProjectContext` with the `project` and `instructions` operations. Instructions may define the update format, the audience, and which sources count.
2. Establish the stage: design, tender, construction, practical completion, handover, defects liability, or closed. Look for completion certificates, handover records and defects lists with `searchDocuments` and `searchEmails`.
3. If practical completion or handover has happened, say so in the headline, then report what remains (defects, outstanding documents, final account), since every later item reads differently after completion.

## Sources, in order of weight

1. The latest full meeting report. Prefer it over a pre-read or agenda: a pre-read is written before the meeting and does not record what was agreed.
2. Formal records: certificates, approvals, transmittals, signed instructions.
3. Email from the reporting period, read as full threads.
4. Structured tools: `queryAiduWorklist` for actions and issues, `querySchedule` for milestones, `queryProcurement` for materials, `queryAuthoritySubmissions` for submissions. Check each against the sources above, because structured data can lag.

## Building a weekly update

- Fix the period first (for example the last 7 days, or since the last report), and search email with date filters on `grepEmails` for that period.
- Group by theme the client cares about: overall status, programme, design and approvals, procurement, site and safety, commercial, risks and decisions needed.
- For each item, state what changed in the period, its current state using exact status words, the next step, and the owner as Organisation (Person).
- Separate "done this period" from "still in progress" from "planned". Do not present a plan as progress.
- Order dated events by when they happened. A meeting report published on one date can describe events from earlier dates.
- If the instructions give a format, follow it over this outline.

## Wording that matters in status answers

- "Submitted" is not "approved". "Approved" is not "closed".
- "Not marked resolved in the emails read" is not "open". Use "open" only when a register or report says so.
- "Forecast" or "planned" is not "achieved".
- Say which sources the status rests on and their dates, so the reader can judge freshness.

## Example headline

"Project Alpha reached practical completion on the date in the certificate; Contractor A is working through the defects list, and two authority approvals are still pending (sources below)."
