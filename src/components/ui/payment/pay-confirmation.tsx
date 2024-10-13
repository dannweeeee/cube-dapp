"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { useReadContract, useAccount } from "wagmi";
import { writeContract, waitForTransactionReceipt } from "wagmi/actions";

import { baseSepolia } from "viem/chains";

import RegistryAbi from "@/abis/RegistryAbi";
import {
  BASE_SEPOLIA_EXCHANGE_ADDRESS,
  BASE_SEPOLIA_REGISTRY_ADDRESS,
  BASE_SEPOLIA_USDC_ADDRESS,
} from "@/lib/constants";

import UsdcAbi from "@/abis/UsdcAbi";
import ExchangeAbi from "@/abis/ExchangeAbi";

import { useWagmiConfig } from "@/components/onchainkit/wagmi";
import { toast } from "@/hooks/useToast";
import { useRouter } from "next/navigation";
import { formatUnits } from "viem";
import { Send } from "lucide-react";
import axios from "axios";

export function PayConfirmation({
  uen,
  isOpen,
  onOpenChange,
  amount,
}: {
  uen: string;
  amount: number;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const wagmiConfig = useWagmiConfig();
  const account = useAccount();
  const router = useRouter();
  console.log(account.isConnected);
  console.log(wagmiConfig.connectors);

  const approvalAmount = BigInt(Math.ceil(amount * 0.77 * 10 ** 6));
  const formattedApprovalAmount = formatUnits(approvalAmount, 6);

  const { data } = useReadContract({
    abi: RegistryAbi,
    address: BASE_SEPOLIA_REGISTRY_ADDRESS,
    functionName: "getMerchantByUEN",
    args: [uen],
  });

  const approveAndTransfer = async () => {
    if (!account.isConnected) {
      toast({
        variant: "destructive",
        title: "Wallet not connected",
        description: "Please connect your wallet to proceed with the payment.",
      });
      return;
    }

    try {
      const approveHash = await writeContract(wagmiConfig, {
        account: account.address,
        address: BASE_SEPOLIA_USDC_ADDRESS,
        abi: UsdcAbi,
        functionName: "approve",
        args: [BASE_SEPOLIA_EXCHANGE_ADDRESS, approvalAmount],
        chainId: baseSepolia.id,
      });
      await waitForTransactionReceipt(wagmiConfig, { hash: approveHash });
      const transferHash = await writeContract(wagmiConfig, {
        address: BASE_SEPOLIA_EXCHANGE_ADDRESS,
        abi: ExchangeAbi,
        functionName: "transferToMerchant",
        args: [uen, approvalAmount],
        chainId: baseSepolia.id,
      });
      await waitForTransactionReceipt(wagmiConfig, { hash: transferHash });

      const response = await axios.post("/api/create-transaction", {
        transaction_hash: transferHash,
        merchant_uen: uen,
        user_wallet_address: account.address,
        amount: amount,
      });

      console.log("Transaction added to database successfully", response);

      toast({
        variant: "default",
        title: "Payment Successful",
        description: "Your payment has been processed successfully.",
      });
      onOpenChange(false);
      router.push("/");
    } catch (error) {
      console.error("Payment error:", error);
      toast({
        variant: "destructive",
        title: "Payment Failed",
        description:
          "There was an error processing your payment. Please try again.",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] w-[95vw] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">
            Confirm Payment
          </DialogTitle>
          <DialogDescription className="text-sm sm:text-base">
            Please confirm the payment details
          </DialogDescription>
          <DialogDescription className="text-sm sm:text-base">
            Merchant: <strong>{data?.entity_name}</strong>
          </DialogDescription>
          <DialogDescription className="text-sm sm:text-base">
            UEN: <strong>{uen}</strong>
          </DialogDescription>
          <DialogDescription className="text-sm sm:text-base">
            You are paying{" "}
            <strong>
              {amount} SGD ≈ {formattedApprovalAmount} USDC
            </strong>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex flex-col gap-2">
          <Button
            onClick={approveAndTransfer}
            className="w-full bg-blue text-[#FFFFFF] hover:bg-blue-100 rounded-xl h-auto font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
          >
            Pay Now <Send className="w-4 h-4 ml-1" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
