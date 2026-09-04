import { getDemoRepository } from "../../../lib/demo-repository";
import { Meter } from "../../../components/Meter";
import { StatTile } from "../../../components/StatTile";

export default async function ReportPage() {
  const { report } = await getDemoRepository();

  return (
    <div>
      <div className="page-header">
        <h1>Relatório mensal</h1>
        <p>
          {report.periodStart} a {report.periodEnd} — mesmos dados do painel,
          organizados para enviar ou apresentar ao cliente. Use{" "}
          <a href="/dashboard/report/print" target="_blank" rel="noreferrer">
            Abrir versão para impressão/PDF
          </a>{" "}
          para gerar um PDF pelo navegador (Ctrl/Cmd+P → Salvar como PDF).
        </p>
      </div>

      <div className="card">
        <Meter
          label="Local Presence Score"
          value={report.score}
          hero
          sublabel={
            report.scoreChange === null
              ? "Primeira nota registrada"
              : `${report.scoreChange >= 0 ? "+" : ""}${report.scoreChange} desde o período anterior`
          }
        />
      </div>

      <h2 className="section-title">Resumo</h2>
      <p>{report.summary}</p>

      <h2 className="section-title">Avaliações</h2>
      <div className="grid">
        <StatTile label="Novas no período" value={report.reviews.totalThisMonth} />
        <StatTile label="Nota média" value={report.reviews.averageRating ?? "—"} />
        <StatTile label="Sem resposta" value={report.reviews.unansweredReviews} />
      </div>

      <h2 className="section-title">Desempenho</h2>
      <div className="grid">
        <StatTile
          label="Visualizações"
          value={report.performance.totals.views}
          deltaPercent={report.performance.changePercent.views}
        />
        <StatTile
          label="Buscas"
          value={report.performance.totals.searches}
          deltaPercent={report.performance.changePercent.searches}
        />
        <StatTile
          label="Ligações"
          value={report.performance.totals.calls}
          deltaPercent={report.performance.changePercent.calls}
        />
        <StatTile
          label="Cliques no site"
          value={report.performance.totals.websiteClicks}
          deltaPercent={report.performance.changePercent.websiteClicks}
        />
        <StatTile
          label="Pedidos de rota"
          value={report.performance.totals.directions}
          deltaPercent={report.performance.changePercent.directions}
        />
        <StatTile
          label="Agendamentos"
          value={report.performance.totals.bookings}
          deltaPercent={report.performance.changePercent.bookings}
        />
      </div>

      <h2 className="section-title">Ações concluídas</h2>
      {report.completedActions.length > 0 ? (
        <ul>
          {report.completedActions.map((action) => (
            <li key={action}>{action}</li>
          ))}
        </ul>
      ) : (
        <p style={{ color: "var(--text-muted)" }}>Nenhuma ação registrada neste período.</p>
      )}

      <h2 className="section-title">Pendências</h2>
      {report.openIssues.length > 0 ? (
        <ul>
          {report.openIssues.map((issue) => (
            <li key={issue}>{issue}</li>
          ))}
        </ul>
      ) : (
        <p style={{ color: "var(--text-muted)" }}>Nenhuma pendência crítica.</p>
      )}

      <h2 className="section-title">Recomendações</h2>
      <ul>
        {report.recommendations.map((recommendation) => (
          <li key={recommendation}>{recommendation}</li>
        ))}
      </ul>
    </div>
  );
}
