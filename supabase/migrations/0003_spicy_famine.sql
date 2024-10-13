CREATE TABLE IF NOT EXISTS "transactions_table" (
	"transaction_hash" text PRIMARY KEY NOT NULL,
	"merchant_uen" text NOT NULL,
	"user_wallet_address" text NOT NULL,
	"amount" numeric(10, 5) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
