import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../card";
import { Address } from "viem";
import { useUserEthBalance } from "@/hooks/useUserEthBalance";
import Image from "next/image";

const EthBalanceCard = ({ address }: { address: Address }) => {
  const { balance, isLoading, error } = useUserEthBalance(address);

  const roundedBalance = parseFloat(balance).toFixed(5);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">ETH Balance</CardTitle>
        <Image src="/icons/eth.svg" alt="ETH" width={24} height={24} />
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-2xl font-bold">Loading...</div>
        ) : error ? (
          <div className="text-2xl font-bold text-red-500">
            Error fetching balance
          </div>
        ) : (
          <>
            <div className="text-2xl font-bold">{roundedBalance} ETH</div>
            <p className="text-xs text-muted-foreground">Current ETH balance</p>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default EthBalanceCard;
