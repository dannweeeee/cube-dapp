import { NextRequest, NextResponse } from "next/server";
import { getTransactionsByUEN } from "@/db/queries/select";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const merchantUEN = request.nextUrl.searchParams.get("merchant_uen");

  if (!merchantUEN) {
    return NextResponse.json(
      { error: "Merchant UEN is required" },
      { status: 400 }
    );
  }

  try {
    const transactions = await getTransactionsByUEN(merchantUEN);

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
