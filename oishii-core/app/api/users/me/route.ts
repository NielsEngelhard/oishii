import getUserDetails from "@/features/user/query/get-user-details-query";
import { getCurrentUser } from "@/lib/security/auth/get-current-user";
import { NextResponse } from "next/server";

export async function GET() {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
        return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
    }

    const userDetails = await getUserDetails({
        userId: currentUser.id,
        currentUserId: currentUser.id,
    });

    if (!userDetails) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(userDetails);
}
