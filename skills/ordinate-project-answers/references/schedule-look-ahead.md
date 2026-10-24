# Schedule and look-ahead

Read this for programme questions, look-aheads, upcoming or overdue work, milestones and delays.

## How `querySchedule` behaves

The tool has five operations: `search_tasks` (by name), `upcoming_tasks` (a number of days ahead), `overdue_tasks`, `dependencies` (predecessors and successors of a named task) and `milestones`. Results come in pages with a default limit, so ask for a larger limit or narrow the query when the coverage says more rows matched.

## Look-ahead: widen the window

`upcoming_tasks` returns only tasks that finish inside the window. A task that started earlier and finishes after the window, which is still active during it, is left out.

What to do, because a look-ahead that drops running work misleads site planning:

1. Call `upcoming_tasks` with a window wider than the question asks (for example 90 days for a 2 to 4 week look-ahead).
2. Keep tasks whose dates overlap the requested period: start on or before the period ends, and finish on or after it starts.
3. Also check `overdue_tasks`, since late tasks are often still in progress.
4. Say in the answer that you applied this overlap rule.

## Check freshness before trusting dates

The schedule may be months behind the site. Signs: most tasks at 0% progress, or completed work in email still showing as not started.

- State the schedule's apparent data date or last update, and how you judged it.
- Confirm actual progress from recent meeting reports and email, and label each date as planned, forecast or actual.
- If the schedule and recent sources disagree, show both.

## Matching tasks to the question

- Task names often differ from the words used in email and meetings. Search synonyms and related terms with `search_tasks` (for example "ceiling", "soffit" and "bulkhead"), and check the location or zone words too.
- Summary rows are mixed in with real tasks. A summary row spans its children; do not count it as separate work or double count its dates.
- There is no trade field. Infer the trade from the task name and say that it is inferred.

## Answer shape

- Headline: the period covered and the main activities or milestones in it, with a freshness warning if the schedule looks stale.
- Group by area or trade (inferred), listing task, planned start and finish, progress, and any later evidence of actual progress.
- End with "Evidence and gaps": the window you queried, the overlap rule, staleness signs, and tasks you could not match.
