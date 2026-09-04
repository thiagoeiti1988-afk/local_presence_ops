import type { StatusPresentation } from "../lib/status";

export function StatusBadge({ tone, icon, label }: StatusPresentation) {
  return (
    <span className={`badge ${tone}`}>
      <span aria-hidden="true">{icon}</span>
      {label}
    </span>
  );
}
