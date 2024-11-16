import { NextResponse } from "next/server";
import { getMerchantsWalletAddress } from "@/db/queries/select";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const merchants = await getMerchantsWalletAddress();
    return NextResponse.json(merchants, { status: 200 });
  } catch (error: unknown) {
    console.error("Error fetching merchants:", error);
    return NextResponse.json(
      { error: "Error fetching merchants" },
      { status: 500 }
    );
  }
}
