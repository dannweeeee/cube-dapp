import "dotenv/config";
import { PostgresJsDatabase, drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const connectionString = process.env.NEXT_PUBLIC_DATABASE_URL;

const drizzleClient = drizzle(
  postgres(connectionString!, {
    prepare: false,
  }),
  { schema }
);

declare global {
  let database: PostgresJsDatabase<typeof schema> | undefined;
}

type GlobalWithDatabase = typeof globalThis & {
  database: PostgresJsDatabase<typeof schema> | undefined;
};

export const db = (global as GlobalWithDatabase).database || drizzleClient;
if (process.env.NODE_ENV !== "production")
  (global as GlobalWithDatabase).database = db;
