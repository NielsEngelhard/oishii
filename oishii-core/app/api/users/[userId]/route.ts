import getUserDetails from "@/features/user/query/get-user-details-query";
import { getCurrentUser } from "@/lib/security/auth/get-current-user";
import { NextResponse } from "next/server";

interface RouteParams {
    params: Promise<{ userId: string }>;
}

export async function GET(req: Request, { params }: RouteParams) {
    const { userId } = await params;
    const userIdNum = parseInt(userId, 10);

    if (isNaN(userIdNum)) {
        return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
    }

    const currentUser = await getCurrentUser();

    const userDetails = await getUserDetails({
        userId: userIdNum,
        currentUserId: currentUser?.id,
    });

    if (!userDetails) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(userDetails);
}
