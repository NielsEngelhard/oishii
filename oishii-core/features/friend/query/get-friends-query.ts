import { friendshipsTable, usersTable, recipesTable } from "@/db/schema";
import { db } from "@/lib/db/db";
import { IPaginatedResponse } from "@/models/recipe-models";
import { IUserTeaser } from "@/models/user-models";
import { eq, sql, ilike, and } from "drizzle-orm";

interface GetFriendsParams {
    userId: number;
    page: number;
    pageSize: number;
    search?: string;
}

export default async function getFriends({
    userId,
    page,
    pageSize,
    search,
}: GetFriendsParams): Promise<IPaginatedResponse<IUserTeaser>> {
    const offset = (page - 1) * pageSize;

    // Build where conditions
    const baseCondition = eq(friendshipsTable.userId, userId);
    const searchCondition = search
        ? and(baseCondition, ilike(usersTable.name, `%${search}%`))
        : baseCondition;

    // Get total count
    const countResult = await db
        .select({ count: sql<number>`count(*)::int` })
        .from(friendshipsTable)
        .innerJoin(usersTable, eq(friendshipsTable.friendId, usersTable.id))
        .where(searchCondition);

    const totalItems = countResult[0]?.count ?? 0;
    const totalPages = Math.ceil(totalItems / pageSize);

    // Get friends with recipe count
    const friends = await db
        .select({
            id: usersTable.id,
            name: usersTable.name,
            aboutMe: usersTable.aboutMe,
            language: usersTable.language,
            totalRecipes: sql<number>`count(${recipesTable.id})::int`,
        })
        .from(friendshipsTable)
        .innerJoin(usersTable, eq(friendshipsTable.friendId, usersTable.id))
        .leftJoin(recipesTable, eq(usersTable.id, recipesTable.userId))
        .where(searchCondition)
        .groupBy(usersTable.id, usersTable.name, usersTable.aboutMe, usersTable.language)
        .limit(pageSize)
        .offset(offset);

    return {
        items: friends,
        pagination: {
            page,
            pageSize,
            totalItems,
            totalPages,
            hasNextPage: page < totalPages,
            hasPreviousPage: page > 1,
        },
    };
}
