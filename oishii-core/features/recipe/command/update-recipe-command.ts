import { recipesTable } from "@/db/schema";
import { db } from "@/lib/db/db";
import { CreateRecipeSchemaData } from "@/schemas/recipe-schemas";
import { eq, and } from "drizzle-orm";

interface UpdateRecipeParams {
    recipeId: string;
    data: CreateRecipeSchemaData;
    userId: number;
}

export default async function updateRecipe({ recipeId, data, userId }: UpdateRecipeParams): Promise<boolean> {
    const result = await db
        .update(recipesTable)
        .set({
            title: data.title,
            description: data.description,
            cookTime: data.cookTime,
            difficulty: data.difficulty,
            servings: data.servings,
            prepTime: data.prepTime,
            instructions: data.instructions,
            ingredients: data.ingredients,
            imageUrl: data.imageUrl,
            language: data.language,
            notes: data.notes,
            updatedAt: new Date(),
        })
        .where(
            and(
                eq(recipesTable.id, recipeId),
                eq(recipesTable.userId, userId)
            )
        )
        .returning({ id: recipesTable.id });

    return result.length > 0;
}
