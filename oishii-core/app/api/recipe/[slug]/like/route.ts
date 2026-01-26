import toggleRecipeLike from "@/features/recipe/command/toggle-recipe-like-command";
import { getCurrentUser } from "@/lib/security/auth/get-current-user";
import { NextResponse } from "next/server";

interface RouteParams {
    params: Promise<{ slug: string }>;
}

export async function POST(req: Request, { params }: RouteParams) {
    const user = await getCurrentUser();

    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { slug } = await params;

    const result = await toggleRecipeLike({
        userId: user.id,
        slug,
    });

    if (!result.success) {
        return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({ success: true, isLiked: result.isLiked });
}
