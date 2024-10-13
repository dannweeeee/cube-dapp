import { db } from "../index";
import {
  InsertMerchant,
  InsertTransaction,
  InsertUser,
  merchantTable,
  transactionsTable,
  usersTable,
} from "../schema";

export async function createUser(data: InsertUser) {
  await db.insert(usersTable).values(data);
}

export async function createMerchant(data: InsertMerchant) {
  await db.insert(merchantTable).values(data);
}

export async function createTransaction(data: InsertTransaction) {
  await db.insert(transactionsTable).values(data);
}
