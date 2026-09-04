export function StatTile({
  label,
  value,
  deltaPercent,
  deltaGoodDirection = "up",
}: {
  label: string;
  value: string | number;
  /** Signed percent change vs. the previous period, or null/undefined if unknown. */
  deltaPercent?: number | null;
  /** Whether an increase counts as good for this metric (true for calls/clicks, could be false for e.g. bounce rate). */
  deltaGoodDirection?: "up" | "down";
}) {
  const hasDelta = deltaPercent !== null && deltaPercent !== undefined;
  const direction = hasDelta ? (deltaPercent === 0 ? "flat" : deltaPercent > 0 ? "up" : "down") : null;
  const isGood =
    direction === "flat"
      ? null
      : direction === "up"
        ? deltaGoodDirection === "up"
        : deltaGoodDirection === "down";

  return (
    <div className="card stat-tile">
      <div className="stat-label">{label}</div>
      <div className="stat-value">{value}</div>
      {hasDelta ? (
        <div className={`stat-delta ${isGood === null ? "flat" : isGood ? "positive" : "negative"}`}>
          {deltaPercent! > 0 ? "▲" : deltaPercent! < 0 ? "▼" : "–"} {Math.abs(deltaPercent!)}%{" "}
          <span style={{ color: "var(--text-muted)", fontWeight: 400 }}>vs. mês anterior</span>
        </div>
      ) : null}
    </div>
  );
}
