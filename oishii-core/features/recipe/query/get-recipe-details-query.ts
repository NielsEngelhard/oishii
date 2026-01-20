import { recipesTable, usersTable } from "@/db/schema";
import { db } from "@/lib/db/db";
import { IRecipeDetails } from "@/models/recipe-models";
import { eq } from "drizzle-orm";

export default async function getRecipeDetails(
    recipeId: string
): Promise<IRecipeDetails | null> {
    const result = await db
        .select({
            id: recipesTable.id,
            title: recipesTable.title,
            description: recipesTable.description,
            prepTime: recipesTable.prepTime,
            cookTime: recipesTable.cookTime,
            servings: recipesTable.servings,
            difficulty: recipesTable.difficulty,
            imageUrl: recipesTable.imageUrl,
            ingredients: recipesTable.ingredients,
            instructions: recipesTable.instructions,
            language: recipesTable.language,
            notes: recipesTable.notes,
            createdAt: recipesTable.createdAt,
            authorId: usersTable.id,
            authorName: usersTable.name,
        })
        .from(recipesTable)
        .innerJoin(usersTable, eq(recipesTable.userId, usersTable.id))
        .where(eq(recipesTable.id, recipeId))
        .limit(1);

    const recipe = result[0];
    if (!recipe) {
        return null;
    }

    return {
        id: recipe.id,
        title: recipe.title,
        description: recipe.description,
        prepTime: recipe.prepTime,
        cookTime: recipe.cookTime,
        servings: recipe.servings,
        difficulty: recipe.difficulty,
        imageUrl: recipe.imageUrl,
        ingredients: recipe.ingredients,
        instructions: recipe.instructions,
        language: recipe.language,
        notes: recipe.notes,
        createdAt: recipe.createdAt,
        author: {
            id: recipe.authorId,
            name: recipe.authorName,
        },
    };
}
