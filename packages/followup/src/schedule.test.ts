import { describe, expect, it } from "vitest";
import { buildFollowUpSchedule, nextActionableStep, urgencyOf } from "./schedule.js";

const CREATED_AT = new Date("2026-09-01T10:00:00Z");

describe("buildFollowUpSchedule", () => {
  it("marks every step pending right when the lead is created", () => {
    const schedule = buildFollowUpSchedule(CREATED_AT, [], CREATED_AT);
    expect(schedule.map((s) => s.status)).toEqual(["due", "pending", "pending"]);
  });

  it("marks the T+24h step due once 24h have passed", () => {
    const now = new Date(CREATED_AT.getTime() + 25 * 3600_000);
    const schedule = buildFollowUpSchedule(CREATED_AT, [0], now);
    expect(schedule[1]?.status).toBe("due");
    expect(schedule[2]?.status).toBe("pending");
  });

  it("respects sentOffsets regardless of time elapsed", () => {
    const now = new Date(CREATED_AT.getTime() + 100 * 3600_000);
    const schedule = buildFollowUpSchedule(CREATED_AT, [0, 24, 72], now);
    expect(schedule.every((s) => s.status === "sent")).toBe(true);
  });
});

describe("nextActionableStep", () => {
  it("returns the earliest step that isn't sent", () => {
    const schedule = buildFollowUpSchedule(CREATED_AT, [0], CREATED_AT);
    expect(nextActionableStep(schedule)?.offsetHours).toBe(24);
  });

  it("returns null once every step is sent", () => {
    const schedule = buildFollowUpSchedule(CREATED_AT, [0, 24, 72], CREATED_AT);
    expect(nextActionableStep(schedule)).toBeNull();
  });
});

describe("urgencyOf", () => {
  it("is overdue when the next step's due date has passed", () => {
    const now = new Date(CREATED_AT.getTime() + 1 * 3600_000);
    const schedule = buildFollowUpSchedule(CREATED_AT, [], now);
    expect(urgencyOf(schedule, "new", now)).toBe("overdue");
  });

  it("is dueSoon when the next step is within 24h", () => {
    const now = new Date(CREATED_AT.getTime());
    const schedule = buildFollowUpSchedule(CREATED_AT, [0], now);
    expect(urgencyOf(schedule, "new", now)).toBe("dueSoon");
  });

  it("is scheduled when the next step is more than 24h out", () => {
    const now = new Date(CREATED_AT.getTime());
    const schedule = buildFollowUpSchedule(CREATED_AT, [0, 24], now);
    expect(urgencyOf(schedule, "new", now)).toBe("scheduled");
  });

  it("is done once every step is sent", () => {
    const now = new Date(CREATED_AT.getTime() + 200 * 3600_000);
    const schedule = buildFollowUpSchedule(CREATED_AT, [0, 24, 72], now);
    expect(urgencyOf(schedule, "new", now)).toBe("done");
  });

  it("is done when a human already marked the lead contacted, regardless of schedule", () => {
    const now = new Date(CREATED_AT.getTime());
    const schedule = buildFollowUpSchedule(CREATED_AT, [], now);
    expect(urgencyOf(schedule, "contacted", now)).toBe("done");
  });
});
