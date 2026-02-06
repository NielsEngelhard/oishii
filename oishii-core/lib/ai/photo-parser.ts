import { openai } from "@ai-sdk/openai";
import { generateText, Output } from "ai";
import { scrapedRecipeSchema, type ScrapedRecipeData } from "./schemas/scraped-recipe";
import { OFFICIAL_TAGS } from "@/lib/constants/official-tags";
import { ingredientUnits } from "@/db/schema";

// Get all official tag keys for the AI prompt
const officialTagKeys = OFFICIAL_TAGS.map(t => t.key);

// Get all valid units for the AI prompt
const validUnits = ingredientUnits.join(", ");

const getPhotoParserSystemPrompt = (language: string) => `You are a recipe extraction AI specialized in OCR and visual understanding. Your job is to extract structured recipe data from photos of recipes.

## Language Requirement:
- The recipe title, description, ingredient names, and instruction text MUST be written in ${language === 'nl' ? 'Dutch' : 'English'}
- Translate if necessary, but keep measurements and technical terms accurate

## Photo Types You May Encounter:
- Cookbook pages (printed text)
- Handwritten recipe cards or notes
- Magazine clippings
- Screenshots of recipes
- Photos of recipe cards
- Printed recipe sheets

## Important Guidelines:

### Reading the Image:
- Carefully read all text visible in the image
- For handwritten recipes, interpret the handwriting as accurately as possible
- If text is partially obscured or unclear, make reasonable inferences
- Extract all recipe components: title, ingredients, instructions, times, servings

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
- If you can't estimate, use 0 for prepTime and make a best guess for cookTime

### Notes:
- Extract any tips, variations, or additional information as notes
- Chef's tips, serving suggestions, and storage instructions are good candidates

Be accurate and thorough. If information is missing, omit the optional field rather than guessing. For required fields, make reasonable defaults (e.g., servings: 4 if not specified).`;

export interface ParsePhotoResult {
  success: true;
  data: ScrapedRecipeData;
}

export interface ParsePhotoError {
  success: false;
  error: string;
}

export type ParsePhotoResponse = ParsePhotoResult | ParsePhotoError;

/**
 * Parses a recipe photo using AI vision to extract structured recipe data
 * @param imageUrl - The URL of the image to parse (S3 URL after upload)
 * @param language - The user's preferred language (e.g., 'en', 'nl')
 */
export async function parseRecipePhoto(imageUrl: string, language: string = 'en'): Promise<ParsePhotoResponse> {
  try {
    // Validate input
    if (!imageUrl || !imageUrl.startsWith('http')) {
      return { success: false, error: "Invalid image URL" };
    }

    // Use AI to extract recipe data from the photo
    const result = await generateText({
      model: openai("gpt-4o"),
      output: Output.object({
        schema: scrapedRecipeSchema,
      }),
      system: getPhotoParserSystemPrompt(language),
      messages: [{
        role: "user",
        content: [
          {
            type: "text",
            text: "Extract the recipe from this image. Read all visible text carefully and structure it into a complete recipe. If the image doesn't appear to contain a recipe, try to extract any cooking-related information you can find."
          },
          {
            type: "image",
            image: imageUrl
          }
        ]
      }]
    });

    // Access the structured output from the result
    const recipeData = result.experimental_output as ScrapedRecipeData | undefined;

    // Validate the result has minimum required data
    if (!recipeData || !recipeData.title || recipeData.ingredients.length === 0) {
      return { success: false, error: "Could not extract recipe data from the image" };
    }

    // Filter tags to only include valid official tags
    if (recipeData.tags) {
      recipeData.tags = recipeData.tags.filter(tag =>
        officialTagKeys.includes(tag as typeof officialTagKeys[number])
      );
    }

    return { success: true, data: recipeData };
  } catch (error) {
    console.error("Recipe photo parsing error:", error);

    if (error instanceof Error) {
      if (error.message.includes("rate limit")) {
        return { success: false, error: "Service is busy. Please try again in a moment." };
      }
      if (error.message.includes("Could not process image") || error.message.includes("image")) {
        return { success: false, error: "Could not process the image. Please try a clearer photo." };
      }
    }

    return { success: false, error: "Failed to parse recipe from photo. Please try again." };
  }
}
