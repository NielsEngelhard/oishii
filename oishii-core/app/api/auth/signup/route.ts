import { createUser } from "@/features/authentication/sign-up-command";
import { signUpSchema } from "@/schemas/auth-schemas";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const result = signUpSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0]?.message || "Invalid input" },
        { status: 400 }
      );
    }

    await createUser(result.data);

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Signup failed";

    if (message.includes("duplicate") || message.includes("unique")) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 409 }
      );
    }

    return NextResponse.json({ error: message }, { status: 400 });
  }
}
