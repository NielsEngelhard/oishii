import getFriendSuggestions from "@/features/friend/query/get-friend-suggestions-query";
import { getCurrentUser } from "@/lib/security/auth/get-current-user";
import { NextResponse } from "next/server";

export async function GET() {
    const user = await getCurrentUser();

    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const suggestions = await getFriendSuggestions({
        userId: user.id,
        limit: 3,
    });

    return NextResponse.json({ items: suggestions });
}
