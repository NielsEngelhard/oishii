import { friendshipsTable } from "@/db/schema";
import { db } from "@/lib/db/db";
import { eq, and, or } from "drizzle-orm";

interface RemoveFriendParams {
    userId: number;
    friendId: number;
}

interface RemoveFriendResult {
    success: boolean;
    error?: string;
}

export default async function removeFriend({ userId, friendId }: RemoveFriendParams): Promise<RemoveFriendResult> {
    // Remove friendship (both directions)
    await db
        .delete(friendshipsTable)
        .where(
            or(
                and(
                    eq(friendshipsTable.userId, userId),
                    eq(friendshipsTable.friendId, friendId)
                ),
                and(
                    eq(friendshipsTable.userId, friendId),
                    eq(friendshipsTable.friendId, userId)
                )
            )
        );

    return { success: true };
}
