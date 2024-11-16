import { NextResponse } from "next/server";
import { getUsersWalletAddress } from "@/db/queries/select";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const users = await getUsersWalletAddress();
    return NextResponse.json(users, { status: 200 });
  } catch (error: unknown) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Error fetching users" },
      { status: 500 }
    );
  }
}
