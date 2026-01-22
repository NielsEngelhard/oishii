import { InferSelectModel } from "drizzle-orm";
import { integer, jsonb, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { recipeDifficultyEnum } from "./enum/recipe-difficulty";
import { ingredientSchemaData } from "@/schemas/ingredient-schemas";
import { InstructionSchemaData } from "@/schemas/instruction-schemas";
import { NoteSchemaData } from "@/schemas/note-schemas";
import { usersTable } from "./users";

export const recipesTable = pgTable("recipes", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: integer("user_id").notNull().references(() => usersTable.id),
  title: text("title").notNull(),
  description: text("description"),
  prepTime: integer("prep_time"),
  cookTime: integer("cook_time").notNull(),
  servings: integer("servings").notNull(),
  difficulty: recipeDifficultyEnum("difficulty").notNull(),
  ingredients: jsonb("ingredients").notNull().$type<ingredientSchemaData[]>(),
  instructions: jsonb("instructions").notNull().$type<InstructionSchemaData[]>(),
  imageUrl: text("image_url"),
  language: text("language").notNull().default('en'),
  notes: jsonb("notes").$type<NoteSchemaData[]>(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
export type RecipesTable = InferSelectModel<typeof recipesTable>;
