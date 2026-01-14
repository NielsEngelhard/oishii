import { recipeDifficulties } from "@/db/schema";
import z from "zod";
import { ingredientSchema } from "./ingredient-schemas";
import { instructionSchema } from "./instruction-schemas";

export const createRecipeSchema = z.object({
  title: z.string().min(4, "Too short").max(100, "Too long"),
  description: z.string().max(1000, "Too long").optional(),
  prepTime: z.number().min(1).max(1440).optional(),
  cookTime: z.number().min(1).max(1440),
  servings: z.number().min(1).max(100),
  difficulty: z.enum(recipeDifficulties),
  tags: z.array(z.string().min(2).max(30)),
  ingredients: z.array(ingredientSchema).min(1, "At least one ingredient required"),
  instructions: z.array(instructionSchema).min(1, "At least one ingredient required"),
});
export type CreateRecipeSchemaData = z.infer<typeof createRecipeSchema>;