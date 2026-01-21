import getFriends from "@/features/friend/query/get-friends-query";
import { getCurrentUser } from "@/lib/security/auth/get-current-user";
import { NextResponse } from "next/server";

const DEFAULT_PAGE_SIZE = 20;

export async function GET(req: Request) {
    const user = await getCurrentUser();

    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const pageSize = Math.min(20, Math.max(1, parseInt(searchParams.get("pageSize") || String(DEFAULT_PAGE_SIZE), 10)));
    const search = searchParams.get("search") || undefined;

    const result = await getFriends({
        userId: user.id,
        page,
        pageSize,
        search: search?.trim(),
    });

    return NextResponse.json(result);
}
