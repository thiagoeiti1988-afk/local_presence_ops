import { listLeads, type Lead } from "../../../lib/leads-store";
import {
  buildFollowUpSchedule,
  nextActionableStep,
  urgencyOf,
  followUpMessage,
  type UrgencyBucket,
} from "@local-presence-ops/followup";
import { ManualWhatsAppProvider } from "@local-presence-ops/providers";
import { StatusBadge } from "../../../components/StatusBadge";
import { auditItemStatus } from "../../../lib/status";
import { confirmFollowUpSent, markLeadContacted } from "./actions";

// This reads a mutable in-memory store on every request — without this,
// Next.js would statically prerender the page once at build time and freeze
// the leads list at whatever it was then (empty).
export const dynamic = "force-dynamic";

const whatsapp = new ManualWhatsAppProvider();

function scoreStatus(score: number): "pass" | "warning" | "fail" {
  if (score >= 80) return "pass";
  if (score >= 60) return "warning";
  return "fail";
}

const BUCKET_LABEL: Record<UrgencyBucket, string> = {
  overdue: "Atrasado",
  dueSoon: "Próximas 24h",
  scheduled: "Agendado",
  done: "Concluído",
};

async function LeadRow({ lead }: { lead: Lead }) {
  const schedule = buildFollowUpSchedule(new Date(lead.createdAt), lead.sentFollowUps);
  const step = nextActionableStep(schedule);
  const message = step ? followUpMessage(step.offsetHours, lead.businessName) : null;
  const waLink = lead.phone && message ? (await whatsapp.sendText(lead.phone, message)).url : null;

  return (
    <tr>
      <td>{lead.businessName}</td>
      <td>{lead.city}</td>
      <td>
        <StatusBadge {...auditItemStatus(scoreStatus(lead.score))} /> {lead.score}/100
      </td>
      <td>
        {step ? `T+${step.offsetHours}h` : "—"}
      </td>
      <td>
        {waLink ? (
          <a href={waLink} target="_blank" rel="noreferrer">
            Abrir WhatsApp
          </a>
        ) : (
          <span style={{ color: "var(--text-muted)" }}>sem telefone</span>
        )}
      </td>
      <td style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
        {step ? (
          <form action={confirmFollowUpSent}>
            <input type="hidden" name="leadId" value={lead.id} />
            <input type="hidden" name="offsetHours" value={step.offsetHours} />
            <button type="submit" className="primary" style={{ padding: "0.3rem 0.6rem", fontSize: "0.78rem" }}>
              Confirmar envio
            </button>
          </form>
        ) : null}
        <form action={markLeadContacted}>
          <input type="hidden" name="leadId" value={lead.id} />
          <button
            type="submit"
            style={{
              padding: "0.3rem 0.6rem",
              fontSize: "0.78rem",
              borderRadius: "6px",
              border: "1px solid var(--border-strong)",
              background: "var(--surface)",
              color: "var(--text-secondary)",
              cursor: "pointer",
            }}
          >
            Marcar contatado
          </button>
        </form>
      </td>
    </tr>
  );
}

export default async function LeadsPage() {
  const leads = listLeads();

  const buckets: Record<UrgencyBucket, Lead[]> = {
    overdue: [],
    dueSoon: [],
    scheduled: [],
    done: [],
  };

  for (const lead of leads) {
    const schedule = buildFollowUpSchedule(new Date(lead.createdAt), lead.sentFollowUps);
    buckets[urgencyOf(schedule, lead.status)].push(lead);
  }

  return (
    <div>
      <div className="page-header">
        <h1>Leads (formulário público)</h1>
        <p>
          Toda auditoria rodada em <a href="/audit">/audit</a> entra na fila
          de follow-up T+0 / T+24h / T+72h — mesmo modelo do{" "}
          <code>lead_rescuer</code>. Veja o fluxo completo no{" "}
          <a href="/dashboard/help">Glossário</a>.
        </p>
      </div>

      <div className="callout" style={{ marginBottom: "1.5rem" }}>
        <strong>Armazenamento em memória:</strong> esta lista vive no processo
        do servidor — some se o app reiniciar ou for feito um novo deploy. O
        link de WhatsApp abre uma conversa manual (<code>wa.me</code>, sem API
        da Meta) — "confirmar envio" é você dizendo que mandou, não uma
        confirmação de entrega. Para persistência e envio automático de
        verdade, ver <code>docs/WHATSAPP.md</code> e{" "}
        <code>docs/DEPLOYMENT.md</code> no repositório.
      </div>

      {leads.length === 0 ? (
        <p style={{ color: "var(--text-muted)" }}>
          Nenhum lead ainda. Rode uma auditoria em <a href="/audit">/audit</a>{" "}
          para ver um aparecer aqui.
        </p>
      ) : (
        (["overdue", "dueSoon", "scheduled"] as const).map((bucket) =>
          buckets[bucket].length === 0 ? null : (
            <div key={bucket}>
              <h2 className="section-title">
                {BUCKET_LABEL[bucket]} ({buckets[bucket].length})
              </h2>
              <table>
                <thead>
                  <tr>
                    <th>Negócio</th>
                    <th>Cidade</th>
                    <th>Score</th>
                    <th>Próximo passo</th>
                    <th>WhatsApp</th>
                    <th>Ação</th>
                  </tr>
                </thead>
                <tbody>
                  {buckets[bucket].map((lead) => (
                    <LeadRow key={lead.id} lead={lead} />
                  ))}
                </tbody>
              </table>
            </div>
          ),
        )
      )}

      {buckets.done.length > 0 ? (
        <div>
          <h2 className="section-title">Concluído ({buckets.done.length})</h2>
          <table>
            <thead>
              <tr>
                <th>Negócio</th>
                <th>Cidade</th>
                <th>Score</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {buckets.done.map((lead) => (
                <tr key={lead.id}>
                  <td>{lead.businessName}</td>
                  <td>{lead.city}</td>
                  <td>{lead.score}/100</td>
                  <td>{lead.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </div>
  );
}
