/**
 * Future port for Core AI integration. NOT implemented, NOT called anywhere
 * in this codebase, and no package here has a compile-time dependency on a
 * Core AI client — this interface exists only so a future integration has a
 * documented seam to implement against, per the "não integrar ao Core AI"
 * constraint on this MVP.
 */
export interface ReasoningProvider {
  reason(question: string, context: Record<string, unknown>): Promise<string>;
}
