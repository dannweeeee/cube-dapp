import { NextRequest, NextResponse } from "next/server";
import { getMerchantByUEN } from "@/db/queries/select";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const merchantUEN = request.nextUrl.searchParams.get("uen");

  if (!merchantUEN) {
    return NextResponse.json(
      { error: "Merchant UEN is required" },
      { status: 400 }
    );
  }

  try {
    const merchants = await getMerchantByUEN(merchantUEN);

    if (merchants.length === 0) {
      return NextResponse.json({ error: "No merchant found" }, { status: 404 });
    }

    const merchant = merchants[0];
    return NextResponse.json({
      uen: merchant.uen,
      merchant_name: merchant.merchant_name,
      username: merchant.username,
      merchant_wallet_address: merchant.merchant_wallet_address,
      is_vault_enabled: merchant.is_vault_enabled,
      created_at: merchant.created_at,
      updated_at: merchant.updated_at,
    });
  } catch (error) {
    console.error("Error fetching merchant:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
