import { defineConfig } from "drizzle-kit";

// Only used for `drizzle-kit generate` (schema -> SQL). Migrations are applied
// via `wrangler d1 migrations apply`, not `drizzle-kit push` / `migrate`, so no
// D1 driver credentials are needed here.
export default defineConfig({
  dialect: "sqlite",
  schema: "./src/db/schema.ts",
  out: "./migrations",
});
