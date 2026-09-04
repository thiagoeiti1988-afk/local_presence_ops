import type { LocalPresenceAudit } from "@local-presence-ops/audit";

export interface Lead {
  id: string;
  businessName: string;
  city: string;
  website: string | null;
  googleProfileUrl: string | null;
  score: number;
  createdAt: string;
}

const MAX_LEADS = 200;

/**
 * In-memory only. Stored on `globalThis`, not a plain module-level array —
 * Next.js bundles the Server Action (audit/actions.ts) and the page
 * (dashboard/leads/page.tsx) into separate server chunks, and each chunk
 * gets its own instantiation of an imported module's top-level bindings
 * even within the same Node process. `globalThis` is the one thing actually
 * shared across those chunks. (Confirmed the hard way: a plain module array
 * silently produced two disconnected lists — one per chunk — with no error
 * of any kind.)
 *
 * This still does NOT survive a restart or a new deploy, and cannot be
 * trusted to be the same instance across requests on serverless platforms
 * that may route to different warm instances. Real persistence needs the
 * `leads` table in supabase/migrations/0002_leads.sql once a Supabase
 * project is connected — see docs/DEPLOYMENT.md.
 */
declare global {
  var __localPresenceOpsLeads: Lead[] | undefined;
}

function store(): Lead[] {
  globalThis.__localPresenceOpsLeads ??= [];
  return globalThis.__localPresenceOpsLeads;
}

export function recordLead(input: Omit<Lead, "id" | "createdAt">): Lead {
  const lead: Lead = {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    ...input,
  };
  const leads = store();
  leads.push(lead);
  if (leads.length > MAX_LEADS) leads.shift();
  return lead;
}

export function listLeads(): Lead[] {
  return [...store()].reverse();
}

export function buildLeadFromAudit(
  audit: LocalPresenceAudit,
  fields: { businessName: string; city: string; website: string | null; googleProfileUrl: string | null },
): Lead {
  return recordLead({
    businessName: fields.businessName,
    city: fields.city,
    website: fields.website,
    googleProfileUrl: fields.googleProfileUrl,
    score: audit.score,
  });
}
