import { db } from "@/lib/db/db";
import { eq } from "drizzle-orm";
import { randomBytes } from "crypto";
import { AuthUser, IAuthService } from "./auth-service";
import { sessionsTable, usersTable } from "@/db/schema";

export class SessionAuthService implements IAuthService {
    
    async createSession(userId: number): Promise<string> {
        const sessionId = randomBytes(32).toString('base64url');
        const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
        
        await db.insert(sessionsTable).values({
            id: sessionId,
            userId,
            expiresAt,
        });
        
        return sessionId;
    }
    
    async validateSession(sessionId: string): Promise<AuthUser | null> {
        const [result] = await db
            .select({
                id: usersTable.id,
                email: usersTable.email,
                name: usersTable.name,
                expiresAt: sessionsTable.expiresAt,
            })
            .from(sessionsTable)
            .innerJoin(usersTable, eq(sessionsTable.userId, usersTable.id))
            .where(eq(sessionsTable.id, sessionId))
            .limit(1);
        
        if (!result || result.expiresAt < new Date()) {
            return null;
        }
        
        return {
            id: result.id,
            email: result.email,
            name: result.name,
        };
    }
    
    async invalidateSession(sessionId: string): Promise<void> {
        await db.delete(sessionsTable).where(eq(sessionsTable.id, sessionId));
    }
    
    async refreshSession(sessionId: string): Promise<string> {
        // Extend existing session
        const newExpiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
        await db
            .update(sessionsTable)
            .set({ expiresAt: newExpiresAt })
            .where(eq(sessionsTable.id, sessionId));
        
        return sessionId;
    }
}