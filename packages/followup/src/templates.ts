import type { FollowUpOffsetHours } from "./types.js";

/**
 * Default message per step, editable per-tenant in a future iteration (see
 * lead_rescuer, which already lets a client customize these). Placeholders:
 * {{businessName}}.
 */
const TEMPLATES: Record<FollowUpOffsetHours, string> = {
  0: "Olá! Vimos que você rodou uma auditoria de presença online para {{businessName}}. Quer que a gente te mostre os 3 pontos que mais pesam contra o score?",
  24: "Oi de novo! Ainda dá tempo de revisar os pontos da auditoria de {{businessName}} — posso te mandar o relatório completo?",
  72: "Última mensagem por aqui: se {{businessName}} quiser melhorar a presença no Google, é só responder que a gente agenda uma conversa rápida.",
};

export function followUpMessage(offsetHours: FollowUpOffsetHours, businessName: string): string {
  return TEMPLATES[offsetHours].replaceAll("{{businessName}}", businessName);
}
