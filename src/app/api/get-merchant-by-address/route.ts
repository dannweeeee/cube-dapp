import { NextRequest, NextResponse } from "next/server";
import { getMerchantByWalletAddress } from "@/db/queries/select";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const merchantWalletAddress = request.nextUrl.searchParams.get(
    "merchant_wallet_address"
  );

  if (!merchantWalletAddress) {
    return NextResponse.json(
      { error: "Merchant wallet address is required" },
      { status: 400 }
    );
  }

  try {
    const merchants = await getMerchantByWalletAddress(merchantWalletAddress);

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
