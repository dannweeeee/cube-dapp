import { NextRequest, NextResponse } from "next/server";
import { getTransactionsByWalletAddress } from "@/db/queries/select";
import { Transaction } from "@/lib/types";

export const dynamic = "force-dynamic";

const MAX_RETRIES = 3;
const INITIAL_BACKOFF = 1000; // 1 second

async function fetchWithRetry(
  walletAddress: string,
  retries = 0
): Promise<Transaction[]> {
  try {
    const rawTransactions = await getTransactionsByWalletAddress(walletAddress);
    return rawTransactions.map((transaction) => ({
      ...transaction,
      amount: parseFloat(transaction.amount),
    }));
  } catch (error) {
    if (retries < MAX_RETRIES) {
      const backoff = INITIAL_BACKOFF * Math.pow(2, retries);
      console.log(`Retrying in ${backoff}ms...`);
      await new Promise((resolve) => setTimeout(resolve, backoff));
      return fetchWithRetry(walletAddress, retries + 1);
    }
    throw error;
  }
}

export async function GET(request: NextRequest) {
  const walletAddress = request.nextUrl.searchParams.get("user_wallet_address");

  if (!walletAddress) {
    return NextResponse.json(
      { error: "Wallet address is required" },
      { status: 400 }
    );
  }

  try {
    const transactions = await fetchWithRetry(walletAddress);

    if (transactions.length === 0) {
      return NextResponse.json(
        { message: "No transactions found" },
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
