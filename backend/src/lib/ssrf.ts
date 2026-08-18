export class UnsafeUrlError extends Error {}

const DISALLOWED_HOSTNAMES = new Set(["localhost", "0.0.0.0", "[::1]", "::1"]);

function isPrivateIPv4(hostname: string): boolean {
  const match = hostname.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
  if (!match) return false;
  const a = Number(match[1]);
  const b = Number(match[2]);
  if ([a, b, Number(match[3]), Number(match[4])].some((n) => n > 255)) return false;
  if (a === 127) return true; // loopback
  if (a === 10) return true; // 10.0.0.0/8
  if (a === 172 && b >= 16 && b <= 31) return true; // 172.16.0.0/12
  if (a === 192 && b === 168) return true; // 192.168.0.0/16
  if (a === 169 && b === 254) return true; // link-local incl. cloud metadata (169.254.169.254)
  if (a === 0) return true; // "this network"
  return false;
}

function isPrivateIPv6(hostname: string): boolean {
  const h = hostname.replace(/^\[|\]$/g, "").toLowerCase();
  if (h === "::1" || h === "::") return true;
  if (h.startsWith("fe80:")) return true; // link-local
  if (h.startsWith("fc") || h.startsWith("fd")) return true; // unique local fc00::/7
  if (h.startsWith("::ffff:")) {
    const embeddedV4 = h.split(":").pop();
    if (embeddedV4 && isPrivateIPv4(embeddedV4)) return true;
  }
  return false;
}

/**
 * Defense-in-depth against SSRF for a backend that fetches arbitrary
 * user-supplied URLs server-side. Cloudflare Workers' fetch() already can't
 * target bare IP literals or reach private networks from the edge, but this
 * gives a clean 400 instead of a raw fetch failure, and it's cheap.
 */
export function assertSafeUrl(rawUrl: string): URL {
  let url: URL;
  try {
    url = new URL(rawUrl);
  } catch {
    throw new UnsafeUrlError("Invalid URL");
  }

  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new UnsafeUrlError("Only http/https URLs are allowed");
  }

  const hostname = url.hostname.toLowerCase();
  if (
    DISALLOWED_HOSTNAMES.has(hostname) ||
    hostname.endsWith(".localhost")
  ) {
    throw new UnsafeUrlError("URL targets a disallowed host");
  }

  if (isPrivateIPv4(hostname) || isPrivateIPv6(hostname)) {
    throw new UnsafeUrlError("URL targets a private/internal address");
  }

  return url;
}
