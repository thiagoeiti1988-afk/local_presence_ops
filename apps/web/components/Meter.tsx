import { scoreTone, type StatusTone } from "../lib/status";

export function Meter({
  label,
  value,
  hero = false,
  tone,
  sublabel,
}: {
  label: string;
  value: number;
  hero?: boolean;
  tone?: StatusTone;
  sublabel?: string;
}) {
  const clamped = Math.max(0, Math.min(100, value));
  const resolvedTone = tone ?? scoreTone(clamped);

  return (
    <div className={`meter${hero ? " hero" : ""}`}>
      <div className="meter-head">
        <span className="meter-name">{label}</span>
        <span className="meter-value">{Math.round(clamped)}/100</span>
      </div>
      <div
        className="meter-track"
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label}
      >
        <div className={`meter-fill ${resolvedTone}`} style={{ width: `${clamped}%` }} />
      </div>
      {sublabel ? (
        <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>{sublabel}</span>
      ) : null}
    </div>
  );
}
