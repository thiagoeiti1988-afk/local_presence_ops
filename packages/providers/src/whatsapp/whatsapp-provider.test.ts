import { describe, expect, it } from "vitest";
import { ManualWhatsAppProvider } from "./manual-whatsapp-provider.js";
import { MetaWhatsAppProvider } from "./meta-whatsapp-provider.js";

describe("ManualWhatsAppProvider", () => {
  const provider = new ManualWhatsAppProvider();

  it("builds a wa.me link with digits-only phone and encoded text", async () => {
    const result = await provider.sendText("+55 (11) 90000-0000", "Olá! Tudo bem?");
    expect(result.url).toBe("https://wa.me/5511900000000?text=Ol%C3%A1!%20Tudo%20bem%3F");
  });
});

describe("MetaWhatsAppProvider", () => {
  it("can be constructed without any credentials", () => {
    expect(() => new MetaWhatsAppProvider()).not.toThrow();
  });

  it("rejects with a message naming the approved-template requirement", async () => {
    const provider = new MetaWhatsAppProvider();
    await expect(provider.sendText("5511900000000", "oi")).rejects.toThrow(
      /approved WhatsApp message template/,
    );
  });
});
