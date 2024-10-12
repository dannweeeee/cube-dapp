import { eq } from "drizzle-orm";
import { db } from "../index";
import {
  merchantTable,
  SelectMerchant,
  SelectUser,
  usersTable,
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
  return db.select().from(merchantTable);
}

export async function getMerchantByWalletAddress(
  merchant_wallet_address: SelectMerchant["merchant_wallet_address"]
): Promise<
  Array<{
    uen: string;
    merchant_name: string;
    username: string;
    merchant_wallet_address: string;
    use_vault: boolean;
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
    use_vault: boolean;
    created_at: Date;
    updated_at: Date;
  }>
> {
  return db.select().from(merchantTable).where(eq(merchantTable.uen, uen));
}
