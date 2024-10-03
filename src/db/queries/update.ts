import { eq } from "drizzle-orm";
import { db } from "../index";
import {
  SelectUser,
  SelectMerchant,
  usersTable,
  merchantsTable,
} from "../schema";

export async function updateUser(
  wallet_address: SelectUser["wallet_address"],
  data: Partial<Omit<SelectUser, "wallet_address">>
) {
  await db
    .update(usersTable)
    .set(data)
    .where(eq(usersTable.wallet_address, wallet_address));
}

export async function updateMerchant(
  uen: SelectMerchant["uen"],
  data: Partial<Omit<SelectMerchant, "uen">>
) {
  await db.update(merchantsTable).set(data).where(eq(merchantsTable.uen, uen));
}
