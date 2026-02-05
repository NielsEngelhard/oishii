import updateRecipe from "@/features/recipe/command/update-recipe-command";
import getRecipeDetails from "@/features/recipe/query/get-recipe-details-query";
import { getCurrentUser } from "@/lib/security/auth/get-current-user";
import { createRecipeSchema } from "@/schemas/recipe-schemas";
import { NextResponse } from "next/server";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        const { slug } = await params;

        if (!slug) {
            return NextResponse.json(
                { error: "Recipe slug is required" },
                { status: 400 }
            );
        }

        // Get current user to determine ownership
        const user = await getCurrentUser();

        const recipe = await getRecipeDetails({
            slug,
            currentUserId: user?.id,
        });

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
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        const user = await getCurrentUser();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { slug } = await params;

        if (!slug) {
            return NextResponse.json(
                { error: "Recipe slug is required" },
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
            slug,
            data: result.data,
            userId: user.id,
        });

        if (!updated) {
            return NextResponse.json(
                { error: "Recipe not found or you don't have permission to edit it" },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, slug });
    } catch (error) {
        console.error("Failed to update recipe:", error);
        const message = error instanceof Error ? error.message : "Failed to update recipe";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
