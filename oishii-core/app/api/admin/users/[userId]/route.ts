import { db } from "@/lib/db/db";
import { usersTable } from "@/db/schema";
import { userPlans } from "@/db/schemas/enum/user-plan";
import { getCurrentUser } from "@/lib/security/auth/get-current-user";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { PasswordHasher } from "@/lib/security/password-hasher";

interface RouteParams {
    params: Promise<{ userId: string }>;
}

const updateUserSchema = z.object({
    name: z.string().min(1).optional(),
    email: z.string().email().optional(),
    plan: z.enum(userPlans).optional(),
    password: z.string().min(8).optional(),
});

export async function PATCH(request: NextRequest, { params }: RouteParams) {
    try {
        const { userId } = await params;
        const userIdNum = parseInt(userId, 10);

        if (isNaN(userIdNum)) {
            return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
        }

        // Check admin authorization
        const currentUser = await getCurrentUser();
        if (!currentUser) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Get current user's plan to check if admin
        const adminCheck = await db.select({ plan: usersTable.plan })
            .from(usersTable)
            .where(eq(usersTable.id, currentUser.id))
            .limit(1);

        if (!adminCheck.length || adminCheck[0].plan !== "admin") {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const body = await request.json();
        const parseResult = updateUserSchema.safeParse(body);

        if (!parseResult.success) {
            return NextResponse.json(
                { error: parseResult.error.issues[0]?.message || "Invalid input" },
                { status: 400 }
            );
        }

        const updates = parseResult.data;

        // Build update object
        const updateData: Record<string, unknown> = {};

        if (updates.name) {
            updateData.name = updates.name;
        }

        if (updates.email) {
            // Check if email is already taken
            const existingUser = await db.select({ id: usersTable.id })
                .from(usersTable)
                .where(eq(usersTable.email, updates.email))
                .limit(1);

            if (existingUser.length && existingUser[0].id !== userIdNum) {
                return NextResponse.json(
                    { error: "Email already in use" },
                    { status: 400 }
                );
            }

            updateData.email = updates.email;
        }

        if (updates.plan) {
            updateData.plan = updates.plan;
        }

        if (updates.password) {
            const hashedPassword = PasswordHasher.hash(updates.password);
            updateData.password = hashedPassword;
        }

        if (Object.keys(updateData).length === 0) {
            return NextResponse.json(
                { error: "No fields to update" },
                { status: 400 }
            );
        }

        // Update user
        await db.update(usersTable)
            .set(updateData)
            .where(eq(usersTable.id, userIdNum));

        // Fetch updated user
        const updatedUser = await db.select({
            id: usersTable.id,
            name: usersTable.name,
            email: usersTable.email,
            plan: usersTable.plan,
            language: usersTable.language,
            createdAt: usersTable.createdAt,
        })
            .from(usersTable)
            .where(eq(usersTable.id, userIdNum))
            .limit(1);

        return NextResponse.json({
            success: true,
            user: updatedUser[0],
        });
    } catch (error) {
        console.error("Admin update user API error:", error);
        return NextResponse.json(
            { error: "Failed to update user" },
            { status: 500 }
        );
    }
}
