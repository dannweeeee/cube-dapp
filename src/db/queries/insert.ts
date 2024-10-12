import { db } from "../index";
import {
  InsertMerchant,
  InsertUser,
  merchantTable,
  usersTable,
} from "../schema";

export async function createUser(data: InsertUser) {
  await db.insert(usersTable).values(data);
}

export async function createMerchant(data: InsertMerchant) {
  await db.insert(merchantTable).values(data);
}
