import { login } from "@/features/authentication/login-command";
import { SessionAuthService } from "@/lib/security/auth/session-auth-service";
import { loginSchema } from "@/schemas/auth-schemas";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const authService = new SessionAuthService();

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const result = loginSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0]?.message || "Invalid input" },
        { status: 400 }
      );
    }

    const { userId, language } = await login(result.data);
    const sessionId = await authService.createSession(userId);

    const cookieStore = await cookies();
    cookieStore.set("session", sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: "/",
    });

    // Set language cookie for next-intl
    cookieStore.set("NEXT_LOCALE", language, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 365 * 24 * 60 * 60, // 1 year
      path: "/",
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Login failed";
    return NextResponse.json({ error: message }, { status: 401 });
  }
}
