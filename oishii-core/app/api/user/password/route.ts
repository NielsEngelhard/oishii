import { requireAuth } from "@/lib/security/auth/get-current-user";
import { db } from "@/lib/db/db";
import { usersTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { PasswordHasher } from "@/lib/security/password-hasher";

export async function POST(req: Request) {
    try {
        const user = await requireAuth();
        const body = await req.json();
        const { currentPassword, newPassword } = body;

        if (!currentPassword) {
            return NextResponse.json(
                { error: "currentPasswordRequired" },
                { status: 400 }
            );
        }

        if (!newPassword || newPassword.length < 8) {
            return NextResponse.json(
                { error: "passwordTooShort" },
                { status: 400 }
            );
        }

        // Get current user's password hash
        const userRecord = await db
            .select({ password: usersTable.password })
            .from(usersTable)
            .where(eq(usersTable.id, user.id))
            .limit(1);

        if (userRecord.length === 0) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        // Verify current password
        const isValidPassword = PasswordHasher.verify(currentPassword, userRecord[0].password);
        if (!isValidPassword) {
            return NextResponse.json(
                { error: "incorrectPassword" },
                { status: 400 }
            );
        }

        // Hash and update new password
        const hashedPassword = PasswordHasher.hash(newPassword);
        await db
            .update(usersTable)
            .set({ password: hashedPassword })
            .where(eq(usersTable.id, user.id));

        return NextResponse.json({ success: true });
    } catch {
        return NextResponse.json(
            { error: "Failed to update password" },
            { status: 500 }
        );
    }
}
