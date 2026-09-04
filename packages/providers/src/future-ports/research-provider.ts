/**
 * Future port for Core AI-driven research (e.g. competitor/market research
 * beyond CompetitiveDiscoveryProvider's scope). Interface only — see
 * reasoning-provider.ts for why this stays unimplemented in the MVP.
 */
export interface ResearchFinding {
  summary: string;
  sources: string[];
}

export interface ResearchProvider {
  research(topic: string): Promise<ResearchFinding>;
}
