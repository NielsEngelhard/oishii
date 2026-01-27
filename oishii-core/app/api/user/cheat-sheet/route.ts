import { usersTable, DEFAULT_CHEAT_SHEET } from "@/db/schemas/users";
import { db } from "@/lib/db/db";
import { getCurrentUser } from "@/lib/security/auth/get-current-user";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
    const user = await getCurrentUser();

    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const result = await db
        .select({ cheatSheet: usersTable.cheatSheet })
        .from(usersTable)
        .where(eq(usersTable.id, user.id))
        .limit(1);

    const cheatSheet = result[0]?.cheatSheet ?? DEFAULT_CHEAT_SHEET;

    return NextResponse.json({ cheatSheet });
}

export async function POST(req: Request) {
    const user = await getCurrentUser();

    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { cheatSheet } = body;

    if (typeof cheatSheet !== "string") {
        return NextResponse.json({ error: "Invalid cheat sheet" }, { status: 400 });
    }

    // Limit cheat sheet to 2000 characters
    if (cheatSheet.length > 2000) {
        return NextResponse.json({ error: "Cheat sheet too long" }, { status: 400 });
    }

    await db
        .update(usersTable)
        .set({ cheatSheet })
        .where(eq(usersTable.id, user.id));

    return NextResponse.json({ success: true });
}
