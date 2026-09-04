# Review workflow

`packages/reviews` — `classify.ts` + `workflow.ts`.

## Classification

Deterministic and rating-based (`classifyReview`): 4-5 stars → positive, 3 →
neutral, 1-2 → negative. This never calls a `ContentProvider`/LLM — sentiment
gates the approval workflow below and must not depend on a non-deterministic
external service.

## State machine

```
new  →  drafted  →  approved  →  replied
  ↘        ↘           ↘
  escalated ←──────────┘   (escalated can re-enter drafted)
```

Enforced by `canTransition` in `workflow.ts`; every transition function
(`draftReply`, `approveReply`, `publishReply`, `escalate`) checks it and
throws `ReviewWorkflowError` on an invalid move.

## Negative reviews always require human approval

This is not a convention — it's structural:

- `publishReply` refuses to run unless the review's `status` **and**
  `replyStatus` are already `"approved"`. There is no code path from
  `drafted` straight to `replied`.
- `approveReply` requires a non-empty `approvedBy` id — an empty string
  throws, so "auto-approved by nobody" cannot silently pass validation.
- For a negative review specifically, `publishReply` produces an error that
  names the requirement explicitly ("Negative reviews require explicit human
  approval before publishing"), even though the general state-machine check
  already would have blocked it — this makes the failure mode legible in
  logs, not just correct.

See `packages/reviews/src/workflow.test.ts` for the regression tests,
including one that a positive review also cannot skip approval — the human
gate is universal, negative reviews are just the case the spec calls out
explicitly.

## Where drafts come from

`ContentProvider.draftReviewReply` (see [CONTENT.md](CONTENT.md)) produces
the text. The workflow above governs what can be *done* with that text; it
has no opinion on how the text was generated.
