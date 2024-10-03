import {
  integer,
  pgTable,
  text,
  boolean,
  timestamp,
} from "drizzle-orm/pg-core";

export const usersTable = pgTable("users_table", {
  wallet_address: text("wallet_address").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  first_name: text("first_name").notNull(),
  last_name: text("last_name").notNull(),
  country_code: text("country_code").notNull(),
  phone_number: text("phone_number").notNull(),
  is_merchant: boolean("is_merchant").notNull().default(false),
  created_at: timestamp("created_at").notNull().defaultNow(),
  updated_at: timestamp("updated_at")
    .notNull()
    .$onUpdate(() => new Date()),
});

export const merchantsTable = pgTable("merchants_table", {
  uen: text("uen").primaryKey(),
  merchant_name: text("merchant_name").notNull(),
  merchant_email: text("merchant_email").notNull(),
  merchant_wallet_address: text("merchant_wallet_address").notNull().unique(),
  created_at: timestamp("created_at").notNull().defaultNow(),
  updated_at: timestamp("updated_at")
    .notNull()
    .$onUpdate(() => new Date()),
});

export const transactionsTable = pgTable("transactions_table", {
  transaction_hash: text("transaction_hash").primaryKey(),
  user_wallet_address: text("user_wallet_address").notNull(),
  merchant_wallet_address: text("merchant_wallet_address").notNull(),
  amount: integer("amount").notNull(),
  is_successful: boolean("is_successful").notNull().default(false),
  created_at: timestamp("created_at").notNull().defaultNow(),
  updated_at: timestamp("updated_at")
    .notNull()
    .$onUpdate(() => new Date()),
});

export type InsertUser = typeof usersTable.$inferInsert;
export type SelectUser = typeof usersTable.$inferSelect;

export type InsertMerchant = typeof merchantsTable.$inferInsert;
export type SelectMerchant = typeof merchantsTable.$inferSelect;

export type InsertTransaction = typeof transactionsTable.$inferInsert;
export type SelectTransaction = typeof transactionsTable.$inferSelect;
