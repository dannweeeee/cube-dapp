import { NextResponse } from "next/server";
import { createTransaction } from "@/db/queries/insert";

export async function POST(request: Request) {
  try {
    const transactionData = await request.json();
    await createTransaction(transactionData);
    return NextResponse.json(
      { message: "Transaction created successfully" },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Error creating transaction:", error);
    return NextResponse.json(
      { error: "Error creating transaction" },
      { status: 500 }
    );
  }
}
