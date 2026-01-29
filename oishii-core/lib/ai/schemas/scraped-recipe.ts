import { ingredientUnits } from "@/db/schema";
import { recipeDifficulties } from "@/db/schemas/enum/recipe-difficulty";
import z from "zod";

// Schema for AI-extracted recipe data
// This matches the CreateRecipeSchemaData structure for easy form prefilling
export const scrapedRecipeSchema = z.object({
  title: z.string().describe("The recipe title/name"),
  description: z.string().optional().describe("A brief description of the recipe"),
  prepTime: z.number().optional().describe("Preparation time in minutes"),
  cookTime: z.number().describe("Cooking time in minutes"),
  servings: z.number().describe("Number of servings"),
  difficulty: z.enum(recipeDifficulties).describe("Recipe difficulty: easy, medium, or hard"),
  imageUrl: z.string().optional().describe("URL of the recipe image if available"),
  ingredients: z.array(z.object({
    name: z.string().describe("Ingredient name"),
    amount: z.string().optional().describe("Amount as a string (e.g., '1', '1/2', '2-3')"),
    unit: z.enum(ingredientUnits).describe("Unit of measurement"),
    isSpice: z.boolean().optional().describe("Whether this is a spice/seasoning"),
  })).describe("List of ingredients"),
  instructions: z.array(z.object({
    index: z.number().describe("Step number starting from 1"),
    text: z.string().describe("Instruction text for this step"),
  })).describe("Ordered list of cooking instructions"),
  tags: z.array(z.string()).optional().describe("Relevant recipe tags like 'italian', 'quick_easy', 'vegetarian'"),
  notes: z.array(z.object({
    title: z.string().optional().describe("Optional note title"),
    text: z.string().describe("Note content"),
  })).optional().describe("Additional tips or notes about the recipe"),
});

export type ScrapedRecipeData = z.infer<typeof scrapedRecipeSchema>;
