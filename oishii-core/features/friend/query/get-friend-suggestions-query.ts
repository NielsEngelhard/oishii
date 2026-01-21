import { friendshipsTable, usersTable, recipesTable } from "@/db/schema";
import { db } from "@/lib/db/db";
import { IUserTeaser } from "@/models/user-models";
import { eq, sql, ne, notInArray, asc } from "drizzle-orm";

interface GetFriendSuggestionsParams {
    userId: number;
    limit?: number;
}

export default async function getFriendSuggestions({
    userId,
    limit = 3,
}: GetFriendSuggestionsParams): Promise<IUserTeaser[]> {
    // Get IDs of current friends
    const friendIds = await db
        .select({ friendId: friendshipsTable.friendId })
        .from(friendshipsTable)
        .where(eq(friendshipsTable.userId, userId));

    const excludeIds = [userId, ...friendIds.map(f => f.friendId)];

    // Get oldest users who are not friends (excluding self)
    const suggestions = await db
        .select({
            id: usersTable.id,
            name: usersTable.name,
            aboutMe: usersTable.aboutMe,
            totalRecipes: sql<number>`count(${recipesTable.id})::int`,
        })
        .from(usersTable)
        .leftJoin(recipesTable, eq(usersTable.id, recipesTable.userId))
        .where(
            excludeIds.length > 1
                ? notInArray(usersTable.id, excludeIds)
                : ne(usersTable.id, userId)
        )
        .groupBy(usersTable.id, usersTable.name, usersTable.aboutMe, usersTable.createdAt)
        .orderBy(asc(usersTable.createdAt))
        .limit(limit);

    return suggestions;
}
