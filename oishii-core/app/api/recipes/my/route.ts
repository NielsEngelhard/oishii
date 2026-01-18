import getMyRecipes from "@/features/recipe/query/get-my-recipes-query";
import { getCurrentUser } from "@/lib/security/auth/get-current-user";
import { NextResponse } from "next/server";

const DEFAULT_PAGE_SIZE = 10;

export async function GET(req: Request) {
    const user = await getCurrentUser();

    // TODO: iets verzinnen voor authorized endpoints - sws uit proxy.ts
    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const pageSize = Math.min(50, Math.max(1, parseInt(searchParams.get("pageSize") || String(DEFAULT_PAGE_SIZE), 10)));

    const result = await getMyRecipes({
        userId: user.id,
        page,
        pageSize,
    });

    return NextResponse.json(result);
}