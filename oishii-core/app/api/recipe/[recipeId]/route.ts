import getRecipeDetails from "@/features/recipe/query/get-recipe-details-query";
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
