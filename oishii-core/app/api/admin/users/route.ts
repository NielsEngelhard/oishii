import { db } from "@/lib/db/db";
import { usersTable } from "@/db/schema";
import { getCurrentUser } from "@/lib/security/auth/get-current-user";
import { count, ilike, or, sql } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

const PAGE_SIZE = 10;

export async function GET(request: NextRequest) {
    try {
        // Check admin authorization
        const currentUser = await getCurrentUser();
        if (!currentUser) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Get user's plan to check if admin
        const userResult = await db.select({ plan: usersTable.plan })
            .from(usersTable)
            .where(sql`${usersTable.id} = ${currentUser.id}`)
            .limit(1);

        if (!userResult.length || userResult[0].plan !== "admin") {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        // Get query parameters
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get("page") || "1", 10);
        const search = searchParams.get("search") || "";

        // Build where clause for search
        const whereClause = search
            ? or(
                ilike(usersTable.name, `%${search}%`),
                ilike(usersTable.email, `%${search}%`)
            )
            : undefined;

        // Get total count
        const totalResult = await db.select({ count: count() })
            .from(usersTable)
            .where(whereClause);
        const total = totalResult[0]?.count ?? 0;

        // Get users with pagination
        const users = await db.select({
            id: usersTable.id,
            name: usersTable.name,
            email: usersTable.email,
            plan: usersTable.plan,
            language: usersTable.language,
            createdAt: usersTable.createdAt,
        })
            .from(usersTable)
            .where(whereClause)
            .orderBy(sql`${usersTable.createdAt} DESC`)
            .limit(PAGE_SIZE)
            .offset((page - 1) * PAGE_SIZE);

        return NextResponse.json({
            users,
            pagination: {
                page,
                pageSize: PAGE_SIZE,
                total,
                totalPages: Math.ceil(total / PAGE_SIZE),
            },
        });
    } catch (error) {
        console.error("Admin users API error:", error);
        return NextResponse.json(
            { error: "Failed to fetch users" },
            { status: 500 }
        );
    }
}
