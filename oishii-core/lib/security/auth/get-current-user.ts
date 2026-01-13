import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SessionAuthService } from "./session-auth-service";
import { AuthUser } from "./auth-service";

const authService = new SessionAuthService();

export async function getCurrentUser(): Promise<AuthUser | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session");

  if (!sessionCookie?.value) {
    return null;
  }

  return authService.validateSession(sessionCookie.value);
}

export async function requireAuth(): Promise<AuthUser> {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login?expired=true");
  }

  return user;
}
