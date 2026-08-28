# PreviewForge

Paste a URL, see how it renders as a Twitter/LinkedIn/Facebook/Telegram social card, edit the title/description/image, and copy ready-to-paste meta tags for HTML, React, Next.js, Vue, Svelte, or Angular.

Live: https://previewforgeui.ravanasura1422.workers.dev

## How it works

- Parsing a URL hits the backend, which fetches the page server-side and extracts `<title>`, OG/Twitter meta tags, and the favicon via a streamed `HTMLRewriter` pass (stops reading as soon as `</head>` closes).
- Results are cache-aside: a short-TTL Cloudflare KV cache in front of a durable D1 (SQLite) row per URL. A repeat parse of the same URL is served from KV/D1 without re-fetching the origin; "Refresh Data" bypasses both and re-fetches.
- Editing title/description/image only changes the local draft shown in the preview cards and used for codegen — it never writes back to the server.
- Your input URL, parsed data, draft edits, and active tabs persist to `localStorage`, so a page reload doesn't make you start over.
- The URL input accepts bare domains (`example.com`) as well as full URLs — `https://` is added automatically if missing.
- Generated code updates instantly as you switch the target tab or edit a field — no separate "Generate" step.

## Stack

- **Frontend**: Vite + React + TypeScript + Tailwind, deployed as a Cloudflare Worker with static assets.
- **Backend**: Hono on Cloudflare Workers, Cloudflare D1 (Drizzle ORM) for durable storage, Cloudflare KV for the hot cache, Cloudflare's native Rate Limiting binding.
- No accounts/auth — usage is anonymous, keyed by URL and by IP (for rate limiting) only.

## Local development

```
npm install
npm run dev
```

This runs the backend (`wrangler dev`, port 8787) and frontend (`vite`, port 5173) together. The frontend reads the backend URL from `frontend/.env` (`VITE_API_BASE_URL`, see `.env.example`).

Run all tests: `npm test`. Typecheck a workspace: `npm run typecheck -w backend` / `-w frontend`.

## Deployment

Both `frontend/` and `backend/` deploy via Cloudflare's GitHub integration (Workers Builds) — a push to `main` triggers a build and deploy automatically, no manual `wrangler deploy`. D1 bindings, KV bindings, rate-limit config, and `ALLOWED_ORIGIN` live in `backend/wrangler.toml`. Schema changes are applied to production explicitly via `npm run db:migrate:remote -w backend`, not as part of the build.
