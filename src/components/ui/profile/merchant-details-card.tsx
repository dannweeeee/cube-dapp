import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../card";
import { Store } from "lucide-react";

interface MerchantDetailsCardProps {
  uen: string;
  name: string;
}

const MerchantDetailsCard: React.FC<MerchantDetailsCardProps> = ({
  uen,
  name,
}) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{name}</CardTitle>
        <Store className="w-5 h-5" />
      </CardHeader>
      <CardContent>
        <p className="text-xs text-muted-foreground mb-2">Merchant UEN</p>
        <div className="text-2xl font-bold">UEN: {uen}</div>
      </CardContent>
    </Card>
  );
};

export default MerchantDetailsCard;
