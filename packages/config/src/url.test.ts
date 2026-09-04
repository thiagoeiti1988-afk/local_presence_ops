import { describe, expect, it } from "vitest";
import { isSafeUrl, sanitizeUrl } from "./url.js";

describe("sanitizeUrl", () => {
  it("accepts a plain https URL", () => {
    expect(sanitizeUrl("https://example.com/profile")).toBe(
      "https://example.com/profile",
    );
  });

  it("accepts http", () => {
    expect(sanitizeUrl("http://example.com")).toBe("http://example.com/");
  });

  it("rejects javascript: URLs", () => {
    expect(sanitizeUrl("javascript:alert(1)")).toBeNull();
  });

  it("rejects data: URLs", () => {
    expect(sanitizeUrl("data:text/html,<script>alert(1)</script>")).toBeNull();
  });

  it("rejects malformed input", () => {
    expect(sanitizeUrl("not a url")).toBeNull();
  });

  it("rejects null/undefined/empty", () => {
    expect(sanitizeUrl(null)).toBeNull();
    expect(sanitizeUrl(undefined)).toBeNull();
    expect(sanitizeUrl("   ")).toBeNull();
  });

  it("isSafeUrl mirrors sanitizeUrl", () => {
    expect(isSafeUrl("https://example.com")).toBe(true);
    expect(isSafeUrl("javascript:alert(1)")).toBe(false);
  });
});
