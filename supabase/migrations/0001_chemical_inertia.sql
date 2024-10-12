CREATE TABLE IF NOT EXISTS "merchant_table" (
	"uen" text PRIMARY KEY NOT NULL,
	"merchant_name" text NOT NULL,
	"username" text NOT NULL,
	"merchant_wallet_address" text NOT NULL,
	"is_vault" boolean NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	CONSTRAINT "merchant_table_username_unique" UNIQUE("username"),
	CONSTRAINT "merchant_table_merchant_wallet_address_unique" UNIQUE("merchant_wallet_address")
);
