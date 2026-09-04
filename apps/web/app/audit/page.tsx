import { AuditForm } from "./audit-form";

export default function PublicAuditPage() {
  return (
    <div>
      <div className="page-header">
        <h1>Auditoria gratuita de presença local</h1>
        <p>
          Preencha o que você observa no Google Business Profile do
          negócio (Busca/Maps) — esta ferramenta não faz scraping automático
          do Google. O score abaixo é calculado de forma determinística a
          partir do que você digitar.
        </p>
      </div>
      <AuditForm />
    </div>
  );
}
