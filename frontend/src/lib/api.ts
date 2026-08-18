import type { PreviewMeta } from "./types";

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "";

export interface ParseResponse extends PreviewMeta {
  source: "cache" | "db" | "origin";
  fetchedAt: number | null;
  stale?: boolean;
}

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export async function parseUrl(
  url: string,
  opts: { force?: boolean } = {}
): Promise<ParseResponse> {
  const res = await fetch(`${API_BASE}/api/parse`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url, force: opts.force ?? false }),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new ApiError(
      typeof data?.error === "string" ? data.error : `Request failed with status ${res.status}`,
      res.status
    );
  }

  return data as ParseResponse;
}
