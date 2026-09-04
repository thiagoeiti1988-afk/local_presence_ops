import { getDemoRepository } from "../../lib/demo-repository";

export default async function OverviewPage() {
  const { client, location, audit, reviews, posts, performance } =
    await getDemoRepository();

  const unanswered = reviews.filter(
    (r) => r.status === "new" || r.status === "drafted",
  ).length;

  const stats = [
    { label: "Local Presence Score", value: `${audit.score}/100` },
    { label: "Reviews", value: reviews.length },
    { label: "Average Rating", value: "4.5" },
    { label: "Unanswered Reviews", value: unanswered },
    { label: "Posts This Month", value: posts.length },
    { label: "Calls", value: performance.current.calls },
    { label: "Website Clicks", value: performance.current.websiteClicks },
    { label: "Directions", value: performance.current.directions },
  ];

  return (
    <div>
      <h1>{client.name}</h1>
      <p style={{ color: "var(--muted)" }}>{location.address} — {location.city}/{location.region}</p>

      <div className="grid">
        {stats.map((stat) => (
          <div className="card" key={stat.label}>
            <div className="stat-label">{stat.label}</div>
            <div className="stat-value">{stat.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
