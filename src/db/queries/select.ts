import { eq } from "drizzle-orm";
import { db } from "../index";
import {
  merchantTable,
  SelectMerchant,
  SelectTransaction,
  SelectUser,
  transactionsTable,
  usersTable,
} from "../schema";

export async function getUsers() {
  return db.select().from(usersTable);
}

export async function getUsersWalletAddress() {
  return db
    .select({ wallet_address: usersTable.wallet_address })
    .from(usersTable);
}

export async function getUserByWalletAddress(
  wallet_address: SelectUser["wallet_address"]
): Promise<
  Array<{
    wallet_address: string;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    created_at: Date;
    updated_at: Date;
  }>
> {
  return db
    .select()
    .from(usersTable)
    .where(eq(usersTable.wallet_address, wallet_address));
}

export async function getMerchants() {
  return db.select().from(merchantTable);
}

export async function getMerchantsWalletAddress() {
  return db
    .select({
      merchant_wallet_address: merchantTable.merchant_wallet_address,
    })
    .from(merchantTable);
}

export async function getMerchantByWalletAddress(
  merchant_wallet_address: SelectMerchant["merchant_wallet_address"]
): Promise<
  Array<{
    uen: string;
    merchant_name: string;
    username: string;
    merchant_wallet_address: string;
    is_vault_enabled: boolean;
    created_at: Date;
    updated_at: Date;
  }>
> {
  return db
    .select()
    .from(merchantTable)
    .where(eq(merchantTable.merchant_wallet_address, merchant_wallet_address));
}

export async function getMerchantByUEN(uen: SelectMerchant["uen"]): Promise<
  Array<{
    uen: string;
    merchant_name: string;
    username: string;
    merchant_wallet_address: string;
    is_vault_enabled: boolean;
    created_at: Date;
    updated_at: Date;
  }>
> {
  return db.select().from(merchantTable).where(eq(merchantTable.uen, uen));
}

export async function getTransactions() {
  return db.select().from(transactionsTable);
}

export async function getTransactionsByWalletAddress(
  user_wallet_address: SelectTransaction["user_wallet_address"]
): Promise<
  Array<{
    transaction_hash: string;
    merchant_uen: string;
    user_wallet_address: string;
    amount: string;
    created_at: Date;
  }>
> {
  return db
    .select()
    .from(transactionsTable)
    .where(eq(transactionsTable.user_wallet_address, user_wallet_address));
}

export async function getTransactionsByUEN(
  merchant_uen: SelectTransaction["merchant_uen"]
): Promise<
  Array<{
    transaction_hash: string;
    merchant_uen: string;
    user_wallet_address: string;
    amount: string;
    created_at: Date;
  }>
> {
  return db
    .select()
    .from(transactionsTable)
    .where(eq(transactionsTable.merchant_uen, merchant_uen));
}
