import { InferSelectModel } from "drizzle-orm";
import { integer, pgTable, primaryKey, timestamp, uuid } from "drizzle-orm/pg-core";
import { usersTable } from "./users";
import { recipesTable } from "./recipes";

export const recipeLikesTable = pgTable("recipe_likes", {
  userId: integer("user_id").notNull().references(() => usersTable.id),
  recipeId: uuid("recipe_id").notNull().references(() => recipesTable.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  primaryKey({ columns: [table.userId, table.recipeId] }),
]);

export type RecipeLikesTable = InferSelectModel<typeof recipeLikesTable>;
