import { recipeDifficulties } from "@/db/schema";
import z from "zod";

export const createRecipeSchema = z.object({
  title: z.string().min(4, "Too short").max(100, "Too long"),
  description: z.string().max(1000, "Too long").optional(),
  prepTime: z.number().min(1).max(1440).optional(),
  cookTime: z.number().min(1).max(1440),
  servings: z.number().min(1).max(100),
  difficulty: z.enum(recipeDifficulties),
  tags: z.array(z.string().min(2).max(30))
});
export type CreateRecipeSchemaData = z.infer<typeof createRecipeSchema>;