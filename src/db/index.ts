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
  var database: PostgresJsDatabase<typeof schema> | undefined;
}

export const db = global.database || drizzleClient;
if (process.env.NODE_ENV !== "production") global.database = db;
