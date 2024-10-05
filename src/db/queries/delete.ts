import { eq } from "drizzle-orm";
import { db } from "../index";
import { SelectUser, usersTable } from "../schema";

export async function deleteUser(wallet_address: SelectUser["wallet_address"]) {
  await db
    .delete(usersTable)
    .where(eq(usersTable.wallet_address, wallet_address));
}
