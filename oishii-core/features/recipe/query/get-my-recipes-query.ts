import { recipesTable, usersTable } from "@/db/schema";
import { RecipeDifficulty } from "@/db/schemas/enum/recipe-difficulty";
import { db } from "@/lib/db/db";
import { IPaginatedResponse, IRecipeTeaser } from "@/models/recipe-models";
import { eq, desc, sql, and, ilike, lte, gt, SQL } from "drizzle-orm";

export interface RecipeFilters {
    search?: string;
    difficulty?: RecipeDifficulty;
    maxTotalTime?: number;
    minTotalTime?: number;
}

interface GetMyRecipesParams {
    userId: number;
    page: number;
    pageSize: number;
    filters?: RecipeFilters;
}

export default async function getMyRecipes({
    userId,
    page,
    pageSize,
    filters,
}: GetMyRecipesParams): Promise<IPaginatedResponse<IRecipeTeaser>> {
    const offset = (page - 1) * pageSize;

    // Build filter conditions
    const conditions: SQL[] = [eq(recipesTable.userId, userId)];

    if (filters?.search) {
        conditions.push(ilike(recipesTable.title, `%${filters.search}%`));
    }

    if (filters?.difficulty) {
        conditions.push(eq(recipesTable.difficulty, filters.difficulty));
    }

    // Total time filter (prepTime + cookTime)
    const totalTimeExpr = sql`COALESCE(${recipesTable.prepTime}, 0) + ${recipesTable.cookTime}`;

    if (filters?.maxTotalTime) {
        conditions.push(lte(totalTimeExpr, filters.maxTotalTime));
    }

    if (filters?.minTotalTime) {
        conditions.push(gt(totalTimeExpr, filters.minTotalTime));
    }

    const whereClause = and(...conditions);

    // Get total count with filters
    const countResult = await db
        .select({ count: sql<number>`count(*)::int` })
        .from(recipesTable)
        .where(whereClause);

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
        .where(whereClause)
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
