import { describe, expect, it } from "vitest";
import { followUpMessage } from "./templates.js";

describe("followUpMessage", () => {
  it("substitutes the business name into every step's template", () => {
    expect(followUpMessage(0, "Clínica Odonto Vale")).toContain("Clínica Odonto Vale");
    expect(followUpMessage(24, "Clínica Odonto Vale")).toContain("Clínica Odonto Vale");
    expect(followUpMessage(72, "Clínica Odonto Vale")).toContain("Clínica Odonto Vale");
  });
});
