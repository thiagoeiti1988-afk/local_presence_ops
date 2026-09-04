import { AuditForm } from "./audit-form";

export default function PublicAuditPage() {
  return (
    <div>
      <h1>Free Local Presence Audit</h1>
      <p style={{ color: "var(--muted)", maxWidth: 560 }}>
        Fill in what you observe on the business&apos;s Google Business
        Profile (Search/Maps) — this tool does not scrape Google
        automatically. The score below is computed deterministically from
        what you enter.
      </p>
      <AuditForm />
    </div>
  );
}
