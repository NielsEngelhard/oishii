import { openai } from "@ai-sdk/openai";
import { generateText, Output } from "ai";
import { scrapedRecipeSchema, type ScrapedRecipeData } from "./schemas/scraped-recipe";
import { OFFICIAL_TAGS } from "@/lib/constants/official-tags";
import { ingredientUnits } from "@/db/schema";

// Get all official tag keys for the AI prompt
const officialTagKeys = OFFICIAL_TAGS.map(t => t.key);

// Get all valid units for the AI prompt
const validUnits = ingredientUnits.join(", ");

const getScraperSystemPrompt = (language: string) => `You are a recipe extraction AI. Your job is to extract structured recipe data from HTML content.

## Language Requirement:
- The recipe title, description, ingredient names, and instruction text MUST be written in ${language === 'nl' ? 'Dutch' : 'English'}
- Translate if necessary, but keep measurements and technical terms accurate

## Important Guidelines:

### Ingredients:
- Extract each ingredient with name, amount (as string), and unit
- Valid units are: ${validUnits}
- If you can't determine the unit, use "none"
- For spices and seasonings, set isSpice to true
- Amount should be a string (e.g., "1", "1/2", "2-3")

### Instructions:
- Extract each step as a separate instruction
- Number them starting from 1
- Keep the original wording but clean up formatting

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
- If only total time is given, estimate the split

### Image:
- Extract the main recipe image URL if available
- Must be a full URL starting with http:// or https://

Be accurate and thorough. If information is missing, omit the optional field rather than guessing.`;

export interface ScrapeRecipeResult {
  success: true;
  data: ScrapedRecipeData;
}

export interface ScrapeRecipeError {
  success: false;
  error: string;
}

export type ScrapeRecipeResponse = ScrapeRecipeResult | ScrapeRecipeError;

/**
 * Fetches HTML content from a URL
 */
async function fetchHtmlContent(url: string): Promise<string> {
  const response = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (compatible; OishiiBot/1.0; +https://oishii.app)",
      "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch URL: ${response.status} ${response.statusText}`);
  }

  const html = await response.text();

  // Basic HTML cleanup - remove scripts, styles, and comments
  const cleanedHtml = html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "")
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<[^>]+>/g, " ") // Remove all HTML tags
    .replace(/\s+/g, " ") // Normalize whitespace
    .trim();

  // Limit content length for the AI
  return cleanedHtml.slice(0, 50000);
}

/**
 * Scrapes a recipe from a URL using AI
 * @param url - The URL to scrape
 * @param language - The user's preferred language (e.g., 'en', 'nl')
 */
export async function scrapeRecipe(url: string, language: string = 'en'): Promise<ScrapeRecipeResponse> {
  try {
    // Validate URL
    const urlObj = new URL(url);
    if (!["http:", "https:"].includes(urlObj.protocol)) {
      return { success: false, error: "Invalid URL protocol" };
    }

    // Fetch HTML content
    const content = await fetchHtmlContent(url);

    if (content.length < 100) {
      return { success: false, error: "Page content too short - may not contain a recipe" };
    }

    // Use AI to extract recipe data
    const result = await generateText({
      model: openai("gpt-4o"),
      output: Output.object({
        schema: scrapedRecipeSchema,
      }),
      system: getScraperSystemPrompt(language),
      prompt: `Extract the recipe from this webpage content. If no recipe is found, extract as much relevant information as possible.\n\nURL: ${url}\n\nContent:\n${content}`,
    });

    // Access the structured output from the result
    const recipeData = result.experimental_output as ScrapedRecipeData | undefined;

    // Validate the result has minimum required data
    if (!recipeData || !recipeData.title || recipeData.ingredients.length === 0) {
      return { success: false, error: "Could not extract recipe data from the page" };
    }

    // Filter tags to only include valid official tags
    if (recipeData.tags) {
      recipeData.tags = recipeData.tags.filter(tag =>
        officialTagKeys.includes(tag as typeof officialTagKeys[number])
      );
    }

    return { success: true, data: recipeData };
  } catch (error) {
    console.error("Recipe scraping error:", error);

    if (error instanceof Error) {
      if (error.message.includes("Invalid URL")) {
        return { success: false, error: "Invalid URL format" };
      }
      if (error.message.includes("Failed to fetch")) {
        return { success: false, error: "Could not access the URL" };
      }
    }

    return { success: false, error: "Failed to extract recipe. Please try again." };
  }
}
