import { eq } from "drizzle-orm";
import { db } from "../index";
import {
  SelectUser,
  SelectMerchant,
  SelectTransaction,
  usersTable,
  merchantsTable,
  transactionsTable,
} from "../schema";

export async function getUsers() {
  return db.select().from(usersTable);
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
  return db.select().from(merchantsTable);
}

export async function getMerchantByUEN(uen: SelectMerchant["uen"]): Promise<
  Array<{
    uen: string;
    merchant_name: string;
    merchant_email: string;
    merchant_wallet_address: string;
    created_at: Date;
    updated_at: Date;
  }>
> {
  return db.select().from(merchantsTable).where(eq(merchantsTable.uen, uen));
}

export async function getTransactions() {
  return db.select().from(transactionsTable);
}

export async function getTransactionByTransactionHash(
  transaction_hash: SelectTransaction["transaction_hash"]
): Promise<
  Array<{
    transaction_hash: string;
    user_wallet_address: string;
    merchant_wallet_address: string;
    amount: number;
    is_successful: boolean;
    created_at: Date;
    updated_at: Date;
  }>
> {
  return db
    .select()
    .from(transactionsTable)
    .where(eq(transactionsTable.transaction_hash, transaction_hash));
}
