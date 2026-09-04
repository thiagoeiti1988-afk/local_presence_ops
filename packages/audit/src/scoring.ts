import { SCORE_WEIGHTS } from "@local-presence-ops/config";
import type {
  AuditInput,
  AuditItem,
  AuditSectionResult,
  AuditStatus,
} from "./types.js";

const STATUS_SCORE: Record<AuditStatus, number> = {
  pass: 100,
  warning: 50,
  fail: 0,
};

function item(
  key: string,
  label: string,
  status: AuditStatus,
  description: string,
  recommendedAction: string,
): AuditItem {
  return {
    key,
    label,
    status,
    severity: status === "fail" ? "high" : status === "warning" ? "medium" : "low",
    description,
    recommendedAction,
  };
}

function presence(
  key: string,
  label: string,
  value: string | null | undefined,
  fixHint: string,
): AuditItem {
  const present = Boolean(value && value.trim().length > 0);
  return item(
    key,
    label,
    present ? "pass" : "fail",
    present ? `${label} preenchido.` : `${label} não informado.`,
    present ? "Nenhuma ação necessária." : fixHint,
  );
}

function profileCompletenessItems(input: AuditInput): AuditItem[] {
  return [
    presence(
      "businessName",
      "Nome do negócio",
      input.businessName,
      "Adicione o nome exatamente como aparece na fachada/documentação.",
    ),
    presence(
      "category",
      "Categoria principal",
      input.category,
      "Defina uma categoria principal que corresponda ao serviço central oferecido.",
    ),
    presence(
      "address",
      "Endereço",
      input.address,
      "Adicione um endereço completo e verificável.",
    ),
    presence(
      "phone",
      "Telefone",
      input.phone,
      "Adicione um telefone local para contato direto do cliente.",
    ),
    presence(
      "website",
      "Website",
      input.website,
      "Vincule um site ou página de agendamento funcionando.",
    ),
    item(
      "openingHours",
      "Horário de funcionamento",
      input.openingHoursComplete === true
        ? "pass"
        : input.openingHoursComplete === false
          ? "fail"
          : "fail",
      input.openingHoursComplete
        ? "Horário de funcionamento completo."
        : "Horário de funcionamento ausente ou incompleto.",
      input.openingHoursComplete
        ? "Nenhuma ação necessária."
        : "Preencha o horário de todos os dias, incluindo exceções em feriados.",
    ),
    presence(
      "description",
      "Descrição do negócio",
      input.description,
      "Escreva uma descrição cobrindo o que o negócio faz e para quem atende.",
    ),
    item(
      "services",
      "Serviços listados",
      input.services && input.services.length > 0 ? "pass" : "fail",
      input.services && input.services.length > 0
        ? `${input.services.length} serviço(s) listado(s).`
        : "Nenhum serviço listado.",
      "Liste os serviços específicos oferecidos, não apenas a categoria.",
    ),
    item(
      "photos",
      "Fotos",
      (input.photoCount ?? 0) >= 10
        ? "pass"
        : (input.photoCount ?? 0) > 0
          ? "warning"
          : "fail",
      `${input.photoCount ?? 0} foto(s) no perfil.`,
      "Adicione pelo menos 10 fotos reais e recentes do negócio, da equipe e dos trabalhos.",
    ),
  ];
}

function reputationItems(input: AuditInput): AuditItem[] {
  const reviewCount = input.reviewCount ?? 0;
  const rating = input.averageRating;
  const unanswered = input.unansweredReviews;

  return [
    item(
      "reviewCount",
      "Volume de avaliações",
      reviewCount >= 20 ? "pass" : reviewCount >= 5 ? "warning" : "fail",
      `${reviewCount} avaliação(ões) coletada(s).`,
      "Peça avaliação diretamente a clientes satisfeitos recentes; busque um fluxo constante, não um pico único.",
    ),
    item(
      "averageRating",
      "Nota média",
      rating === null || rating === undefined
        ? "fail"
        : rating >= 4.5
          ? "pass"
          : rating >= 3.5
            ? "warning"
            : "fail",
      rating === null || rating === undefined
        ? "Nota média não disponível."
        : `Nota média é ${rating.toFixed(1)}.`,
      "Resolva as reclamações recorrentes encontradas nas avaliações antes de pedir mais avaliações.",
    ),
    item(
      "unansweredReviews",
      "Avaliações sem resposta",
      // Um valor null/undefined significa "não observado", não "zero sem
      // resposta" — só um 0 confirmado conta como aprovado.
      unanswered === null || unanswered === undefined
        ? "fail"
        : unanswered === 0
          ? "pass"
          : unanswered <= 5
            ? "warning"
            : "fail",
      unanswered === null || unanswered === undefined
        ? "Contagem de avaliações sem resposta não observada."
        : `${unanswered} avaliação(ões) sem resposta.`,
      "Responda a todas as avaliações, começando pelas negativas (ver docs/REVIEWS.md).",
    ),
  ];
}

function contentActivityItems(input: AuditInput): AuditItem[] {
  const days = input.latestPostDaysAgo;
  return [
    item(
      "latestPost",
      "Última publicação",
      days === null || days === undefined
        ? "fail"
        : days <= 30
          ? "pass"
          : days <= 90
            ? "warning"
            : "fail",
      days === null || days === undefined
        ? "Nenhuma publicação encontrada."
        : `Última publicação foi há ${days} dia(s).`,
      "Publique ao menos uma atualização ou oferta por mês.",
    ),
  ];
}

function conversionReadinessItems(input: AuditInput): AuditItem[] {
  return [
    presence(
      "bookingUrl",
      "Link de agendamento",
      input.bookingUrl,
      "Adicione um link direto de agendamento/reserva.",
    ),
    presence(
      "website",
      "Website (caminho de conversão)",
      input.website,
      "Vincule um site ou landing page onde o cliente possa agir.",
    ),
    presence(
      "phone",
      "Telefone (caminho de conversão)",
      input.phone,
      "Adicione um telefone para o cliente ligar diretamente pela Busca/Maps.",
    ),
  ];
}

function sectionFromItems(
  section: AuditSectionResult["section"],
  items: AuditItem[],
): AuditSectionResult {
  const total = items.reduce((sum, i) => sum + STATUS_SCORE[i.status], 0);
  const score = items.length === 0 ? 0 : Math.round(total / items.length);
  return {
    section,
    score,
    weight: SCORE_WEIGHTS[section],
    items,
  };
}

/**
 * Deterministic scoring: no LLM involved. Every number here is derived from
 * `input` through fixed thresholds — see docs/AUDIT_SCORE.md for the
 * rationale behind each threshold and the section weights.
 */
export function buildAuditSections(
  input: AuditInput,
): LocalPresenceAuditSections {
  return {
    profileCompleteness: sectionFromItems(
      "profileCompleteness",
      profileCompletenessItems(input),
    ),
    reputation: sectionFromItems("reputation", reputationItems(input)),
    contentActivity: sectionFromItems(
      "contentActivity",
      contentActivityItems(input),
    ),
    conversionReadiness: sectionFromItems(
      "conversionReadiness",
      conversionReadinessItems(input),
    ),
  };
}

export type LocalPresenceAuditSections = Record<
  keyof typeof SCORE_WEIGHTS,
  AuditSectionResult
>;

export function computeOverallScore(
  sections: LocalPresenceAuditSections,
): number {
  const weighted = Object.values(sections).reduce(
    (sum, section) => sum + section.score * section.weight,
    0,
  );
  return Math.max(0, Math.min(100, Math.round(weighted)));
}
