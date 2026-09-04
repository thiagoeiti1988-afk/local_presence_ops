# Validation plan

## The hypothesis

Small businesses will pay monthly for monitoring, maintenance, review
replies, content, and simple reporting on their Google Search/Maps
presence.

## What this MVP is for

Not to build a complete product — to test the hypothesis above as cheaply as
possible. Every "NOT" in the original brief (no full SEO platform, no
billing, no ranking promises, no aggressive scraping, no required Google
API, no Core AI integration) exists to keep the cost of finding out low.

## How to actually validate it

1. **Use the `/audit` lead magnet on real prospects.** Fill in what you
   observe on 10-20 real small businesses' Google Business Profiles. The
   score and recommendations are the pitch — see if a low score prompts a
   conversation, not just a "huh, interesting."
2. **Manually operate 1-3 paying (or pilot) clients** through
   `ManualBusinessProfileProvider` for a full month: reply to their reviews
   (through the approval workflow — see [REVIEWS.md](REVIEWS.md)), draft and
   publish their posts, enter performance numbers weekly, and send the
   monthly report `packages/reports` generates. This validates the
   *workflow*, not just the sales pitch.
3. **Ask directly whether they'd pay**, and how much, before building
   anything the brief explicitly excluded (billing, deeper SEO tooling,
   automated Google sync). Building those before hearing "yes, and here's
   what I'd pay" inverts the point of an MVP.

## What would justify building the excluded pieces

- **Google API integration** — once 2+ clients are paying and manual data
  entry is the visible bottleneck to serving more of them (see
  [GOOGLE_API.md](GOOGLE_API.md) for the actual access process, which takes
  real lead time — start the request when this trigger is hit, not before).
- **Billing** — once there's a client who has explicitly agreed to pay and
  is waiting on an invoice, not before.
- **Core AI integration** — the `ReasoningProvider`/`PolicyProvider`/
  `ResearchProvider` ports exist so this is a drop-in later, not a
  refactor — but nothing calls them today, and nothing should until there's
  a concrete capability gap `RuleBasedContentProvider`/manual review can't
  cover.

## Signal to watch for that the hypothesis is wrong

If prospects engage with the audit but consistently balk at "monthly," or
if the actions taken (review replies, posts) don't correlate with anything
they say they value in a follow-up call, that's a stronger signal than
score-card metrics inside the product itself.
