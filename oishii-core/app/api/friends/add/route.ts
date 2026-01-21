import addFriend from "@/features/friend/command/add-friend-command";
import { getCurrentUser } from "@/lib/security/auth/get-current-user";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const user = await getCurrentUser();

    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const friendId = body.friendId;

    if (!friendId || typeof friendId !== "number") {
        return NextResponse.json({ error: "Invalid friendId" }, { status: 400 });
    }

    const result = await addFriend({
        userId: user.id,
        friendId,
    });

    if (!result.success) {
        return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({ success: true });
}
