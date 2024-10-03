import { db } from "../index";
import {
  InsertUser,
  InsertMerchant,
  InsertTransaction,
  usersTable,
  merchantsTable,
  transactionsTable,
} from "../schema";

export async function createUser(data: InsertUser) {
  await db.insert(usersTable).values(data);
}

export async function createMerchant(data: InsertMerchant) {
  await db.insert(merchantsTable).values(data);
}

export async function createTransaction(data: InsertTransaction) {
  await db.insert(transactionsTable).values(data);
}
