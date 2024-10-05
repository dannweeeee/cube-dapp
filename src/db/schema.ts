import { pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users_table", {
  wallet_address: text("wallet_address").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  first_name: text("first_name").notNull(),
  last_name: text("last_name").notNull(),
  created_at: timestamp("created_at").notNull().defaultNow(),
  updated_at: timestamp("updated_at")
    .notNull()
    .$onUpdate(() => new Date()),
});

export type InsertUser = typeof usersTable.$inferInsert;
export type SelectUser = typeof usersTable.$inferSelect;
