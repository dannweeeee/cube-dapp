import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../card";
import { Address } from "viem";
import { useUserUsdcBalance } from "@/hooks/useUserUsdcBalance";
import Image from "next/image";
import { SyncLoader } from "react-spinners";
import { Store } from "lucide-react";

interface MerchantDetailsCardProps {
  uen: string;
  name: string;
  address: Address;
}

const MerchantDetailsCard: React.FC<MerchantDetailsCardProps> = ({
  uen,
  name,
  address,
}) => {
  const { balance, isLoading, error } = useUserUsdcBalance(address);

  const roundedBalance = parseFloat(balance).toFixed(5);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{name}</CardTitle>
        <Store className="w-5 h-5" />
      </CardHeader>
      <CardContent>
        <p className="text-xs text-muted-foreground mb-2">Merchant UEN</p>
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
            <div className="text-2xl font-bold">UEN: {uen}</div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default MerchantDetailsCard;
