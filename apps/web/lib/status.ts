export type StatusTone = "good" | "warning" | "serious" | "critical";

export interface StatusPresentation {
  tone: StatusTone;
  icon: string;
  label: string;
}

// Status color is never the only signal — every mapping below carries an
// icon and a Portuguese label alongside the tone (see docs/GLOSSARY.md and
// the dataviz skill's "icon + label" rule).

export function auditItemStatus(status: "pass" | "warning" | "fail"): StatusPresentation {
  switch (status) {
    case "pass":
      return { tone: "good", icon: "✓", label: "OK" };
    case "warning":
      return { tone: "warning", icon: "!", label: "Atenção" };
    case "fail":
      return { tone: "critical", icon: "✕", label: "Crítico" };
  }
}

export function reviewStatus(
  status: "new" | "drafted" | "approved" | "replied" | "escalated",
): StatusPresentation {
  switch (status) {
    case "new":
      return { tone: "critical", icon: "●", label: "Novo — sem resposta" };
    case "drafted":
      return { tone: "warning", icon: "✎", label: "Rascunho" };
    case "approved":
      return { tone: "warning", icon: "✓", label: "Aprovado" };
    case "replied":
      return { tone: "good", icon: "✓", label: "Respondido" };
    case "escalated":
      return { tone: "critical", icon: "▲", label: "Escalado" };
  }
}

export function postStatus(
  status: "draft" | "approved" | "published",
): StatusPresentation {
  switch (status) {
    case "draft":
      return { tone: "warning", icon: "✎", label: "Rascunho" };
    case "approved":
      return { tone: "warning", icon: "✓", label: "Aprovado" };
    case "published":
      return { tone: "good", icon: "✓", label: "Publicado" };
  }
}

/** Score/section meters: fixed thresholds on a 0-100 scale. */
export function scoreTone(score: number): StatusTone {
  if (score >= 80) return "good";
  if (score >= 60) return "warning";
  if (score >= 40) return "serious";
  return "critical";
}
