# WhatsApp

Two ways this codebase can put a message in front of a lead or a client on
WhatsApp, mirroring the Mock/Manual/real-skeleton pattern already used for
Google (see [GOOGLE_API.md](GOOGLE_API.md)) and content generation (see
[CONTENT.md](CONTENT.md)).

## `ManualWhatsAppProvider` — what's live today

No API, no Meta approval, no cost. It builds a `wa.me/<phone>?text=<message>`
deep link — clicking it opens WhatsApp (desktop or mobile) with the message
pre-filled, and a human presses send. This is what powers the follow-up
queue on `/dashboard/leads`: a lead's next scheduled message
(T+0/T+24h/T+72h — see below) is rendered as an "Abrir WhatsApp" link.

Because a human sends it, there is no delivery confirmation from WhatsApp
itself — "confirmar envio" on that page is a human saying "I sent this",
not a system-verified delivery receipt. That's an accepted tradeoff for
shipping today without a Meta Business API approval in the loop.

## `MetaWhatsAppProvider` — the real bot, not implemented yet

A skeleton only (`packages/providers/src/whatsapp/meta-whatsapp-provider.ts`),
modeled directly on the WhatsApp Cloud (Graph) API used in the
`clinic-whatsapp-scheduling-mvp` project: `POST
graph.facebook.com/{version}/{phone_number_id}/messages` with a bearer
token. Every method rejects until it's actually wired up. Two real
requirements stand between here and a working bot:

1. **A provisioned Meta Business WhatsApp phone number** (`WHATSAPP_PHONE_NUMBER_ID`,
   `WHATSAPP_ACCESS_TOKEN`) — a Meta Business Manager setup step, not a
   code change.
2. **An approved message template** for any message sent to someone who
   hasn't messaged this number in the last 24 hours. A proactive follow-up
   on a lead who found us through `/audit` is exactly that case — Meta
   requires the template to go through their review process before it can
   be used. This is the same kind of external approval dependency as the
   Google Business Profile API (see [GOOGLE_API.md](GOOGLE_API.md)) — don't
   plan a launch date around it.

## Adding a real conversational bot (inbound messages)

`ManualWhatsAppProvider`/`MetaWhatsAppProvider` only cover outbound
messages. A two-way bot (patients replying, confirming, rescheduling) is a
materially bigger project — webhook endpoint, signature verification,
conversation state, message parsing — all already built and tested in
`clinic-whatsapp-scheduling-mvp` for appointment scheduling. If this
product needs that later, port that project's `webhook-handler.ts` /
`conversation-engine.ts` pattern rather than building it from scratch; the
shape (Express webhook route → signature check → conversation state
machine) is proven.

## Where the follow-up cadence itself lives

The T+0/T+24h/T+72h schedule, message templates, and urgency bucketing
(`overdue`/`dueSoon`/`scheduled`/`done`) are in `packages/followup` —
deterministic and provider-agnostic. It works the same whether the message
ends up going out via `ManualWhatsAppProvider`'s wa.me link or, later, a
real `MetaWhatsAppProvider` send. This split is deliberate: swapping the
channel never touches the scheduling logic.
