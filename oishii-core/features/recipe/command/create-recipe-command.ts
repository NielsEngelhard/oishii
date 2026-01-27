import { recipesTable, recipeTagsTable } from "@/db/schema";
import { db } from "@/lib/db/db";
import { isOfficialTag } from "@/lib/constants/official-tags";
import { generateUniqueSlug } from "@/lib/util/slug-util";
import { generateUuid } from "@/lib/util/uuid-util";
import { CreateRecipeSchemaData } from "@/schemas/recipe-schemas";

interface CreateRecipeParams {
    data: CreateRecipeSchemaData;
    userId: number;
}

interface CreateRecipeResult {
    recipeId: string;
    slug: string;
}

export default async function createRecipe({ data, userId }: CreateRecipeParams): Promise<CreateRecipeResult> {
    const recipeId = generateUuid();
    const slug = await generateUniqueSlug(data.title);

    await db.insert(recipesTable).values({
        id: recipeId,
        slug,
        userId,
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
    });

    // Insert tags if provided
    if (data.tags && data.tags.length > 0) {
        const tagRecords = data.tags.map(tagKey => ({
            recipeId,
            tagKey,
            isOfficial: isOfficialTag(tagKey),
        }));

        await db.insert(recipeTagsTable).values(tagRecords);
    }

    return { recipeId, slug };
}