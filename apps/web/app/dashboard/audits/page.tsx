import { getDemoRepository } from "../../../lib/demo-repository";
import { Meter } from "../../../components/Meter";
import { StatusBadge } from "../../../components/StatusBadge";
import { auditItemStatus } from "../../../lib/status";

const SECTION_LABELS: Record<string, string> = {
  profileCompleteness: "Completude do perfil",
  reputation: "Reputação",
  contentActivity: "Atividade de conteúdo",
  conversionReadiness: "Pronto para converter",
};

export default async function AuditsPage() {
  const { audit } = await getDemoRepository();

  const allItems = Object.values(audit.sections).flatMap((s) => s.items);
  const priorities = allItems
    .filter((item) => item.status !== "pass")
    .sort((a, b) => (a.status === "fail" ? -1 : 1) - (b.status === "fail" ? -1 : 1))
    .slice(0, 5);

  return (
    <div>
      <div className="page-header">
        <h1>Auditoria</h1>
        <p>
          Gerada em {new Date(audit.generatedAt).toLocaleDateString("pt-BR")}. Cada
          item tem uma ação recomendada — veja também o{" "}
          <a href="/dashboard/help">Glossário</a> para o que cada status
          significa.
        </p>
      </div>

      <div className="card">
        <Meter label="Local Presence Score" value={audit.score} hero />
      </div>

      {priorities.length > 0 ? (
        <>
          <h2 className="section-title">Top prioridades</h2>
          <div className="grid">
            {priorities.map((item) => {
              const presentation = auditItemStatus(item.status);
              return (
                <div className="card" key={item.key}>
                  <StatusBadge {...presentation} />
                  <h3 style={{ margin: "0.5rem 0 0.25rem", fontSize: "0.95rem" }}>
                    {item.label}
                  </h3>
                  <p style={{ margin: 0, color: "var(--text-secondary)", fontSize: "0.85rem" }}>
                    {item.recommendedAction}
                  </p>
                </div>
              );
            })}
          </div>
        </>
      ) : null}

      {Object.values(audit.sections).map((section) => (
        <div key={section.section}>
          <h2 className="section-title">
            {SECTION_LABELS[section.section] ?? section.section} (
            {Math.round(section.weight * 100)}% do score)
          </h2>
          <div className="card" style={{ marginBottom: "0.75rem" }}>
            <Meter label="Nota da área" value={section.score} />
          </div>
          <div className="grid">
            {section.items.map((item) => {
              const presentation = auditItemStatus(item.status);
              return (
                <div className="card" key={item.key}>
                  <StatusBadge {...presentation} />
                  <h3 style={{ margin: "0.5rem 0 0.25rem", fontSize: "0.9rem" }}>
                    {item.label}
                  </h3>
                  <p style={{ margin: "0 0 0.4rem", color: "var(--text-secondary)", fontSize: "0.82rem" }}>
                    {item.description}
                  </p>
                  {item.status !== "pass" ? (
                    <p style={{ margin: 0, fontSize: "0.82rem" }}>
                      <strong>Ação:</strong> {item.recommendedAction}
                    </p>
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
