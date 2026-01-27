import { recipesTable, usersTable, recipeLikesTable, recipeTagsTable } from "@/db/schema";
import { db } from "@/lib/db/db";
import { IRecipeTeaser, IRecipeTag } from "@/models/recipe-models";
import { eq, desc, sql, inArray } from "drizzle-orm";

interface GetExploreRecipesParams {
    currentUserId?: number;
    randomLimit?: number;
    popularLimit?: number;
}

export interface ExploreRecipesResult {
    randomRecipes: IRecipeTeaser[];
    popularRecipes: IRecipeTeaser[];
}

// Helper to build the base recipe query with joins
function buildRecipeSelect(currentUserId?: number) {
    // Subquery for like count
    const likeCountSubquery = db
        .select({
            recipeId: recipeLikesTable.recipeId,
            count: sql<number>`count(*)::int`.as('like_count'),
        })
        .from(recipeLikesTable)
        .groupBy(recipeLikesTable.recipeId)
        .as('like_counts');

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

    return { likeCountSubquery, currentUserLikesSubquery };
}

function mapToRecipeTeaser(
    recipe: {
        id: string;
        slug: string;
        title: string;
        description: string | null;
        cookTime: number;
        servings: number;
        difficulty: string;
        imageUrl: string | null;
        createdAt: Date;
        authorId: number;
        authorName: string;
        likeCount: number;
        isLiked: boolean;
    },
    currentUserId?: number,
    tags?: IRecipeTag[]
): IRecipeTeaser {
    return {
        id: recipe.id,
        slug: recipe.slug,
        title: recipe.title,
        description: recipe.description,
        cookTime: recipe.cookTime,
        servings: recipe.servings,
        difficulty: recipe.difficulty as IRecipeTeaser["difficulty"],
        imageUrl: recipe.imageUrl,
        createdAt: recipe.createdAt,
        author: {
            id: recipe.authorId,
            name: recipe.authorName,
        },
        likeCount: recipe.likeCount,
        isLiked: recipe.isLiked,
        isOwner: currentUserId ? recipe.authorId === currentUserId : false,
        tags: tags || [],
    };
}

async function fetchTagsForRecipes(recipeIds: string[]): Promise<Map<string, IRecipeTag[]>> {
    const tagsMap = new Map<string, IRecipeTag[]>();

    if (recipeIds.length === 0) {
        return tagsMap;
    }

    const tags = await db
        .select({
            recipeId: recipeTagsTable.recipeId,
            tagKey: recipeTagsTable.tagKey,
            isOfficial: recipeTagsTable.isOfficial,
        })
        .from(recipeTagsTable)
        .where(inArray(recipeTagsTable.recipeId, recipeIds));

    for (const tag of tags) {
        const existing = tagsMap.get(tag.recipeId) || [];
        existing.push({ key: tag.tagKey, isOfficial: tag.isOfficial ?? false });
        tagsMap.set(tag.recipeId, existing);
    }

    return tagsMap;
}

export async function getRandomRecipes(
    currentUserId?: number,
    limit: number = 10
): Promise<IRecipeTeaser[]> {
    const { likeCountSubquery, currentUserLikesSubquery } = buildRecipeSelect(currentUserId);

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
        .leftJoin(likeCountSubquery, eq(recipesTable.id, likeCountSubquery.recipeId));

    if (currentUserLikesSubquery) {
        query = query.leftJoin(currentUserLikesSubquery, eq(recipesTable.id, currentUserLikesSubquery.recipeId)) as typeof query;
    }

    const recipes = await query
        .orderBy(sql`RANDOM()`)
        .limit(limit);

    // Fetch tags for all recipes
    const tagsMap = await fetchTagsForRecipes(recipes.map(r => r.id));

    return recipes.map(r => mapToRecipeTeaser(r, currentUserId, tagsMap.get(r.id)));
}

export async function getPopularRecipes(
    currentUserId?: number,
    limit: number = 10
): Promise<IRecipeTeaser[]> {
    const { likeCountSubquery, currentUserLikesSubquery } = buildRecipeSelect(currentUserId);

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
        .leftJoin(likeCountSubquery, eq(recipesTable.id, likeCountSubquery.recipeId));

    if (currentUserLikesSubquery) {
        query = query.leftJoin(currentUserLikesSubquery, eq(recipesTable.id, currentUserLikesSubquery.recipeId)) as typeof query;
    }

    const recipes = await query
        .orderBy(desc(sql`COALESCE(${likeCountSubquery.count}, 0)`), desc(recipesTable.createdAt))
        .limit(limit);

    // Fetch tags for all recipes
    const tagsMap = await fetchTagsForRecipes(recipes.map(r => r.id));

    return recipes.map(r => mapToRecipeTeaser(r, currentUserId, tagsMap.get(r.id)));
}

export default async function getExploreRecipes({
    currentUserId,
    randomLimit = 10,
    popularLimit = 10,
}: GetExploreRecipesParams): Promise<ExploreRecipesResult> {
    const [randomRecipes, popularRecipes] = await Promise.all([
        getRandomRecipes(currentUserId, randomLimit),
        getPopularRecipes(currentUserId, popularLimit),
    ]);

    return {
        randomRecipes,
        popularRecipes,
    };
}
