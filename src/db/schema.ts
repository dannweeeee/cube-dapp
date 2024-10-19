import {
  pgTable,
  text,
  timestamp,
  boolean,
  decimal,
} from "drizzle-orm/pg-core";

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

export const merchantTable = pgTable("merchant_table", {
  uen: text("uen").primaryKey(),
  merchant_name: text("merchant_name").notNull(),
  username: text("username").notNull(),
  merchant_wallet_address: text("merchant_wallet_address").notNull(),
  is_vault_enabled: boolean("is_vault_enabled").notNull(),
  created_at: timestamp("created_at").notNull().defaultNow(),
  updated_at: timestamp("updated_at")
    .notNull()
    .$onUpdate(() => new Date()),
});

export type InsertMerchant = typeof merchantTable.$inferInsert;
export type SelectMerchant = typeof merchantTable.$inferSelect;

export const transactionsTable = pgTable("transactions_table", {
  transaction_hash: text("transaction_hash").primaryKey(),
  merchant_uen: text("merchant_uen").notNull(),
  user_wallet_address: text("user_wallet_address").notNull(),
  amount: decimal("amount", { precision: 10, scale: 5 }).notNull(),
  created_at: timestamp("created_at").notNull().defaultNow(),
});

export type InsertTransaction = typeof transactionsTable.$inferInsert;
export type SelectTransaction = typeof transactionsTable.$inferSelect;
