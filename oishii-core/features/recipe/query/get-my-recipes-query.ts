import { recipesTable, usersTable, recipeLikesTable } from "@/db/schema";
import { RecipeDifficulty } from "@/db/schemas/enum/recipe-difficulty";
import { db } from "@/lib/db/db";
import { IPaginatedResponse, IRecipeTeaser } from "@/models/recipe-models";
import { eq, desc, sql, and, ilike, lte, gt, SQL, or } from "drizzle-orm";

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
    includeLiked?: boolean;
}

export default async function getMyRecipes({
    userId,
    page,
    pageSize,
    filters,
    includeLiked = true,
}: GetMyRecipesParams): Promise<IPaginatedResponse<IRecipeTeaser>> {
    const offset = (page - 1) * pageSize;

    // Subquery for like count
    const likeCountSubquery = db
        .select({
            recipeId: recipeLikesTable.recipeId,
            count: sql<number>`count(*)::int`.as('like_count'),
        })
        .from(recipeLikesTable)
        .groupBy(recipeLikesTable.recipeId)
        .as('like_counts');

    // Subquery for user's likes
    const userLikesSubquery = db
        .select({
            recipeId: recipeLikesTable.recipeId,
        })
        .from(recipeLikesTable)
        .where(eq(recipeLikesTable.userId, userId))
        .as('user_likes');

    // Build base condition - either owned by user OR liked by user (if includeLiked)
    let ownershipCondition: SQL;
    if (includeLiked) {
        ownershipCondition = or(
            eq(recipesTable.userId, userId),
            sql`${userLikesSubquery.recipeId} IS NOT NULL`
        )!;
    } else {
        ownershipCondition = eq(recipesTable.userId, userId);
    }

    // Build filter conditions
    const conditions: SQL[] = [ownershipCondition];

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
    const countQuery = db
        .select({ count: sql<number>`count(*)::int` })
        .from(recipesTable)
        .leftJoin(userLikesSubquery, eq(recipesTable.id, userLikesSubquery.recipeId))
        .where(whereClause);

    const countResult = await countQuery;
    const totalItems = countResult[0]?.count ?? 0;
    const totalPages = Math.ceil(totalItems / pageSize);

    // Get paginated recipes with author info and like data
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
            likeCount: sql<number>`COALESCE(${likeCountSubquery.count}, 0)`,
            isLiked: sql<boolean>`${userLikesSubquery.recipeId} IS NOT NULL`,
        })
        .from(recipesTable)
        .innerJoin(usersTable, eq(recipesTable.userId, usersTable.id))
        .leftJoin(likeCountSubquery, eq(recipesTable.id, likeCountSubquery.recipeId))
        .leftJoin(userLikesSubquery, eq(recipesTable.id, userLikesSubquery.recipeId))
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
        likeCount: recipe.likeCount,
        isLiked: recipe.isLiked,
        isOwner: recipe.authorId === userId,
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
