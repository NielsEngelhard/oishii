import { RecipeFilterValues } from "@/components/specific/recipe/RecipesFilter";

export interface RecipeQueryParams {
    page: number;
    pageSize: number;
    includeLiked: boolean;
    filters: RecipeFilterValues;
}

/**
 * Builds URLSearchParams for recipe list API calls.
 * Centralizes query parameter logic so adding new filters only requires changes in one place.
 */
export function buildRecipeQueryParams({
    page,
    pageSize,
    includeLiked,
    filters,
}: RecipeQueryParams): URLSearchParams {
    const params = new URLSearchParams({
        page: String(page),
        pageSize: String(pageSize),
        includeLiked: String(includeLiked),
    });

    if (filters.search) {
        params.set("search", filters.search);
    }
    if (filters.difficulty) {
        params.set("difficulty", filters.difficulty);
    }
    if (filters.totalTime) {
        params.set("totalTime", filters.totalTime);
    }
    if (filters.tags && filters.tags.length > 0) {
        params.set("tags", filters.tags.join(","));
    }

    return params;
}

/**
 * Builds the full API URL for fetching a user's recipes.
 */
export function buildUserRecipesUrl(userId: string | number, queryParams: RecipeQueryParams): string {
    const params = buildRecipeQueryParams(queryParams);
    return `/api/users/${userId}/recipes?${params.toString()}`;
}
