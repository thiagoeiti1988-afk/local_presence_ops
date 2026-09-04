import type { WhatsAppProvider } from "./whatsapp-provider.js";

export interface MetaWhatsAppCredentials {
  phoneNumberId: string;
  accessToken: string;
  graphApiVersion: string;
}

/**
 * Skeleton only, modeled on the WhatsApp Cloud (Graph) API shape used in
 * clinic-whatsapp-scheduling-mvp — POST to
 * `graph.facebook.com/{version}/{phone_number_id}/messages` with a bearer
 * token. Every method throws until real Meta Business API access is
 * granted and an approved message template exists: Meta requires a
 * pre-approved template to message a user outside a 24h customer-initiated
 * session window, which is exactly this use case (proactive follow-up on a
 * lead who has not messaged us first). See docs/WHATSAPP.md.
 *
 * Constructing this class never requires real credentials — same reasoning
 * as GoogleBusinessProfileProvider.
 */
export class MetaWhatsAppProvider implements WhatsAppProvider {
  constructor(private readonly credentials?: MetaWhatsAppCredentials) {}

  sendText(_phone: string, _message: string): Promise<void> {
    return Promise.reject(
      new Error(
        "MetaWhatsAppProvider.sendText is not implemented yet. It requires " +
          "an approved WhatsApp message template and a provisioned Meta " +
          "Business phone number — free-text messages cannot be sent to a " +
          "customer who hasn't messaged first in the last 24h. Use " +
          "ManualWhatsAppProvider until this is set up (see docs/WHATSAPP.md).",
      ),
    );
  }
}
