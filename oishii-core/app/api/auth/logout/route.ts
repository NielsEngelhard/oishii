import { SessionAuthService } from "@/lib/security/auth/session-auth-service";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const authService = new SessionAuthService();

export async function POST() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("session");

    if (sessionCookie?.value) {
      await authService.invalidateSession(sessionCookie.value);
    }

    cookieStore.delete("session");

    return NextResponse.json({ success: true }, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Logout failed" }, { status: 500 });
  }
}
