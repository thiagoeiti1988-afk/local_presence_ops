import { getDemoRepository } from "../../../lib/demo-repository";

const FIELDS = [
  ["views", "Visualizações"],
  ["searches", "Buscas"],
  ["calls", "Ligações"],
  ["websiteClicks", "Cliques no site"],
  ["directions", "Rotas traçadas"],
  ["bookings", "Agendamentos"],
] as const;

export default async function PerformancePage() {
  const { performance } = await getDemoRepository();

  return (
    <div>
      <div className="page-header">
        <h1>Desempenho</h1>
        <p>
          Inserido manualmente até que a Google Business Profile API esteja
          disponível — veja <a href="/dashboard/help">Glossário</a> para o porquê.
        </p>
      </div>
      <table>
        <thead>
          <tr>
            <th>Métrica</th>
            <th>Período atual</th>
            <th>Período anterior</th>
            <th>Variação</th>
          </tr>
        </thead>
        <tbody>
          {FIELDS.map(([key, label]) => {
            const change = performance.changePercent[key];
            return (
              <tr key={key}>
                <td>{label}</td>
                <td>{performance.current[key]}</td>
                <td>{performance.previous[key]}</td>
                <td>
                  {change === null || change === undefined
                    ? "—"
                    : `${change > 0 ? "+" : ""}${change}%`}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
