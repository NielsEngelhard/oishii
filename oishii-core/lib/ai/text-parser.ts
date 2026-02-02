import { openai } from "@ai-sdk/openai";
import { generateText, Output } from "ai";
import { scrapedRecipeSchema, type ScrapedRecipeData } from "./schemas/scraped-recipe";
import { OFFICIAL_TAGS } from "@/lib/constants/official-tags";
import { ingredientUnits } from "@/db/schema";

// Get all official tag keys for the AI prompt
const officialTagKeys = OFFICIAL_TAGS.map(t => t.key);

// Get all valid units for the AI prompt
const validUnits = ingredientUnits.join(", ");

const TEXT_PARSER_SYSTEM_PROMPT = `You are a recipe extraction AI. Your job is to extract structured recipe data from raw text that a user has copy-pasted.

## Important Guidelines:

### Input Handling:
- The text may come from any source: websites, books, handwritten notes, messages, etc.
- The format may be structured (with clear sections) or unstructured (prose/paragraph form)
- Some information may be implicit or missing - extract what you can confidently identify

### Ingredients:
- Extract each ingredient with name, amount (as string), and unit
- Valid units are: ${validUnits}
- If you can't determine the unit, use "none"
- For spices and seasonings, set isSpice to true
- Amount should be a string (e.g., "1", "1/2", "2-3")
- Parse informal descriptions like "a handful of" or "some" as amount with unit "none"

### Instructions:
- Extract each step as a separate instruction
- Number them starting from 1
- If steps aren't numbered, split logically by cooking actions
- Clean up formatting but preserve the original intent

### Tags:
- Only use these official tags: ${officialTagKeys.slice(0, 50).join(", ")}... (and more)
- Select tags that match the recipe's cuisine, ingredients, cooking style, dietary info, etc.
- Be conservative - only add tags you're confident about

### Difficulty:
- "easy" = simple recipes, few ingredients, basic techniques
- "medium" = moderate complexity, some skill required
- "hard" = complex techniques, many steps, advanced skills

### Times:
- prepTime = time before cooking (chopping, marinating, etc.)
- cookTime = actual cooking/baking time
- If times aren't specified, make reasonable estimates based on the recipe
- If you can't estimate, omit these fields

### Notes:
- Extract any tips, variations, or additional information as notes
- Chef's tips, serving suggestions, and storage instructions are good candidates

Be accurate and thorough. If information is missing, omit the optional field rather than guessing.`;

export interface ParseRecipeResult {
  success: true;
  data: ScrapedRecipeData;
}

export interface ParseRecipeError {
  success: false;
  error: string;
}

export type ParseRecipeResponse = ParseRecipeResult | ParseRecipeError;

/**
 * Parses raw recipe text using AI to extract structured recipe data
 */
export async function parseRecipeText(text: string): Promise<ParseRecipeResponse> {
  try {
    // Validate input
    const trimmedText = text.trim();

    if (trimmedText.length < 20) {
      return { success: false, error: "Text is too short to contain a recipe" };
    }

    if (trimmedText.length > 50000) {
      return { success: false, error: "Text is too long. Please provide a shorter recipe." };
    }

    // Use AI to extract recipe data
    const result = await generateText({
      model: openai("gpt-4o"),
      output: Output.object({
        schema: scrapedRecipeSchema,
      }),
      system: TEXT_PARSER_SYSTEM_PROMPT,
      prompt: `Extract the recipe from this text. If the text doesn't appear to be a recipe, try to extract as much relevant cooking information as possible.\n\nText:\n${trimmedText}`,
    });

    // Access the structured output from the result
    const recipeData = result.experimental_output as ScrapedRecipeData | undefined;

    // Validate the result has minimum required data
    if (!recipeData || !recipeData.title || recipeData.ingredients.length === 0) {
      return { success: false, error: "Could not extract recipe data from the text" };
    }

    // Filter tags to only include valid official tags
    if (recipeData.tags) {
      recipeData.tags = recipeData.tags.filter(tag =>
        officialTagKeys.includes(tag as typeof officialTagKeys[number])
      );
    }

    return { success: true, data: recipeData };
  } catch (error) {
    console.error("Recipe text parsing error:", error);

    if (error instanceof Error) {
      if (error.message.includes("rate limit")) {
        return { success: false, error: "Service is busy. Please try again in a moment." };
      }
    }

    return { success: false, error: "Failed to parse recipe. Please try again." };
  }
}
