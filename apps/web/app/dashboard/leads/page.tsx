import { listLeads } from "../../../lib/leads-store";
import { StatusBadge } from "../../../components/StatusBadge";
import { auditItemStatus } from "../../../lib/status";

// This reads a mutable in-memory store on every request — without this,
// Next.js would statically prerender the page once at build time and freeze
// the leads list at whatever it was then (empty).
export const dynamic = "force-dynamic";

function scoreStatus(score: number): "pass" | "warning" | "fail" {
  if (score >= 80) return "pass";
  if (score >= 60) return "warning";
  return "fail";
}

export default function LeadsPage() {
  const leads = listLeads();

  return (
    <div>
      <div className="page-header">
        <h1>Leads (formulário público)</h1>
        <p>
          Toda auditoria rodada em <a href="/audit">/audit</a> aparece aqui,
          mais recente primeiro.
        </p>
      </div>

      <div className="callout" style={{ marginBottom: "1.5rem" }}>
        <strong>Armazenamento em memória:</strong> esta lista vive no processo
        do servidor — some se o app reiniciar ou for feito um novo deploy.
        Para persistência de verdade entre deploys, é preciso conectar um
        Supabase real (tabela <code>leads</code> em{" "}
        <code>supabase/migrations/0002_leads.sql</code>, já pronta para uso —
        ver docs/DEPLOYMENT.md).
      </div>

      {leads.length === 0 ? (
        <p style={{ color: "var(--text-muted)" }}>
          Nenhum lead ainda. Rode uma auditoria em <a href="/audit">/audit</a>{" "}
          para ver um aparecer aqui.
        </p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Negócio</th>
              <th>Cidade</th>
              <th>Score</th>
              <th>Website</th>
              <th>Perfil do Google</th>
              <th>Quando</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => (
              <tr key={lead.id}>
                <td>{lead.businessName}</td>
                <td>{lead.city}</td>
                <td>
                  <StatusBadge {...auditItemStatus(scoreStatus(lead.score))} />{" "}
                  {lead.score}/100
                </td>
                <td>
                  {lead.website ? (
                    <a href={lead.website} target="_blank" rel="noreferrer">
                      site
                    </a>
                  ) : (
                    "—"
                  )}
                </td>
                <td>
                  {lead.googleProfileUrl ? (
                    <a href={lead.googleProfileUrl} target="_blank" rel="noreferrer">
                      perfil
                    </a>
                  ) : (
                    "—"
                  )}
                </td>
                <td>{new Date(lead.createdAt).toLocaleString("pt-BR")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
