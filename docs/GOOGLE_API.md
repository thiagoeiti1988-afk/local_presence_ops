# Google Business Profile API

The MVP does not require Google API access to function — every page and
workflow runs on `MockBusinessProfileProvider` (tests, demo) or
`ManualBusinessProfileProvider` (real usage: staff observe the profile and
type in what they see). This document explains what real access would
involve if/when the hypothesis is validated and it's worth pursuing.

## Do not assume approval

Google's Business Profile APIs (the relevant ones: **My Business Business
Information API**, **My Business Q&A API**, and the review/posts endpoints
under **Business Profile Performance API** / legacy **My Business API**
surfaces) require an access request that Google reviews manually — it is
**not** a self-serve API key. Approval can take days to weeks, can be
rejected, and can require demonstrating a legitimate, non-spam use case
(this product's "reply to reviews on behalf of a client" use case is exactly
the kind of thing Google's review process scrutinizes). Do not build a
launch plan that assumes this access will exist by a specific date.

## What the flow looks like once access is granted

1. **Google Cloud project.** Create one, enable the relevant Business
   Profile APIs on it.
2. **OAuth consent screen + API access request.** Submit the access request
   form describing the use case; wait for approval.
3. **OAuth 2.0 flow.** Each client authorizes this app (never the other way
   around — this app never stores a client's Google *password*, only an
   OAuth token scoped to the Business Profile APIs, revocable by the client
   at any time).
4. **Quota.** Google enforces per-project quota on these APIs; a
   multi-tenant product needs to plan for one shared project's quota being
   divided across all clients, not one project per client.
5. **Required permissions.** The authorizing Google account must be a
   manager or owner of the specific Business Profile location being
   connected.

## Implementation seam

`packages/providers/src/business-profile/google-business-profile-provider.ts`
is a skeleton: it implements `BusinessProfileProvider` but every method
rejects with "not implemented yet" until someone fills it in against a real,
approved API. Constructing the class never requires real credentials — the
type can be referenced anywhere without forcing a Google Cloud project on
every environment (local dev, CI, demo).

## Until then

`ManualBusinessProfileProvider` (backed by whatever data store the app
uses — Supabase in production, the in-memory demo store locally) is the
real product for the MVP: staff look at the client's live Google Business
Profile and Google Search/Maps results, and enter what they observe through
the dashboard. This is also what the public `/audit` lead magnet does — see
`apps/web/app/audit/actions.ts`.
