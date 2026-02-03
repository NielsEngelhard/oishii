import { ingredientUnits } from "@/db/schema";
import { recipeDifficulties } from "@/db/schemas/enum/recipe-difficulty";
import z from "zod";

// Schema for AI-extracted recipe data
// This matches the CreateRecipeSchemaData structure for easy form prefilling
export const scrapedRecipeSchema = z.object({
  title: z.string().describe("The recipe title/name"),
  description: z.string().describe("A brief description of the recipe, empty string if none"),
  prepTime: z.number().describe("Preparation time in minutes, use 0 if unknown"),
  cookTime: z.number().describe("Cooking time in minutes"),
  servings: z.number().describe("Number of servings"),
  difficulty: z.enum(recipeDifficulties).describe("Recipe difficulty: easy, medium, or hard"),
  imageUrl: z.string().describe("URL of the recipe image if available, empty string if none"),
  ingredients: z.array(z.object({
    name: z.string().describe("Ingredient name"),
    amount: z.string().describe("Amount as a string (e.g., '1', '1/2', '2-3'), use empty string if unknown"),
    unit: z.enum(ingredientUnits).describe("Unit of measurement"),
    isSpice: z.boolean().describe("Whether this is a spice/seasoning"),
  })).describe("List of ingredients"),
  instructions: z.array(z.object({
    index: z.number().describe("Step number starting from 1"),
    text: z.string().describe("Instruction text for this step"),
  })).describe("Ordered list of cooking instructions"),
  tags: z.array(z.string()).describe("Relevant recipe tags like 'italian', 'quick_easy', 'vegetarian', empty array if none"),
  notes: z.array(z.object({
    title: z.string().describe("Note title, use empty string if none"),
    text: z.string().describe("Note content"),
  })).describe("Additional tips or notes about the recipe, empty array if none"),
});

export type ScrapedRecipeData = z.infer<typeof scrapedRecipeSchema>;
