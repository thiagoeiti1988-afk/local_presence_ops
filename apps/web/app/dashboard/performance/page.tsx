import { getDemoRepository } from "../../../lib/demo-repository";

const FIELDS = [
  ["views", "Views"],
  ["searches", "Searches"],
  ["calls", "Calls"],
  ["websiteClicks", "Website Clicks"],
  ["directions", "Directions"],
  ["bookings", "Bookings"],
] as const;

export default async function PerformancePage() {
  const { performance } = await getDemoRepository();

  return (
    <div>
      <h1>Performance</h1>
      <table>
        <thead>
          <tr>
            <th>Metric</th>
            <th>Current period</th>
            <th>Previous period</th>
            <th>Change</th>
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
                <td>{change === null || change === undefined ? "—" : `${change > 0 ? "+" : ""}${change}%`}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <p style={{ color: "var(--muted)" }}>
        Entered manually until Google Business Profile API access is
        available — see docs/GOOGLE_API.md.
      </p>
    </div>
  );
}
