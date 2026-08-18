import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";

export const previews = sqliteTable("previews", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  url: text("url").notNull().unique(),
  title: text("title"),
  description: text("description"),
  image: text("image"),
  siteName: text("site_name"),
  favicon: text("favicon"),
  // Full extracted tag set (all og:*/twitter:* pairs) — future-proofs against
  // needing new fields without a migration.
  rawMeta: text("raw_meta", { mode: "json" }).$type<Record<string, string>>(),
  fetchedAt: integer("fetched_at"),
  createdAt: integer("created_at").notNull(),
  updatedAt: integer("updated_at").notNull(),
});

export type Preview = typeof previews.$inferSelect;
export type NewPreview = typeof previews.$inferInsert;
