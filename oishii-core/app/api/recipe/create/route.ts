import createRecipe from "@/features/recipe/command/create-recipe-command";
import { checkRecipeLimit } from "@/lib/plans/check-plan-limits";
import { getCurrentUser } from "@/lib/security/auth/get-current-user";
import { createRecipeSchema } from "@/schemas/recipe-schemas";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const user = await getCurrentUser();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Check recipe limit based on plan
        const limitCheck = await checkRecipeLimit(user.id);
        if (!limitCheck.allowed) {
            return NextResponse.json(
                {
                    error: "Recipe limit reached",
                    limitReached: true,
                    current: limitCheck.current,
                    max: limitCheck.max,
                    plan: limitCheck.plan,
                },
                { status: 403 }
            );
        }

        const body = await req.json();

        const result = createRecipeSchema.safeParse(body);
        if (!result.success) {
            return NextResponse.json(
                { error: result.error.issues[0]?.message || "Invalid input" },
                { status: 400 }
            );
        }

        const { slug } = await createRecipe({ data: result.data, userId: user.id });

        return NextResponse.json({ success: true, slug }, { status: 201 });
    } catch (error) {
        console.error("Failed to create recipe:", error);
        const message = error instanceof Error ? error.message : "Failed to create recipe";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}