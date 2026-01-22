import { usersTable } from "@/db/schema";
import { db } from "@/lib/db/db";
import { getCurrentUser } from "@/lib/security/auth/get-current-user";
import { CurrentUserData } from "@/schemas/user-schemas";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  const [{id, username, language, avatar}] = await db.select({
      id: usersTable.id,
      username: usersTable.name,
      language: usersTable.language,
      avatar: usersTable.avatarUrl,
    })
    .from(usersTable)
    .where(eq(usersTable.id, user.id))
    .limit(1); 

  return NextResponse.json({
    id: id + "",
    username,
    language,
    avatar,
  } as CurrentUserData);
}
