# Audit scoring

`packages/audit` computes the Local Presence Score. It is entirely
deterministic — no LLM call is involved in producing a number, ever. See
`packages/audit/src/scoring.ts`.

## Sections and weights

| Section | Weight |
|---|---|
| profileCompleteness | 35% |
| reputation | 30% |
| contentActivity | 15% |
| conversionReadiness | 20% |

Weights live in `packages/config/src/score-weights.ts`. Changing them is a
scoring-policy decision, not a bug fix.

## How a section score is computed

Each section has a fixed list of items (e.g. reputation has review volume,
average rating, unanswered reviews). Every item gets a status —
`pass` (100), `warning` (50), or `fail` (0) — from a fixed threshold. The
section score is the average of its items' scores, rounded. The overall
score is the weighted sum of section scores, clamped to `[0, 100]`.

## Missing data is not the same as "good"

A `null`/`undefined` observed value (e.g. `unansweredReviews` not filled in)
is always scored as `fail`, never defaulted to a value that would count as
"good". Treating "not observed" as "zero, therefore pass" would silently
inflate scores for audits built from incomplete manual input — exactly the
case for the public `/audit` lead magnet, where most fields are optional.
This is covered by a regression test in `packages/audit/src/scoring.test.ts`.

## Recommended actions

Every item carries a `recommendedAction` string. `packages/reports` uses
these directly to build a monthly report's "recommendations" list — sorted
by severity, capped at 5 — so the wording written here is what a client
sees, not just internal metadata.
