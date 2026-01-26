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

interface GetUserRecipesParams {
    /** The user whose recipes (owned/liked) we're viewing */
    targetUserId: number;
    /** The logged-in user (for isLiked/isOwner status). If not provided, isLiked will be false */
    currentUserId?: number;
    page: number;
    pageSize: number;
    filters?: RecipeFilters;
    /** Whether to include recipes liked by targetUserId (default: true) */
    includeLiked?: boolean;
}

export default async function getUserRecipes({
    targetUserId,
    currentUserId,
    page,
    pageSize,
    filters,
    includeLiked = true,
}: GetUserRecipesParams): Promise<IPaginatedResponse<IRecipeTeaser>> {
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

    // Subquery for target user's likes (to determine which recipes to show)
    const targetUserLikesSubquery = db
        .select({
            recipeId: recipeLikesTable.recipeId,
        })
        .from(recipeLikesTable)
        .where(eq(recipeLikesTable.userId, targetUserId))
        .as('target_user_likes');

    // Subquery for current user's likes (to show isLiked status)
    const currentUserLikesSubquery = currentUserId
        ? db
            .select({
                recipeId: recipeLikesTable.recipeId,
            })
            .from(recipeLikesTable)
            .where(eq(recipeLikesTable.userId, currentUserId))
            .as('current_user_likes')
        : null;

    // Build base condition - either owned by target user OR liked by target user (if includeLiked)
    let ownershipCondition: SQL;
    if (includeLiked) {
        ownershipCondition = or(
            eq(recipesTable.userId, targetUserId),
            sql`${targetUserLikesSubquery.recipeId} IS NOT NULL`
        )!;
    } else {
        ownershipCondition = eq(recipesTable.userId, targetUserId);
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
        .leftJoin(targetUserLikesSubquery, eq(recipesTable.id, targetUserLikesSubquery.recipeId))
        .where(whereClause);

    const countResult = await countQuery;
    const totalItems = countResult[0]?.count ?? 0;
    const totalPages = Math.ceil(totalItems / pageSize);

    // Get paginated recipes with author info and like data
    let query = db
        .select({
            id: recipesTable.id,
            slug: recipesTable.slug,
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
            isLiked: currentUserLikesSubquery
                ? sql<boolean>`${currentUserLikesSubquery.recipeId} IS NOT NULL`
                : sql<boolean>`false`,
        })
        .from(recipesTable)
        .innerJoin(usersTable, eq(recipesTable.userId, usersTable.id))
        .leftJoin(likeCountSubquery, eq(recipesTable.id, likeCountSubquery.recipeId))
        .leftJoin(targetUserLikesSubquery, eq(recipesTable.id, targetUserLikesSubquery.recipeId));

    // Add current user likes join if logged in
    if (currentUserLikesSubquery) {
        query = query.leftJoin(currentUserLikesSubquery, eq(recipesTable.id, currentUserLikesSubquery.recipeId)) as typeof query;
    }

    const recipes = await query
        .where(whereClause)
        .orderBy(desc(recipesTable.createdAt))
        .limit(pageSize)
        .offset(offset);

    const items: IRecipeTeaser[] = recipes.map((recipe) => ({
        id: recipe.id,
        slug: recipe.slug,
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
        isOwner: currentUserId ? recipe.authorId === currentUserId : false,
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
