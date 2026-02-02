import { NextRequest, NextResponse } from "next/server";
import { parseRecipeText } from "@/lib/ai/text-parser";
import { z } from "zod";

const requestSchema = z.object({
  text: z.string().min(20, "Text is too short to contain a recipe"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request body
    const parseResult = requestSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        { error: parseResult.error.issues[0]?.message || "Invalid input" },
        { status: 400 }
      );
    }

    const { text } = parseResult.data;

    // Parse the recipe text
    const result = await parseRecipeText(text);

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
    console.error("Recipe parse-text API error:", error);
    return NextResponse.json(
      { error: "Failed to parse recipe" },
      { status: 500 }
    );
  }
}
