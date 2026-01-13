import { InferSelectModel } from "drizzle-orm";
import { pgTable, integer, text, timestamp } from "drizzle-orm/pg-core";
import { usersTable } from "../schema";

export const sessionsTable = pgTable('sessions', {
    id: text('id').primaryKey(),
    userId: integer('user_id').notNull().references(() => usersTable.id, { onDelete: 'cascade' }),
    expiresAt: timestamp('expires_at').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
});
export type SessionsTable = InferSelectModel<typeof sessionsTable>;