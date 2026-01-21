import { friendshipsTable } from "@/db/schemas/friendships";
import { recipeLikesTable } from "@/db/schemas/recipe-likes";
import { recipesTable } from "@/db/schemas/recipes";
import { usersTable } from "@/db/schemas/users";
import { db } from "@/lib/db/db";
import { count, eq, sql } from "drizzle-orm";

export interface IMyProfileData {
    aboutMe: string | null;
    memberSince: Date;
    statistics: {
        recipesCreated: number;
        totalLikesReceived: number;
        recipesLiked: number;
        friendsCount: number;
    };
}

export async function getMyProfile(userId: number): Promise<IMyProfileData | null> {
    // Fetch user data
    const [userData] = await db
        .select({
            aboutMe: usersTable.aboutMe,
            createdAt: usersTable.createdAt,
        })
        .from(usersTable)
        .where(eq(usersTable.id, userId))
        .limit(1);

    if (!userData) {
        return null;
    }

    // Fetch statistics in parallel
    const [
        recipesCreatedResult,
        totalLikesReceivedResult,
        recipesLikedResult,
        friendsCountResult,
    ] = await Promise.all([
        // Count recipes created by user
        db
            .select({ count: count() })
            .from(recipesTable)
            .where(eq(recipesTable.userId, userId)),

        // Count total likes received on user's recipes
        db
            .select({ count: count() })
            .from(recipeLikesTable)
            .innerJoin(recipesTable, eq(recipeLikesTable.recipeId, recipesTable.id))
            .where(eq(recipesTable.userId, userId)),

        // Count recipes liked by user
        db
            .select({ count: count() })
            .from(recipeLikesTable)
            .where(eq(recipeLikesTable.userId, userId)),

        // Count friends (bidirectional - just count one direction)
        db
            .select({ count: count() })
            .from(friendshipsTable)
            .where(eq(friendshipsTable.userId, userId)),
    ]);

    return {
        aboutMe: userData.aboutMe,
        memberSince: userData.createdAt,
        statistics: {
            recipesCreated: recipesCreatedResult[0]?.count ?? 0,
            totalLikesReceived: totalLikesReceivedResult[0]?.count ?? 0,
            recipesLiked: recipesLikedResult[0]?.count ?? 0,
            friendsCount: friendsCountResult[0]?.count ?? 0,
        },
    };
}
