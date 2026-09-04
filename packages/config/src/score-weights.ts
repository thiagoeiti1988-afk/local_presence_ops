/**
 * Deterministic weights for the Local Presence Score. Changing these values
 * is a scoring-policy change, not a bug fix — keep it deliberate and
 * documented in docs/AUDIT_SCORE.md.
 */
export const SCORE_WEIGHTS = {
  profileCompleteness: 0.35,
  reputation: 0.3,
  contentActivity: 0.15,
  conversionReadiness: 0.2,
} as const;

export type ScoreSection = keyof typeof SCORE_WEIGHTS;
