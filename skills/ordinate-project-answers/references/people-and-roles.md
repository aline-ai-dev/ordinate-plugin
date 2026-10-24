# People and roles

Read this for stakeholder maps, "who is responsible for", contact lists, and questions about consultants, contractors, suppliers or client teams.

## Start from the directory, then cross-check

1. Call `getProjectContext` with the `organizations` operation, then `people` for the organisations that matter. Page with the returned cursor until there is no next cursor. Use only organisation and person IDs that these calls return.
2. The `emails` operation lists email linked to an organisation or person, which helps confirm what role they actually play.
3. Cross-check with `searchEmails` and `grepEmails` (sender filters help). The directory may not list every party active in the correspondence, and a party's role in practice can differ from its directory entry.

Reason: the correspondence shows who actually acts on the project. Report any party found in email but not in the directory, and any tier or role the two sources disagree on.

## Proven versus inferred

Separate what a source states from what you infer, because a stakeholder map is often used to decide who to contact or who carries risk.

- Proven: a contract, appointment letter, directory entry, signature block or meeting report states the role. Cite it.
- Inferred: the role is deduced from email patterns, such as who sends drawings or who chairs meetings. Label it "inferred" and say what it rests on.

Keep these distinctions:

- Proposed versus appointed. A party named in a tender or proposal is not appointed until a source says so.
- Invited versus attended. Meeting invitation recipients are not attendees. Use the attendance list of the meeting report.
- Direct versus sub-contracted. Say who holds the contract with whom only when a source shows it.

## Naming

Write Organisation (Person), for example "Consultant B (Person Y), structural engineer". When the person's organisation is unclear, say so instead of guessing from the email domain alone.

## Answer shape

- Group by role or tier: client side, consultants, main contractor, subcontractors and suppliers, authorities.
- For each party: role, key people, source of the role, and whether it is proven or inferred.
- End with "Evidence and gaps", including parties found in email but not in the directory and directory entries that disagree with email.
