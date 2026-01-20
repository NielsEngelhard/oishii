import { requireAuth } from "@/lib/security/auth/get-current-user";
import { db } from "@/lib/db/db";
import { usersTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { isValidLocale } from "@/i18n/config";

export async function POST(req: Request) {
  try {
    const user = await requireAuth();
    const body = await req.json();
    const { language } = body;

    if (!language || !isValidLocale(language)) {
      return NextResponse.json(
        { error: "Invalid language" },
        { status: 400 }
      );
    }

    // Update user's language in database
    await db
      .update(usersTable)
      .set({ language })
      .where(eq(usersTable.id, user.id));

    // Update language cookie
    const cookieStore = await cookies();
    cookieStore.set("NEXT_LOCALE", language, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 365 * 24 * 60 * 60, // 1 year
      path: "/",
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to update language" },
      { status: 500 }
    );
  }
}
