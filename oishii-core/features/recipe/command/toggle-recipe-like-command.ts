import { recipeLikesTable, recipesTable } from "@/db/schema";
import { db } from "@/lib/db/db";
import { eq, and } from "drizzle-orm";

interface ToggleRecipeLikeParams {
    userId: number;
    recipeId: string;
}

interface ToggleRecipeLikeResult {
    success: boolean;
    isLiked: boolean;
    error?: string;
}

export default async function toggleRecipeLike({ userId, recipeId }: ToggleRecipeLikeParams): Promise<ToggleRecipeLikeResult> {
    // Check if recipe exists and get owner
    const recipe = await db
        .select({ userId: recipesTable.userId })
        .from(recipesTable)
        .where(eq(recipesTable.id, recipeId))
        .limit(1);

    if (recipe.length === 0) {
        return { success: false, isLiked: false, error: "Recipe not found" };
    }

    // Can't like your own recipe
    if (recipe[0].userId === userId) {
        return { success: false, isLiked: false, error: "Cannot like your own recipe" };
    }

    // Check if already liked
    const existingLike = await db
        .select()
        .from(recipeLikesTable)
        .where(
            and(
                eq(recipeLikesTable.userId, userId),
                eq(recipeLikesTable.recipeId, recipeId)
            )
        )
        .limit(1);

    if (existingLike.length > 0) {
        // Unlike
        await db
            .delete(recipeLikesTable)
            .where(
                and(
                    eq(recipeLikesTable.userId, userId),
                    eq(recipeLikesTable.recipeId, recipeId)
                )
            );
        return { success: true, isLiked: false };
    } else {
        // Like
        await db.insert(recipeLikesTable).values({
            userId,
            recipeId,
        });
        return { success: true, isLiked: true };
    }
}
