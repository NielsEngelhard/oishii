import { NextRequest, NextResponse } from "next/server";
import { scrapeRecipe } from "@/lib/ai/recipe-scraper";
import { z } from "zod";

const requestSchema = z.object({
  url: z.string().url("Invalid URL format"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request body
    const parseResult = requestSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        { error: "Invalid URL format" },
        { status: 400 }
      );
    }

    const { url } = parseResult.data;

    // Scrape the recipe
    const result = await scrapeRecipe(url);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      recipe: result.data,
    });
  } catch (error) {
    console.error("Recipe scrape API error:", error);
    return NextResponse.json(
      { error: "Failed to scrape recipe" },
      { status: 500 }
    );
  }
}
