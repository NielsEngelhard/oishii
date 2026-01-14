import { pgEnum } from "drizzle-orm/pg-core";

export const ingredientUnits = [
  // Volume (metric)
  "ml",
  "l",

  // Volume (US)
  "tsp",        // teaspoon
  "tbsp",       // tablespoon
  "cup",

  // Weight
  "mg",
  "g",
  "kg",
  "oz",
  "lb",

  // Length (sometimes used for pasta)
  "cm",
  "mm",

  // Count-based units
  "piece",      // e.g., 1 piece garlic
  "clove",
  "slice",
  "pinch",
  "dash",

  // Special
  "to_taste",
  "none"        // For items without a unit (e.g., "Salt" as taste)
] as const;

export type IngredientUnit = (typeof ingredientUnits)[number];

export const ingredientUnitsEnum = pgEnum('ingredient_unit', ingredientUnits);
