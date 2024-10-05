import { eq } from "drizzle-orm";
import { db } from "../index";
import { SelectUser, usersTable } from "../schema";

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
