# Standards and clauses

Read this for building codes, standards, clause lookups and firm library documents.

## Find the right document first

1. Use `listLibraryResources` to see what is available. Filter by shelf (firm library or licensed standards), title text or agency. A title filter is a plain substring, not a wildcard.
2. Use `searchLibrary` for topic searches across the library.
3. Use `searchBuildingCode` for clause text.

## Pin the family before searching clauses

A `searchBuildingCode` call without a family key may return candidate families instead of clauses. Pick the candidate that matches the question, then repeat the search with that family key. Reason: without a family the search cannot tell which standard you mean, and an answer drawn from candidates is not clause evidence.

Say which edition the clauses come from. The search has an option for historical editions; use it only when the question is about a superseded edition, so current answers are not drawn from withdrawn text.

## Search by topic, then confirm the clause number

Search by the clause topic or a distinctive phrase rather than the clause number alone, then check that the returned clause number matches the question. If you cannot confirm the number, say so.

## Check the clause text before quoting

Clause text is extracted from the source document. Before quoting:

- If the same clause comes back more than once with different wording, quote one and note the other.
- If two returned passages give different values, show both and say the text needs checking against the published standard.
- If a number has no unit, do not add one from memory; flag it.

Reason: a clause quoted with a wrong value or unit can lead to a non-compliant design.

## Answer shape

- Headline: the requirement in plain words, with the standard, edition and clause number.
- The clause text quoted exactly, with its source.
- Notes on how it applies to the question, labelled as interpretation.
- End with "Evidence and gaps": families searched, clauses that could not be confirmed, and any text that needs checking against the published standard.
