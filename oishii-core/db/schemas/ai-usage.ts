import { InferSelectModel } from "drizzle-orm";
import { integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { usersTable } from "./users";

export const aiUsageTable = pgTable("ai_usage", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => usersTable.id),
  action: text("action").notNull(), // 'url_scrape' | 'text_parse'
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type AiUsageTable = InferSelectModel<typeof aiUsageTable>;
