import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../card";
import { Percent } from "lucide-react";

const VaultBalanceCard = () => {
  return (
    <Card className="opacity-50">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Cube Vault</CardTitle>
        <Percent className="w-5 h-5" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">16.92% APY</div>
        <p className="text-xs text-muted-foreground">
          Aave USDC Lending Market
        </p>
        <p className="text-xs text-muted-foreground mt-2 italic">
          Vault feature coming soon
        </p>
      </CardContent>
    </Card>
  );
};

export default VaultBalanceCard;
