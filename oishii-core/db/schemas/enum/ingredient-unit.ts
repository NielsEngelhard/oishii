import { pgEnum } from "drizzle-orm/pg-core";

export const ingredientUnits = ["tbsp", "gram", "etc...", "etc.."] as const;
export type IngredientUnit = (typeof ingredientUnits)[number];

export const ingredientUnitsEnum = pgEnum('ingredient_unit', ingredientUnits);