export interface CachedPreview {
  url: string;
  title: string | null;
  description: string | null;
  image: string | null;
  siteName: string | null;
  favicon: string | null;
  fetchedAt: number | null;
}

/** Shape of Cloudflare's native Rate Limiting binding. */
export interface RateLimiterBinding {
  limit(options: { key: string }): Promise<{ success: boolean }>;
}

const cacheKey = (url: string) => `preview:${url}`;

export async function getCached(
  kv: KVNamespace,
  url: string
): Promise<CachedPreview | null> {
  return kv.get<CachedPreview>(cacheKey(url), "json");
}

export async function setCached(
  kv: KVNamespace,
  url: string,
  data: CachedPreview,
  ttlSeconds: number
): Promise<void> {
  // KV enforces a 60s minimum TTL.
  await kv.put(cacheKey(url), JSON.stringify(data), {
    expirationTtl: Math.max(60, ttlSeconds),
  });
}

export async function checkRateLimit(
  limiter: RateLimiterBinding,
  ip: string
): Promise<boolean> {
  const { success } = await limiter.limit({ key: ip });
  return success;
}
