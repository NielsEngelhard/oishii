import { recipesTable } from "@/db/schema";
import { db } from "@/lib/db/db";
import { generateUuid } from "@/lib/util/uuid-util";
import { CreateRecipeSchemaData } from "@/schemas/recipe-schemas";

// Returns recipeId
export default async function createRecipe(data: CreateRecipeSchemaData): Promise<string> {
    const recipeId = generateUuid();

    await db.insert(recipesTable).values({
        id: recipeId,
        title: data.title,
        description: data.description,
        cookTime: String(data.cookTime),
        difficulty: data.difficulty,
        servings: data.servings,
        prepTime: data.prepTime ? String(data.prepTime) : null,
        instructions: data.instructions,
        ingredients: data.ingredients,
    });

    return recipeId;
}