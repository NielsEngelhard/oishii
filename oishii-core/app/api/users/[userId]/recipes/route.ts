import { RecipeDifficulty, recipeDifficulties } from "@/db/schemas/enum/recipe-difficulty";
import getUserRecipes, { RecipeFilters } from "@/features/recipe/query/get-user-recipes-query";
import { getCurrentUser } from "@/lib/security/auth/get-current-user";
import { NextResponse } from "next/server";

const DEFAULT_PAGE_SIZE = 10;

interface RouteParams {
    params: Promise<{ userId: string }>;
}

export async function GET(req: Request, { params }: RouteParams) {
    const { userId } = await params;
    const targetUserId = parseInt(userId, 10);

    if (isNaN(targetUserId)) {
        return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
    }

    // Get current user for like status (optional)
    const currentUser = await getCurrentUser();

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

    // Parse includeLiked parameter (default: false for viewing other users)
    const includeLikedParam = searchParams.get("includeLiked");
    const includeLiked = includeLikedParam === "true";

    const result = await getUserRecipes({
        targetUserId,
        currentUserId: currentUser?.id,
        page,
        pageSize,
        filters,
        includeLiked,
    });

    return NextResponse.json(result);
}
