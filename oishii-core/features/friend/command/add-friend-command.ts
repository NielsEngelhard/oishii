import { friendshipsTable, usersTable } from "@/db/schema";
import { db } from "@/lib/db/db";
import { eq, and } from "drizzle-orm";

interface AddFriendParams {
    userId: number;
    friendId: number;
}

interface AddFriendResult {
    success: boolean;
    error?: string;
}

export default async function addFriend({ userId, friendId }: AddFriendParams): Promise<AddFriendResult> {
    // Can't add yourself as a friend
    if (userId === friendId) {
        return { success: false, error: "Cannot add yourself as a friend" };
    }

    // Check if friend exists
    const friend = await db
        .select({ id: usersTable.id })
        .from(usersTable)
        .where(eq(usersTable.id, friendId))
        .limit(1);

    if (friend.length === 0) {
        return { success: false, error: "User not found" };
    }

    // Check if already friends
    const existingFriendship = await db
        .select()
        .from(friendshipsTable)
        .where(
            and(
                eq(friendshipsTable.userId, userId),
                eq(friendshipsTable.friendId, friendId)
            )
        )
        .limit(1);

    if (existingFriendship.length > 0) {
        return { success: false, error: "Already friends" };
    }

    // Add friendship (bidirectional)
    await db.insert(friendshipsTable).values([
        { userId, friendId },
        { userId: friendId, friendId: userId },
    ]);

    return { success: true };
}
