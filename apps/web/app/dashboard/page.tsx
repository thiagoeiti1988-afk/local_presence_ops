import { DEMO_AGGREGATES, getDemoRepository } from "../../lib/demo-repository";
import { Meter } from "../../components/Meter";
import { StatTile } from "../../components/StatTile";
import { scoreTone } from "../../lib/status";

const SECTION_LABELS: Record<string, string> = {
  profileCompleteness: "Completude do perfil",
  reputation: "Reputação",
  contentActivity: "Atividade de conteúdo",
  conversionReadiness: "Pronto para converter",
};

export default async function OverviewPage() {
  const { client, location, audit, posts, performance } =
    await getDemoRepository();

  const tone = scoreTone(audit.score);
  const toneLabel =
    tone === "good"
      ? "Bom"
      : tone === "warning"
        ? "Atenção"
        : tone === "serious"
          ? "Sério"
          : "Crítico";

  return (
    <div>
      <div className="page-header">
        <h1>{client.name}</h1>
        <p>
          {location.address} — {location.city}/{location.region}
        </p>
      </div>

      <div className="card">
        <Meter
          label={`Local Presence Score — ${toneLabel}`}
          value={audit.score}
          hero
        />
        <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginTop: "0.75rem" }}>
          Combina 4 áreas com pesos fixos e determinísticos — nenhuma IA decide a
          nota. Veja o detalhe em{" "}
          <a href="/dashboard/audits">Auditoria</a> e o significado de cada área no{" "}
          <a href="/dashboard/help">Glossário</a>.
        </p>
      </div>

      <h2 className="section-title">Composição do score</h2>
      <div className="grid">
        {Object.values(audit.sections).map((section) => (
          <div className="card" key={section.section}>
            <Meter
              label={SECTION_LABELS[section.section] ?? section.section}
              value={section.score}
              sublabel={`peso ${Math.round(section.weight * 100)}%`}
            />
          </div>
        ))}
      </div>

      <h2 className="section-title">Reputação e conteúdo</h2>
      <div className="grid">
        <StatTile label="Avaliações" value={DEMO_AGGREGATES.reviewCount} />
        <StatTile label="Nota média" value={DEMO_AGGREGATES.averageRating.toFixed(1)} />
        <StatTile label="Sem resposta" value={DEMO_AGGREGATES.unansweredReviews} />
        <StatTile label="Publicações no mês" value={posts.length} />
      </div>

      <h2 className="section-title">Desempenho (vs. mês anterior)</h2>
      <div className="grid">
        <StatTile
          label="Ligações"
          value={performance.current.calls}
          deltaPercent={performance.changePercent.calls}
        />
        <StatTile
          label="Cliques no site"
          value={performance.current.websiteClicks}
          deltaPercent={performance.changePercent.websiteClicks}
        />
        <StatTile
          label="Rotas traçadas"
          value={performance.current.directions}
          deltaPercent={performance.changePercent.directions}
        />
      </div>
    </div>
  );
}
