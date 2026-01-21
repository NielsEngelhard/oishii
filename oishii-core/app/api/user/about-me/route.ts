import { requireAuth } from "@/lib/security/auth/get-current-user";
import { db } from "@/lib/db/db";
import { usersTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const user = await requireAuth();
        const body = await req.json();
        const { aboutMe } = body;

        // Allow null/empty string to clear about me
        const aboutMeValue = aboutMe?.trim() || null;

        // Validate length (max 500 characters)
        if (aboutMeValue && aboutMeValue.length > 500) {
            return NextResponse.json(
                { error: "About me text is too long (max 500 characters)" },
                { status: 400 }
            );
        }

        await db
            .update(usersTable)
            .set({ aboutMe: aboutMeValue })
            .where(eq(usersTable.id, user.id));

        return NextResponse.json({ success: true, aboutMe: aboutMeValue });
    } catch {
        return NextResponse.json(
            { error: "Failed to update about me" },
            { status: 500 }
        );
    }
}
