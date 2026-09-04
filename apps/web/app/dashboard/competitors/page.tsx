import { DEMO_AGGREGATES, getDemoRepository } from "../../../lib/demo-repository";
import { StatTile } from "../../../components/StatTile";

export default async function CompetitorsPage() {
  const { competitors, location } = await getDemoRepository();

  const ourRating = DEMO_AGGREGATES.averageRating;
  const ratedCompetitors = competitors.filter(
    (c): c is typeof c & { averageRating: number } => c.averageRating !== null,
  );
  const averageCompetitorRating =
    ratedCompetitors.length > 0
      ? ratedCompetitors.reduce((sum, c) => sum + c.averageRating, 0) /
        ratedCompetitors.length
      : null;

  return (
    <div>
      <div className="page-header">
        <h1>Concorrência</h1>
        <p>
          Negócios da mesma categoria próximos a {location.name} (raio de
          5&nbsp;km). Hoje mostra dados de exemplo — a versão real consulta a
          API do Google Places, exige a coordenada da unidade e uma chave de
          API configurada (ver docs/COMPETITIVE.md).
        </p>
      </div>

      <div className="grid">
        <StatTile label="Concorrentes no raio" value={competitors.length} />
        <StatTile
          label="Nota média deles"
          value={averageCompetitorRating?.toFixed(1) ?? "—"}
        />
        <StatTile label="Sua nota média" value={ourRating.toFixed(1)} />
      </div>

      <h2 className="section-title">Concorrentes próximos</h2>
      <div className="grid">
        {competitors.map((competitor) => {
          const ratingGap =
            competitor.averageRating !== null
              ? Math.round((competitor.averageRating - ourRating) * 10) / 10
              : null;
          return (
            <div className="card" key={competitor.name}>
              <h3 style={{ margin: "0 0 0.25rem", fontSize: "0.95rem" }}>
                {competitor.name}
              </h3>
              <p style={{ margin: "0 0 0.5rem", color: "var(--text-secondary)", fontSize: "0.85rem" }}>
                {competitor.category}
                {competitor.distanceKm !== null
                  ? ` · ${competitor.distanceKm} km`
                  : ""}
              </p>
              <p style={{ margin: 0, fontSize: "0.85rem" }}>
                {competitor.averageRating !== null
                  ? `★ ${competitor.averageRating.toFixed(1)}`
                  : "Sem nota"}
                {competitor.reviewCount !== null
                  ? ` (${competitor.reviewCount} avaliações)`
                  : ""}
              </p>
              {ratingGap !== null ? (
                <p
                  style={{
                    margin: "0.35rem 0 0",
                    fontSize: "0.8rem",
                    color:
                      ratingGap > 0
                        ? "var(--status-critical)"
                        : "var(--status-good)",
                  }}
                >
                  {ratingGap > 0
                    ? `${ratingGap.toFixed(1)} acima da sua nota`
                    : ratingGap < 0
                      ? `${Math.abs(ratingGap).toFixed(1)} abaixo da sua nota`
                      : "Mesma nota que a sua"}
                </p>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}
