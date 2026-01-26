import { recipesTable } from "@/db/schema";
import { db } from "@/lib/db/db";
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

    return { recipeId, slug };
}