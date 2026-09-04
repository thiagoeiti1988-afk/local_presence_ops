"use client";

import { useState, useTransition } from "react";
import type { LocalPresenceAudit } from "@local-presence-ops/audit";
import { runManualAudit } from "./actions";
import { Meter } from "../../components/Meter";

const SECTION_LABELS: Record<string, string> = {
  profileCompleteness: "Completude do perfil",
  reputation: "Reputação",
  contentActivity: "Atividade de conteúdo",
  conversionReadiness: "Pronto para converter",
};

export function AuditForm() {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<LocalPresenceAudit | null>(null);
  const [error, setError] = useState<string | null>(null);

  return (
    <div>
      <form
        className="audit-form"
        action={(formData: FormData) => {
          setError(null);
          startTransition(async () => {
            const outcome = await runManualAudit(formData);
            if ("error" in outcome) {
              setError(outcome.error);
              setResult(null);
            } else {
              setResult(outcome.audit);
            }
          });
        }}
      >
        <label>
          Nome do negócio *
          <input name="businessName" required />
        </label>
        <label>
          Cidade *
          <input name="city" required />
        </label>
        <label>
          Website
          <input name="website" type="url" />
        </label>
        <label>
          URL do Google Business Profile
          <input name="googleProfileUrl" type="url" />
        </label>
        <label>
          Categoria
          <input name="category" />
        </label>
        <label>
          Endereço
          <input name="address" />
        </label>
        <label>
          Telefone
          <input name="phone" />
        </label>
        <label>
          Horário de funcionamento completo no perfil?
          <select name="openingHoursComplete" defaultValue="">
            <option value="">Não observado</option>
            <option value="yes">Sim</option>
            <option value="no">Não</option>
          </select>
        </label>
        <label>
          Quantidade de fotos
          <input name="photoCount" type="number" min={0} />
        </label>
        <label>
          Quantidade de avaliações
          <input name="reviewCount" type="number" min={0} />
        </label>
        <label>
          Nota média (0-5)
          <input name="averageRating" type="number" min={0} max={5} step="0.1" />
        </label>
        <label>
          Avaliações sem resposta
          <input name="unansweredReviews" type="number" min={0} />
        </label>
        <label>
          Dias desde a última publicação
          <input name="latestPostDaysAgo" type="number" min={0} />
        </label>
        <label>
          URL de agendamento
          <input name="bookingUrl" type="url" />
        </label>
        <button className="primary" type="submit" disabled={isPending}>
          {isPending ? "Calculando..." : "Rodar auditoria"}
        </button>
      </form>

      {error ? <p style={{ color: "var(--status-critical)" }}>{error}</p> : null}

      {result ? (
        <div className="card" style={{ marginTop: "1.5rem", maxWidth: 480 }}>
          <Meter label="Local Presence Score" value={result.score} hero />
          <div style={{ marginTop: "1rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {Object.values(result.sections).map((section) => (
              <Meter
                key={section.section}
                label={SECTION_LABELS[section.section] ?? section.section}
                value={section.score}
              />
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
