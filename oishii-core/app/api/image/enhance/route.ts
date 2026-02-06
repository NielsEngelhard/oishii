import { NextRequest, NextResponse } from "next/server";
import { enhanceRecipeImage } from "@/lib/ai/image-enhancer";
import { getCurrentUser } from "@/lib/security/auth/get-current-user";
import { checkAiLimit, recordAiUsage } from "@/lib/plans/check-plan-limits";
import { z } from "zod";

const requestSchema = z.object({
  imageUrl: z.string().url("Invalid image URL"),
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

    // Check if user has premium or admin plan
    if (user.plan !== "premium" && user.plan !== "admin") {
      return NextResponse.json(
        { error: "Premium plan required for image enhancement", premiumRequired: true },
        { status: 403 }
      );
    }

    // Check AI usage limit
    const limitCheck = await checkAiLimit(user.id);
    if (!limitCheck.allowed) {
      return NextResponse.json(
        {
          error: "AI usage limit reached",
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

    const { imageUrl } = parseResult.data;

    // Enhance the image
    const result = await enhanceRecipeImage(imageUrl);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }

    // Record successful AI usage
    await recordAiUsage(user.id, "image_enhance");

    return NextResponse.json({
      success: true,
      url: result.url,
    });
  } catch (error) {
    console.error("Image enhance API error:", error);
    return NextResponse.json(
      { error: "Failed to enhance image" },
      { status: 500 }
    );
  }
}
