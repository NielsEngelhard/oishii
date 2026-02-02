import { friendshipsTable, usersTable, recipesTable } from "@/db/schema";
import { db } from "@/lib/db/db";
import { IUserTeaser } from "@/models/user-models";
import { eq, sql, ne, ilike, notInArray } from "drizzle-orm";

interface SearchUsersParams {
    userId: number;
    search: string;
    limit?: number;
}

export interface IUserTeaserWithFriendStatus extends IUserTeaser {
    isFriend: boolean;
}

export default async function searchUsers({
    userId,
    search,
    limit = 10,
}: SearchUsersParams): Promise<IUserTeaserWithFriendStatus[]> {
    // Get IDs of current friends
    const friendIds = await db
        .select({ friendId: friendshipsTable.friendId })
        .from(friendshipsTable)
        .where(eq(friendshipsTable.userId, userId));

    const friendIdSet = new Set(friendIds.map(f => f.friendId));

    // Search users by name (excluding self)
    const users = await db
        .select({
            id: usersTable.id,
            name: usersTable.name,
            aboutMe: usersTable.aboutMe,
            language: usersTable.language,
            plan: usersTable.plan,
            totalRecipes: sql<number>`count(${recipesTable.id})::int`,
        })
        .from(usersTable)
        .leftJoin(recipesTable, eq(usersTable.id, recipesTable.userId))
        .where(
            ne(usersTable.id, userId)
        )
        .groupBy(usersTable.id, usersTable.name, usersTable.aboutMe, usersTable.language, usersTable.plan)
        .having(ilike(usersTable.name, `%${search}%`))
        .limit(limit);

    return users.map(user => ({
        ...user,
        isFriend: friendIdSet.has(user.id),
    }));
}
