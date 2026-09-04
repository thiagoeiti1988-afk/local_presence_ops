import { describe, expect, it } from "vitest";
import { localPostSchema } from "./post-types.js";

function basePost(overrides: Record<string, unknown> = {}) {
  return {
    id: "11111111-1111-1111-1111-111111111111",
    locationId: "22222222-2222-2222-2222-222222222222",
    type: "offer",
    title: "10% off cleanings this month",
    body: "Book a cleaning in March and get 10% off.",
    cta: "Book now",
    link: "https://odontovale.example.com/book",
    status: "draft",
    scheduledAt: null,
    publishedAt: null,
    ...overrides,
  };
}

describe("localPostSchema", () => {
  it("accepts a well-formed post", () => {
    const post = localPostSchema.parse(basePost());
    expect(post.type).toBe("offer");
  });

  it("rejects an empty title", () => {
    expect(() => localPostSchema.parse(basePost({ title: "" }))).toThrow();
  });

  it("rejects a body over 1500 characters", () => {
    expect(() =>
      localPostSchema.parse(basePost({ body: "a".repeat(1501) })),
    ).toThrow();
  });

  it("rejects an invalid post type", () => {
    expect(() => localPostSchema.parse(basePost({ type: "banner" }))).toThrow();
  });

  it("sanitizes an unsafe link to null instead of throwing", () => {
    const post = localPostSchema.parse(
      basePost({ link: "javascript:alert(1)" }),
    );
    expect(post.link).toBeNull();
  });

  it("defaults status to draft", () => {
    const { status: _status, ...withoutStatus } = basePost();
    const post = localPostSchema.parse(withoutStatus);
    expect(post.status).toBe("draft");
  });
});
