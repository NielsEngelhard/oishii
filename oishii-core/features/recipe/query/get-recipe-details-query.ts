import { recipesTable, usersTable, recipeLikesTable, recipeTagsTable } from "@/db/schema";
import { db } from "@/lib/db/db";
import { IRecipeDetails, IRecipeTag } from "@/models/recipe-models";
import { eq, sql } from "drizzle-orm";

interface GetRecipeDetailsParams {
    slug: string;
    currentUserId?: number;
}

export default async function getRecipeDetails(
    slugOrParams: string | GetRecipeDetailsParams
): Promise<IRecipeDetails | null> {
    const { slug, currentUserId } = typeof slugOrParams === 'string'
        ? { slug: slugOrParams, currentUserId: undefined }
        : slugOrParams;

    // Subquery for like count
    const likeCountSubquery = db
        .select({
            recipeId: recipeLikesTable.recipeId,
            count: sql<number>`count(*)::int`.as('like_count'),
        })
        .from(recipeLikesTable)
        .groupBy(recipeLikesTable.recipeId)
        .as('like_counts');

    // Subquery for user's like (only if currentUserId provided)
    const userLikesSubquery = currentUserId
        ? db
            .select({
                recipeId: recipeLikesTable.recipeId,
            })
            .from(recipeLikesTable)
            .where(eq(recipeLikesTable.userId, currentUserId))
            .as('user_likes')
        : null;

    const baseQuery = db
        .select({
            id: recipesTable.id,
            slug: recipesTable.slug,
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
            updatedAt: recipesTable.updatedAt,
            authorId: usersTable.id,
            authorName: usersTable.name,
            likeCount: sql<number>`COALESCE(${likeCountSubquery.count}, 0)`,
            isLiked: userLikesSubquery
                ? sql<boolean>`${userLikesSubquery.recipeId} IS NOT NULL`
                : sql<boolean>`false`,
        })
        .from(recipesTable)
        .innerJoin(usersTable, eq(recipesTable.userId, usersTable.id))
        .leftJoin(likeCountSubquery, eq(recipesTable.id, likeCountSubquery.recipeId));

    // Add user likes join if currentUserId provided
    const queryWithUserLikes = userLikesSubquery
        ? baseQuery.leftJoin(userLikesSubquery, eq(recipesTable.id, userLikesSubquery.recipeId))
        : baseQuery;

    const result = await queryWithUserLikes
        .where(eq(recipesTable.slug, slug))
        .limit(1);

    const recipe = result[0];
    if (!recipe) {
        return null;
    }

    // Fetch tags for this recipe
    const tagsResult = await db
        .select({
            tagKey: recipeTagsTable.tagKey,
            isOfficial: recipeTagsTable.isOfficial,
        })
        .from(recipeTagsTable)
        .where(eq(recipeTagsTable.recipeId, recipe.id));

    const tags: IRecipeTag[] = tagsResult.map(t => ({
        key: t.tagKey,
        isOfficial: t.isOfficial ?? false,
    }));

    return {
        id: recipe.id,
        slug: recipe.slug,
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
        updatedAt: recipe.updatedAt,
        author: {
            id: recipe.authorId,
            name: recipe.authorName,
        },
        likeCount: recipe.likeCount,
        isLiked: recipe.isLiked,
        isOwner: currentUserId ? recipe.authorId === currentUserId : false,
        tags,
    };
}
