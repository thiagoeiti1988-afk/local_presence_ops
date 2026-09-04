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
        <p style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
          Os dados enviados aqui (nome do negócio, cidade, telefone e links
          informados) ficam salvos como um lead para que nossa equipe possa
          retornar o contato — nunca são usados para outro fim nem
          compartilhados com terceiros. Para pedir a remoção desses dados a
          qualquer momento, entre em contato pelo mesmo telefone informado
          neste formulário.
        </p>
      </div>
      <AuditForm />
    </div>
  );
}
