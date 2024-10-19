import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../card";
import { Address } from "viem";
import { useUserUsdcBalance } from "@/hooks/useUserUsdcBalance";
import Image from "next/image";
import { SyncLoader } from "react-spinners";

const UsdcBalanceCard = ({ address }: { address: Address }) => {
  const { balance, isLoading, error } = useUserUsdcBalance(address);

  const roundedBalance = parseFloat(balance).toFixed(5);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">USDC Balance</CardTitle>
        <Image src="/icons/usdc.svg" alt="USDC" width={24} height={24} />
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-2xl font-bold">
            <SyncLoader size={5} />
          </div>
        ) : error ? (
          <div className="text-2xl font-bold text-red-500">
            Error fetching balance
          </div>
        ) : (
          <>
            <div className="text-2xl font-bold">{roundedBalance} USDC</div>
            <p className="text-xs text-muted-foreground">
              Current USDC balance
            </p>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default UsdcBalanceCard;
