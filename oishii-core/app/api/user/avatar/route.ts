import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/security/auth/get-current-user";
import { db } from "@/lib/db/db";
import { usersTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";

const avatarSchema = z.object({
  avatarUrl: z.string().url().nullable(),
});

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const result = avatarSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid avatar URL" },
        { status: 400 }
      );
    }

    await db
      .update(usersTable)
      .set({ avatarUrl: result.data.avatarUrl })
      .where(eq(usersTable.id, user.id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Avatar update error:", error);
    return NextResponse.json(
      { error: "Failed to update avatar" },
      { status: 500 }
    );
  }
}
