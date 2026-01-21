import searchUsers from "@/features/friend/query/search-users-query";
import { getCurrentUser } from "@/lib/security/auth/get-current-user";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    const user = await getCurrentUser();

    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("q");

    if (!search || search.trim().length === 0) {
        return NextResponse.json({ items: [] });
    }

    const users = await searchUsers({
        userId: user.id,
        search: search.trim(),
        limit: 10,
    });

    return NextResponse.json({ items: users });
}
