import { ingredientUnits } from "@/db/schema";
import z from "zod";

export const ingredientSchema = z.object({
  name: z.string().min(2, "Too short").max(100, "Too long"),
  amount: z.string().max(1000, "Too long").optional(),
  unit: z.enum(ingredientUnits),
  isSpice: z.boolean().default(false).optional(),  
});
export type ingredientSchemaData = z.infer<typeof ingredientSchema>;