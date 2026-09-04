import type { WhatsAppProvider } from "./whatsapp-provider.js";

/**
 * No API, no Meta approval, no cost — a `wa.me` deep link that opens
 * WhatsApp with the message pre-filled. A human still presses send, which
 * is also why there is no delivery confirmation: "sent" for this provider
 * means "a human clicked the link and sent it", tracked by that human
 * confirming it in the UI, not by the provider. This is the default
 * provider for the MVP — same reasoning as ManualBusinessProfileProvider.
 */
export class ManualWhatsAppProvider implements WhatsAppProvider {
  sendText(phone: string, message: string): Promise<{ url: string }> {
    const digits = phone.replace(/\D/g, "");
    const url = `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
    return Promise.resolve({ url });
  }
}
