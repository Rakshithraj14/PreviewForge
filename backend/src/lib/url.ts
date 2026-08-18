/**
 * Canonicalizes a URL so the same logical page always maps to the same
 * cache key / DB unique key, regardless of superficial differences in how
 * it was pasted (scheme case, default port, trailing slash, fragment).
 */
export function normalizeUrl(rawUrl: string): string {
  const u = new URL(rawUrl);
  u.protocol = u.protocol.toLowerCase();
  u.hostname = u.hostname.toLowerCase();
  u.hash = "";

  if (
    (u.protocol === "http:" && u.port === "80") ||
    (u.protocol === "https:" && u.port === "443")
  ) {
    u.port = "";
  }

  if (u.pathname.length > 1 && u.pathname.endsWith("/")) {
    u.pathname = u.pathname.replace(/\/+$/, "");
  }

  return u.toString();
}
