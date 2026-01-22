import { friendshipsTable, usersTable, recipesTable } from "@/db/schema";
import { db } from "@/lib/db/db";
import { IUserDetails } from "@/models/user-models";
import { eq, sql, and } from "drizzle-orm";

interface GetUserDetailsParams {
    userId: number;
    currentUserId?: number;
}

export default async function getUserDetails({
    userId,
    currentUserId,
}: GetUserDetailsParams): Promise<IUserDetails | null> {
    // Get user basic info
    const userResult = await db
        .select({
            id: usersTable.id,
            name: usersTable.name,
            aboutMe: usersTable.aboutMe,
            createdAt: usersTable.createdAt,
            language: usersTable.language
        })
        .from(usersTable)
        .where(eq(usersTable.id, userId))
        .limit(1);

    if (userResult.length === 0) {
        return null;
    }

    const user = userResult[0];

    // Get recipe count
    const recipeCountResult = await db
        .select({ count: sql<number>`count(*)::int` })
        .from(recipesTable)
        .where(eq(recipesTable.userId, userId));

    const totalRecipes = recipeCountResult[0]?.count ?? 0;

    // Get friend count
    const friendCountResult = await db
        .select({ count: sql<number>`count(*)::int` })
        .from(friendshipsTable)
        .where(eq(friendshipsTable.userId, userId));

    const totalFriends = friendCountResult[0]?.count ?? 0;

    // Check if current user is friends with this user
    let isFriend = false;
    if (currentUserId && currentUserId !== userId) {
        const friendshipResult = await db
            .select()
            .from(friendshipsTable)
            .where(
                and(
                    eq(friendshipsTable.userId, currentUserId),
                    eq(friendshipsTable.friendId, userId)
                )
            )
            .limit(1);

        isFriend = friendshipResult.length > 0;
    }

    return {
        id: user.id,
        name: user.name,
        aboutMe: user.aboutMe,
        totalRecipes,
        totalFriends,
        createdAt: user.createdAt,
        isFriend,
        isCurrentUser: currentUserId === userId,
        language: user.language
    };
}
