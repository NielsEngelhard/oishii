import createRecipe from "@/features/recipe/command/create-recipe-command";
import { getCurrentUser } from "@/lib/security/auth/get-current-user";
import { createRecipeSchema } from "@/schemas/recipe-schemas";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        // TODO: dit gedeelte is 1 grote copy paste
        const user = await getCurrentUser();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();

        const result = createRecipeSchema.safeParse(body);
        if (!result.success) {
            return NextResponse.json(
                { error: result.error.issues[0]?.message || "Invalid input" },
                { status: 400 }
            );
        }

        const recipeId = await createRecipe({ data: result.data, userId: user.id });

        return NextResponse.json({ success: true, recipeId }, { status: 201 });
    } catch (error) {
        console.error("Failed to create recipe:", error);
        const message = error instanceof Error ? error.message : "Failed to create recipe";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}