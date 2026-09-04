import { getDemoRepository } from "../../../lib/demo-repository";

export default async function AuditsPage() {
  const { audit } = await getDemoRepository();

  return (
    <div>
      <h1>Audits</h1>
      <div className="card" style={{ maxWidth: 260 }}>
        <div className="stat-label">Local Presence Score</div>
        <div className="stat-value">{audit.score}/100</div>
      </div>

      {Object.values(audit.sections).map((section) => (
        <div key={section.section}>
          <h2 className="section-title">
            {section.section} — {section.score}/100 (weight{" "}
            {Math.round(section.weight * 100)}%)
          </h2>
          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th>Status</th>
                <th>Severity</th>
                <th>Description</th>
                <th>Recommended action</th>
              </tr>
            </thead>
            <tbody>
              {section.items.map((item) => (
                <tr key={item.key}>
                  <td>{item.label}</td>
                  <td>
                    <span className={`badge ${item.status}`}>{item.status}</span>
                  </td>
                  <td>{item.severity}</td>
                  <td>{item.description}</td>
                  <td>{item.recommendedAction}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}
