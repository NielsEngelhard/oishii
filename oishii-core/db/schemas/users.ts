import { InferSelectModel } from "drizzle-orm";
import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").unique().notNull(),
  password: text("password").notNull(),
  language: text("language").default("en").notNull(),
  aboutMe: text("about_me"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
export type UsersTable = InferSelectModel<typeof usersTable>;
