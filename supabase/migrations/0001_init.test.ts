import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const sql = readFileSync(
  fileURLToPath(new URL("./0001_init.sql", import.meta.url)),
  "utf-8",
);

const TENANT_TABLES = [
  "clients",
  "locations",
  "reviews",
  "local_posts",
  "performance_metrics",
  "audits",
];

describe("0001_init.sql — row level security", () => {
  it.each(TENANT_TABLES)("enables RLS on %s", (table) => {
    expect(sql).toMatch(new RegExp(`alter table ${table} enable row level security`));
  });

  it.each(TENANT_TABLES)("defines at least one policy on %s", (table) => {
    expect(sql).toMatch(new RegExp(`create policy \\w+ on ${table}`));
  });

  for (const table of ["locations", "reviews", "local_posts", "performance_metrics", "audits"]) {
    it(`${table} carries a client_id column for tenant isolation`, () => {
      const tableBlock = sql.slice(sql.indexOf(`create table if not exists ${table}`));
      expect(tableBlock.slice(0, tableBlock.indexOf(");"))).toMatch(
        /client_id uuid not null references clients/,
      );
    });
  }

  it("scopes every tenant-isolation policy to client_users membership", () => {
    const policyBlocks = sql.match(/create policy \w+_tenant_isolation[\s\S]*?;/g) ?? [];
    expect(policyBlocks.length).toBeGreaterThan(0);
    for (const block of policyBlocks) {
      expect(block).toContain("select client_id from client_users where user_id = auth.uid()");
    }
  });
});
