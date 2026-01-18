import { recipesTable, usersTable } from "@/db/schema";
import { db } from "@/lib/db/db";
import { IPaginatedResponse, IRecipeTeaser } from "@/models/recipe-models";
import { eq, desc, sql } from "drizzle-orm";

interface GetMyRecipesParams {
    userId: number;
    page: number;
    pageSize: number;
}

export default async function getMyRecipes({
    userId,
    page,
    pageSize,
}: GetMyRecipesParams): Promise<IPaginatedResponse<IRecipeTeaser>> {
    const offset = (page - 1) * pageSize;

    // Get total count
    const countResult = await db
        .select({ count: sql<number>`count(*)::int` })
        .from(recipesTable)
        .where(eq(recipesTable.userId, userId));

    const totalItems = countResult[0]?.count ?? 0;
    const totalPages = Math.ceil(totalItems / pageSize);

    // Get paginated recipes with author info
    const recipes = await db
        .select({
            id: recipesTable.id,
            title: recipesTable.title,
            description: recipesTable.description,
            cookTime: recipesTable.cookTime,
            servings: recipesTable.servings,
            difficulty: recipesTable.difficulty,
            imageUrl: recipesTable.imageUrl,
            createdAt: recipesTable.createdAt,
            authorId: usersTable.id,
            authorName: usersTable.name,
        })
        .from(recipesTable)
        .innerJoin(usersTable, eq(recipesTable.userId, usersTable.id))
        .where(eq(recipesTable.userId, userId))
        .orderBy(desc(recipesTable.createdAt))
        .limit(pageSize)
        .offset(offset);

    const items: IRecipeTeaser[] = recipes.map((recipe) => ({
        id: recipe.id,
        title: recipe.title,
        description: recipe.description,
        cookTime: recipe.cookTime,
        servings: recipe.servings,
        difficulty: recipe.difficulty,
        imageUrl: recipe.imageUrl,
        createdAt: recipe.createdAt,
        author: {
            id: recipe.authorId,
            name: recipe.authorName,
        },
    }));

    return {
        items,
        pagination: {
            page,
            pageSize,
            totalItems,
            totalPages,
            hasNextPage: page < totalPages,
            hasPreviousPage: page > 1,
        },
    };
}