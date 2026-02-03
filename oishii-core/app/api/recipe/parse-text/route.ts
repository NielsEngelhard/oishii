import { NextRequest, NextResponse } from "next/server";
import { parseRecipeText } from "@/lib/ai/text-parser";
import { getCurrentUser } from "@/lib/security/auth/get-current-user";
import { checkAiLimit, recordAiUsage } from "@/lib/plans/check-plan-limits";
import { z } from "zod";

const requestSchema = z.object({
  text: z.string().min(20, "Text is too short to contain a recipe"),
});

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Check AI usage limit
    const limitCheck = await checkAiLimit(user.id);
    if (!limitCheck.allowed) {
      return NextResponse.json(
        {
          error: "AI import limit reached",
          limitReached: true,
          remaining: limitCheck.remaining,
          resetAt: limitCheck.resetAt.toISOString(),
          plan: limitCheck.plan,
        },
        { status: 429 }
      );
    }

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

    // Parse the recipe text using the user's preferred language
    const result = await parseRecipeText(text, user.language || 'en');

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }

    // Record successful AI usage
    await recordAiUsage(user.id, "text_parse");

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
