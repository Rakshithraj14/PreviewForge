import { assertSafeUrl } from "./ssrf";
import { decodeHtmlEntities } from "./entities";

export interface ExtractedMeta {
  title: string | null;
  description: string | null;
  image: string | null;
  siteName: string | null;
  favicon: string | null;
  raw: Record<string, string>;
}

const FETCH_TIMEOUT_MS = 8000;
const MAX_REDIRECTS = 3;
const MAX_BYTES = 5 * 1024 * 1024; // hard fallback cap for head-less/malformed pages
const REDIRECT_STATUSES = new Set([301, 302, 303, 307, 308]);

/**
 * Fetches a page and extracts social-preview-relevant <head> tags. Follows
 * redirects manually (re-validating each hop against SSRF rules, since the
 * final destination can differ from the input) and stops draining the
 * response body as soon as </head> is seen.
 */
export async function fetchAndExtract(startUrl: string): Promise<ExtractedMeta> {
  let currentUrl = assertSafeUrl(startUrl).toString();

  for (let redirects = 0; redirects <= MAX_REDIRECTS; redirects++) {
    const response = await fetch(currentUrl, {
      redirect: "manual",
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
      headers: {
        "user-agent": "PreviewForgeBot/1.0 (+https://previewforge.dev)",
        accept: "text/html",
      },
    });

    if (REDIRECT_STATUSES.has(response.status)) {
      const location = response.headers.get("location");
      if (!location) {
        throw new Error(`Redirect (${response.status}) without a Location header`);
      }
      currentUrl = assertSafeUrl(new URL(location, currentUrl).toString()).toString();
      continue;
    }

    if (!response.ok) {
      throw new Error(`Origin responded with ${response.status}`);
    }

    return extractMeta(response, currentUrl);
  }

  throw new Error("Too many redirects");
}

function extractMeta(response: Response, finalUrl: string): Promise<ExtractedMeta> {
  const raw: Record<string, string> = {};
  let title: string | null = null;
  let favicon: string | null = null;
  let titleBuf = "";
  let headClosed = false;

  const rewriter = new HTMLRewriter()
    .on("title", {
      text(chunk) {
        titleBuf += chunk.text;
        if (chunk.lastInTextNode) title = decodeHtmlEntities(titleBuf.trim()) || null;
      },
    })
    .on("meta", {
      element(el) {
        const key = (el.getAttribute("property") || el.getAttribute("name"))?.toLowerCase();
        const content = el.getAttribute("content");
        if (!key || !content) return;
        if (key === "description" || key.startsWith("og:") || key.startsWith("twitter:")) {
          raw[key] = decodeHtmlEntities(content);
        }
      },
    })
    .on("link", {
      element(el) {
        const rel = (el.getAttribute("rel") || "").toLowerCase();
        const href = el.getAttribute("href");
        if (href && /(^|\s)icon(\s|$)/.test(rel)) {
          try {
            favicon = new URL(decodeHtmlEntities(href), finalUrl).toString();
          } catch {
            // ignore malformed favicon href
          }
        }
      },
    })
    .on("head", {
      element(el) {
        el.onEndTag(() => {
          headClosed = true;
        });
      },
    });

  const transformed = rewriter.transform(response);
  const reader = transformed.body?.getReader();

  return new Promise((resolve, reject) => {
    const finish = () => {
      resolve({
        title,
        description: raw["description"] ?? raw["og:description"] ?? raw["twitter:description"] ?? null,
        image: raw["og:image"] ?? raw["twitter:image"] ?? raw["twitter:image:src"] ?? null,
        siteName: raw["og:site_name"] ?? null,
        favicon,
        raw,
      });
    };

    if (!reader) {
      finish();
      return;
    }

    let bytesRead = 0;
    const pump = (): void => {
      reader
        .read()
        .then(({ done, value }) => {
          if (done || headClosed) {
            reader.cancel().catch(() => {});
            finish();
            return;
          }
          bytesRead += value.byteLength;
          if (bytesRead >= MAX_BYTES) {
            reader.cancel().catch(() => {});
            finish();
            return;
          }
          pump();
        })
        .catch(reject);
    };
    pump();
  });
}
