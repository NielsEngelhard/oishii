import { InferSelectModel } from "drizzle-orm";
import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

// Default cheat sheet content
export const DEFAULT_CHEAT_SHEET = `Pasta: 80-100g pp
Rice (uncooked): 75-100g pp
Potato: 200-250g pp`;

export const usersTable = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").unique().notNull(),
  password: text("password").notNull(),
  language: text("language").default("en").notNull(),
  aboutMe: text("about_me"),
  avatarUrl: text("avatar_url"),
  cheatSheet: text("cheat_sheet").default(DEFAULT_CHEAT_SHEET),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
export type UsersTable = InferSelectModel<typeof usersTable>;
