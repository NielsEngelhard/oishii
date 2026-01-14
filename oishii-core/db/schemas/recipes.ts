import { InferSelectModel } from "drizzle-orm";
import { integer, jsonb, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { recipeDifficultyEnum } from "../schema";
import { ingredientSchemaData } from "@/schemas/ingredient-schemas";
import { InstructionSchemaData } from "@/schemas/instruction-schemas";

export const recipesTable = pgTable("recipes", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  prepTime: text("prep_time"),
  cookTime: text("cook_time").notNull(),
  servings: integer("servings").notNull(),
  difficulty: recipeDifficultyEnum("difficulty").notNull(),
  ingredients: jsonb("ingredients").notNull().$type<ingredientSchemaData[]>(),
  instructions: jsonb("instructions").notNull().$type<InstructionSchemaData[]>(),
});
export type RecipesTable = InferSelectModel<typeof recipesTable>;
