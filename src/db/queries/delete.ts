import { eq } from "drizzle-orm";
import { db } from "../index";
import {
  SelectUser,
  SelectMerchant,
  usersTable,
  merchantsTable,
} from "../schema";

export async function deleteUser(wallet_address: SelectUser["wallet_address"]) {
  await db
    .delete(usersTable)
    .where(eq(usersTable.wallet_address, wallet_address));
}

export async function deleteMerchant(uen: SelectMerchant["uen"]) {
  await db.delete(merchantsTable).where(eq(merchantsTable.uen, uen));
}
