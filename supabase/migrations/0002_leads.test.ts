import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const sql = readFileSync(
  fileURLToPath(new URL("./0002_leads.sql", import.meta.url)),
  "utf-8",
);

describe("0002_leads.sql", () => {
  it("enables row level security on leads", () => {
    expect(sql).toMatch(/alter table leads enable row level security/);
  });

  it("defines a policy on leads", () => {
    expect(sql).toMatch(/create policy \w+ on leads/);
  });

  it("does NOT carry a client_id — a lead has no client yet", () => {
    const tableBlock = sql.slice(
      sql.indexOf("create table if not exists leads"),
      sql.indexOf(");"),
    );
    expect(tableBlock).not.toMatch(/client_id/);
  });

  it("scopes access to authenticated staff, not tenant membership", () => {
    const policyBlock = sql.slice(sql.indexOf("create policy leads_staff_access"));
    expect(policyBlock).toContain("auth.role() = 'authenticated'");
    expect(policyBlock).not.toContain("client_users");
  });
});
