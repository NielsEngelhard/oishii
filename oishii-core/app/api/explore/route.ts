import getExploreRecipes, { getRandomRecipes } from "@/features/recipe/query/get-explore-recipes-query";
import { getCurrentUser } from "@/lib/security/auth/get-current-user";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    const currentUser = await getCurrentUser();

    const { searchParams } = new URL(req.url);
    const refreshType = searchParams.get("refresh");

    // If refresh=random, only fetch new random recipes
    if (refreshType === "random") {
        const randomRecipes = await getRandomRecipes(currentUser?.id, 10);
        return NextResponse.json({ randomRecipes });
    }

    // Otherwise, fetch both random and popular
    const result = await getExploreRecipes({
        currentUserId: currentUser?.id,
        randomLimit: 10,
        popularLimit: 10,
    });

    return NextResponse.json(result);
}
