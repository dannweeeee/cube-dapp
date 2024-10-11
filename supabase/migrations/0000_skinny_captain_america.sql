CREATE TABLE IF NOT EXISTS "users_table" (
	"wallet_address" TEXT PRIMARY KEY NOT NULL,
	"username" TEXT NOT NULL,
	"email" TEXT NOT NULL,
	"first_name" TEXT NOT NULL,
	"last_name" TEXT NOT NULL,
	"created_at" TIMESTAMP DEFAULT NOW() NOT NULL,
	"updated_at" TIMESTAMP NOT NULL,
	CONSTRAINT "users_table_username_unique" UNIQUE("username"),
	CONSTRAINT "users_table_email_unique" UNIQUE("email")
);