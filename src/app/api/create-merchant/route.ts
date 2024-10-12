import { NextResponse } from "next/server";
import { createMerchant } from "@/db/queries/insert";

export async function POST(request: Request) {
  try {
    const merchantData = await request.json();
    await createMerchant(merchantData);
    return NextResponse.json(
      { message: "Merchant registered successfully" },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Error registering merchant:", error);
    return NextResponse.json(
      { error: "Error registering merchant" },
      { status: 500 }
    );
  }
}
