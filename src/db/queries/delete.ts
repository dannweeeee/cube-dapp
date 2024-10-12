import { eq } from "drizzle-orm";
import { db } from "../index";
import {
  merchantTable,
  SelectMerchant,
  SelectUser,
  usersTable,
} from "../schema";

export async function deleteUser(wallet_address: SelectUser["wallet_address"]) {
  await db
    .delete(usersTable)
    .where(eq(usersTable.wallet_address, wallet_address));
}

export async function deleteMerchant(
  merchant_wallet_address: SelectMerchant["merchant_wallet_address"]
) {
  await db
    .delete(merchantTable)
    .where(eq(merchantTable.merchant_wallet_address, merchant_wallet_address));
}
