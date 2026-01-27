import { recipesTable, recipeTagsTable } from "@/db/schema";
import { db } from "@/lib/db/db";
import { isOfficialTag } from "@/lib/constants/official-tags";
import { CreateRecipeSchemaData } from "@/schemas/recipe-schemas";
import { eq, and } from "drizzle-orm";

interface UpdateRecipeParams {
    slug: string;
    data: CreateRecipeSchemaData;
    userId: number;
}

export default async function updateRecipe({ slug, data, userId }: UpdateRecipeParams): Promise<boolean> {
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
                eq(recipesTable.slug, slug),
                eq(recipesTable.userId, userId)
            )
        )
        .returning({ id: recipesTable.id });

    if (result.length === 0) {
        return false;
    }

    const recipeId = result[0].id;

    // Update tags - delete all existing and insert new ones
    await db.delete(recipeTagsTable).where(eq(recipeTagsTable.recipeId, recipeId));

    if (data.tags && data.tags.length > 0) {
        const tagRecords = data.tags.map(tagKey => ({
            recipeId,
            tagKey,
            isOfficial: isOfficialTag(tagKey),
        }));

        await db.insert(recipeTagsTable).values(tagRecords);
    }

    return true;
}
