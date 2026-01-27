import { InferSelectModel } from "drizzle-orm";
import { boolean, integer, pgTable, text, timestamp, unique, uuid } from "drizzle-orm/pg-core";
import { recipesTable } from "./recipes";

export const officialTagsTable = pgTable("official_tags", {
  key: text("key").primaryKey(),
  emoji: text("emoji").notNull(),
  sortOrder: integer("sort_order").default(0),
});
export type OfficialTagsTable = InferSelectModel<typeof officialTagsTable>;

export const recipeTagsTable = pgTable("recipe_tags", {
  id: uuid("id").defaultRandom().primaryKey(),
  recipeId: uuid("recipe_id").notNull().references(() => recipesTable.id, { onDelete: "cascade" }),
  tagKey: text("tag_key").notNull(),
  isOfficial: boolean("is_official").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  unique("recipe_tag_unique").on(table.recipeId, table.tagKey),
]);
export type RecipeTagsTable = InferSelectModel<typeof recipeTagsTable>;
