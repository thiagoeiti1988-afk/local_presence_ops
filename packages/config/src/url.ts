const DANGEROUS_PROTOCOLS = ["javascript:", "data:", "vbscript:", "file:"];

/**
 * Sanitizes a user- or client-supplied URL before it is stored or rendered.
 * Returns null instead of throwing so callers can decide how to surface an
 * invalid value (Zod issue, form error, dropped field).
 */
export function sanitizeUrl(input: string | null | undefined): string | null {
  if (!input) return null;

  const trimmed = input.trim();
  if (trimmed.length === 0) return null;

  let url: URL;
  try {
    url = new URL(trimmed);
  } catch {
    return null;
  }

  const protocol = url.protocol.toLowerCase();
  if (DANGEROUS_PROTOCOLS.includes(protocol)) return null;
  if (protocol !== "http:" && protocol !== "https:") return null;

  return url.toString();
}

export function isSafeUrl(input: string | null | undefined): boolean {
  return sanitizeUrl(input) !== null;
}
