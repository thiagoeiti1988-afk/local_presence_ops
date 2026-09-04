/**
 * Future port for Core AI policy checks (e.g. "is this reply compliant with
 * platform guidelines"). Same status as ReasoningProvider: interface only,
 * no implementation, no compile-time dependency anywhere else in the repo.
 */
export interface PolicyDecision {
  allowed: boolean;
  reason: string | null;
}

export interface PolicyProvider {
  evaluate(action: string, payload: Record<string, unknown>): Promise<PolicyDecision>;
}
