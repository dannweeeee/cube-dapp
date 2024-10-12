import { eq } from "drizzle-orm";
import { db } from "../index";
import {
  merchantTable,
  SelectMerchant,
  SelectUser,
  usersTable,
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
  await db.update(merchantTable).set(data).where(eq(merchantTable.uen, uen));
}
