import { RecipeDifficulty, recipeDifficulties } from "@/db/schemas/enum/recipe-difficulty";
import getMyRecipes, { RecipeFilters } from "@/features/recipe/query/get-my-recipes-query";
import { getCurrentUser } from "@/lib/security/auth/get-current-user";
import { NextResponse } from "next/server";

const DEFAULT_PAGE_SIZE = 10;

export async function GET(req: Request) {
    const user = await getCurrentUser();

    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const pageSize = Math.min(50, Math.max(1, parseInt(searchParams.get("pageSize") || String(DEFAULT_PAGE_SIZE), 10)));

    // Parse filter parameters
    const filters: RecipeFilters = {};

    const search = searchParams.get("search");
    if (search && search.trim()) {
        filters.search = search.trim();
    }

    const difficulty = searchParams.get("difficulty");
    if (difficulty && recipeDifficulties.includes(difficulty as RecipeDifficulty)) {
        filters.difficulty = difficulty as RecipeDifficulty;
    }

    const totalTime = searchParams.get("totalTime");
    if (totalTime) {
        if (totalTime === "30") {
            filters.maxTotalTime = 30;
        } else if (totalTime === "60") {
            filters.maxTotalTime = 60;
        } else if (totalTime === "60+") {
            filters.minTotalTime = 60;
        }
    }

    const result = await getMyRecipes({
        userId: user.id,
        page,
        pageSize,
        filters,
    });

    return NextResponse.json(result);
}
