import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../card";
import { useReadContract } from "wagmi";
import Image from "next/image";
import {
  BASE_SEPOLIA_REGISTRY_ADDRESS,
  BASE_SEPOLIA_VAULT_ADDRESS,
} from "@/lib/constants";
import VaultAbi from "@/abis/VaultAbi";
import RegistryAbi from "@/abis/RegistryAbi";
import { formatUnits } from "viem";
import { Button } from "@/components/ui/button";
import { WithdrawalConfirmation } from "../transactions/withdrawal-confirmation";

interface VaultBalanceCardProps {
  uen: string;
  name: string;
}

const VaultBalanceCard: React.FC<VaultBalanceCardProps> = ({ uen, name }) => {
  const [isWithdrawalConfirmationOpen, setIsWithdrawalConfirmationOpen] =
    useState(false);
  const [isWithdrawalDisabled, setIsWithdrawalDisabled] = useState(true);

  const { data: registryData } = useReadContract({
    abi: RegistryAbi,
    address: BASE_SEPOLIA_REGISTRY_ADDRESS,
    functionName: "getMerchantByUEN",
    args: [uen],
  });

  const { data: vaultData } = useReadContract({
    abi: VaultAbi,
    address: BASE_SEPOLIA_VAULT_ADDRESS,
    functionName: "balanceOf",
    args: [registryData?.wallet_address as `0x${string}`],
  });

  const formattedBalance = vaultData ? formatUnits(vaultData, 6) : "-";

  useEffect(() => {
    if (Number(vaultData) <= 0) {
      setIsWithdrawalDisabled(true);
    } else {
      setIsWithdrawalDisabled(false);
    }
  }, [vaultData]);

  console.log(isWithdrawalDisabled);

  const handleWithdrawalConfirmationOpen = () => {
    setIsWithdrawalConfirmationOpen(true);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          {name}&apos;s Vault
        </CardTitle>
        <Image src="/icons/usdc.svg" alt="USDC" width={24} height={24} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{formattedBalance} USDC</div>
        <p className="text-xs text-muted-foreground mt-2">
          Aave USDC Lending Market
        </p>
        <p className="text-xs text-muted-foreground italic">0.50% APY</p>
        <div className="mt-4">
          <Button
            className="bg-blue hover:bg-blue-100 text-white w-full sm:w-auto"
            onClick={handleWithdrawalConfirmationOpen}
            disabled={isWithdrawalDisabled}
          >
            Withdraw
          </Button>
        </div>
      </CardContent>
      <WithdrawalConfirmation
        amount={Number(formattedBalance)}
        isOpen={isWithdrawalConfirmationOpen}
        onOpenChange={setIsWithdrawalConfirmationOpen}
      />
    </Card>
  );
};

export default VaultBalanceCard;
