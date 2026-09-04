/**
 * The boundary between this codebase and WhatsApp. Mirrors
 * BusinessProfileProvider's shape on purpose: a Manual implementation that
 * works today with zero external approval, and a Meta implementation that
 * is a skeleton until the WhatsApp Business API is actually provisioned —
 * see docs/WHATSAPP.md.
 */
export interface WhatsAppProvider {
  /**
   * Returns something the operator can use to start a conversation with
   * `phone` — a URL to open (Manual) or void once actually sent (Meta).
   * Never throws for a missing/invalid phone; the caller decides what "no
   * WhatsApp available" means for that lead.
   */
  sendText(phone: string, message: string): Promise<{ url: string } | void>;
}
