import updateRecipe from "@/features/recipe/command/update-recipe-command";
import getRecipeDetails from "@/features/recipe/query/get-recipe-details-query";
import { getCurrentUser } from "@/lib/security/auth/get-current-user";
import { createRecipeSchema } from "@/schemas/recipe-schemas";
import { NextResponse } from "next/server";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ recipeId: string }> }
) {
    try {
        const { recipeId } = await params;

        if (!recipeId) {
            return NextResponse.json(
                { error: "Recipe ID is required" },
                { status: 400 }
            );
        }

        const recipe = await getRecipeDetails(recipeId);

        if (!recipe) {
            return NextResponse.json(
                { error: "Recipe not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(recipe);
    } catch (error) {
        console.error("Failed to get recipe details:", error);
        return NextResponse.json(
            { error: "Failed to get recipe details" },
            { status: 500 }
        );
    }
}

export async function PUT(
    req: Request,
    { params }: { params: Promise<{ recipeId: string }> }
) {
    try {
        const user = await getCurrentUser();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { recipeId } = await params;

        if (!recipeId) {
            return NextResponse.json(
                { error: "Recipe ID is required" },
                { status: 400 }
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

        const updated = await updateRecipe({
            recipeId,
            data: result.data,
            userId: user.id,
        });

        if (!updated) {
            return NextResponse.json(
                { error: "Recipe not found or you don't have permission to edit it" },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, recipeId });
    } catch (error) {
        console.error("Failed to update recipe:", error);
        const message = error instanceof Error ? error.message : "Failed to update recipe";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
