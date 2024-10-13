import { NextRequest, NextResponse } from "next/server";
import { getTransactionsByWalletAddress } from "@/db/queries/select";

export async function GET(request: NextRequest) {
  const walletAddress = request.nextUrl.searchParams.get("user_wallet_address");

  if (!walletAddress) {
    return NextResponse.json(
      { error: "Wallet address is required" },
      { status: 400 }
    );
  }

  try {
    const transactions = await getTransactionsByWalletAddress(walletAddress);

    if (transactions.length === 0) {
      return NextResponse.json(
        { error: "No transactions found" },
        { status: 404 }
      );
    }

    return NextResponse.json(transactions);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
