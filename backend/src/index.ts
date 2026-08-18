import { Hono } from "hono";
import { cors } from "hono/cors";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { getDb } from "./db/client";
import { previews, type Preview } from "./db/schema";
import { normalizeUrl } from "./lib/url";
import { assertSafeUrl, UnsafeUrlError } from "./lib/ssrf";
import { fetchAndExtract } from "./lib/parse";
import { getCached, setCached, checkRateLimit, type RateLimiterBinding, type CachedPreview } from "./lib/cache";

type Bindings = {
  DB: D1Database;
  CACHE: KVNamespace;
  RATE_LIMITER: RateLimiterBinding;
  ALLOWED_ORIGIN: string;
  CACHE_TTL_SECONDS: string;
  RATE_LIMIT_PER_MINUTE: string;
};

const app = new Hono<{ Bindings: Bindings }>();

app.use("/api/*", (c, next) =>
  cors({
    origin: c.env.ALLOWED_ORIGIN,
    allowMethods: ["GET", "POST", "OPTIONS"],
    allowHeaders: ["Content-Type"],
  })(c, next)
);

app.get("/", (c) => c.json({ message: "Hello from the backend!" }));

app.get("/api/health", (c) => c.json({ ok: true }));

const parseSchema = z.object({
  url: z.string().url(),
  force: z.boolean().optional().default(false),
});

function toPublic(row: Preview): CachedPreview {
  return {
    url: row.url,
    title: row.title,
    description: row.description,
    image: row.image,
    siteName: row.siteName,
    favicon: row.favicon,
    fetchedAt: row.fetchedAt,
  };
}

app.post("/api/parse", zValidator("json", parseSchema), async (c) => {
  const { url: rawUrl, force } = c.req.valid("json");

  let safeUrl: URL;
  try {
    safeUrl = assertSafeUrl(rawUrl);
  } catch (err) {
    const message = err instanceof UnsafeUrlError ? err.message : "Invalid URL";
    return c.json({ error: message }, 400);
  }
  const url = normalizeUrl(safeUrl.toString());

  const ip = c.req.header("cf-connecting-ip") ?? "unknown";
  const allowed = await checkRateLimit(c.env.RATE_LIMITER, ip);
  if (!allowed) {
    c.header("Retry-After", "60");
    return c.json({ error: "Rate limit exceeded, try again shortly." }, 429);
  }

  const db = getDb(c.env.DB);
  const ttl = Number(c.env.CACHE_TTL_SECONDS) || 2700;

  if (!force) {
    const cached = await getCached(c.env.CACHE, url);
    if (cached) {
      return c.json({ ...cached, source: "cache" as const });
    }

    const [row] = await db.select().from(previews).where(eq(previews.url, url)).limit(1);
    if (row) {
      const publicData = toPublic(row);
      await setCached(c.env.CACHE, url, publicData, ttl);
      return c.json({ ...publicData, source: "db" as const });
    }
  }

  try {
    const extracted = await fetchAndExtract(url);
    const now = Date.now();
    const fields = {
      title: extracted.title,
      description: extracted.description,
      image: extracted.image,
      siteName: extracted.siteName,
      favicon: extracted.favicon,
      rawMeta: extracted.raw,
      fetchedAt: now,
      updatedAt: now,
    };

    const [row] = await db
      .insert(previews)
      .values({ url, ...fields, createdAt: now })
      .onConflictDoUpdate({ target: previews.url, set: fields })
      .returning();

    const publicData = toPublic(row);
    await setCached(c.env.CACHE, url, publicData, ttl);
    return c.json({ ...publicData, source: "origin" as const });
  } catch (err) {
    const [row] = await db.select().from(previews).where(eq(previews.url, url)).limit(1);
    if (row) {
      return c.json({ ...toPublic(row), source: "db" as const, stale: true });
    }
    const message = err instanceof Error ? err.message : "Failed to fetch URL";
    return c.json({ error: message }, 502);
  }
});

export default app;
