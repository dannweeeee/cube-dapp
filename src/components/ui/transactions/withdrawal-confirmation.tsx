"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { useAccount } from "wagmi";
import { encodeFunctionData } from "viem";

import {
  BASE_SEPOLIA_CHAIN_ID,
  BASE_SEPOLIA_EXCHANGE_ADDRESS,
  BASE_SEPOLIA_USDC_ADDRESS,
  BASE_SEPOLIA_VAULT_ADDRESS,
} from "@/lib/constants";

import UsdcAbi from "@/abis/UsdcAbi";
import ExchangeAbi from "@/abis/ExchangeAbi";

import { toast } from "@/hooks/useToast";
import { useRouter } from "next/navigation";
import {
  Transaction,
  TransactionButton,
  TransactionError,
  TransactionResponse,
  TransactionStatus,
  TransactionStatusAction,
  TransactionStatusLabel,
} from "@coinbase/onchainkit/transaction";
import { useMemo, useState } from "react";

export function WithdrawalConfirmation({
  isOpen,
  onOpenChange,
  amount,
}: {
  amount: number;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const account = useAccount();
  const router = useRouter();
  const [isTransactionInProgress, setIsTransactionInProgress] = useState(false);
  const approvalAmount = useMemo(() => {
    if (typeof amount !== "number" || isNaN(amount)) {
      return BigInt(0);
    }
    return BigInt(Math.ceil(amount * 10 ** 6));
  }, [amount]);

  const approveAndWithdrawToMerchantCall = useMemo(() => {
    if (
      !BASE_SEPOLIA_USDC_ADDRESS ||
      !account.address ||
      approvalAmount === BigInt(0)
    )
      return [];
    return [
      {
        to: BASE_SEPOLIA_VAULT_ADDRESS as `0x${string}`,
        data: encodeFunctionData({
          abi: UsdcAbi,
          functionName: "approve",
          args: [BASE_SEPOLIA_EXCHANGE_ADDRESS, approvalAmount],
        }),
      },
      {
        to: BASE_SEPOLIA_EXCHANGE_ADDRESS as `0x${string}`,
        data: encodeFunctionData({
          abi: ExchangeAbi,
          functionName: "withdrawToWallet",
          args: [approvalAmount],
        }),
      },
    ];
  }, [approvalAmount, account.address]);

  const handleSuccess = async (transactionResponse: TransactionResponse) => {
    console.error("Withdrawal success:", transactionResponse);
    toast({
      variant: "default",
      title: "Withdrawal Successful",
      description: "Your funds have been withdrawn successfully.",
    });
    setIsTransactionInProgress(false);
    router.push("/");
  };

  const handleError = (error: TransactionError) => {
    console.error("Withdrawal error:", error);
    toast({
      variant: "destructive",
      title: "Withdrawal Failed",
      description:
        "There was an error processing your withdrawal. Please try again.",
    });
    setIsTransactionInProgress(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] w-[95vw] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">
            Confirm Withdrawal
          </DialogTitle>
          <DialogDescription className="text-sm sm:text-base">
            Please confirm the withdrawal details
          </DialogDescription>
          <DialogDescription className="text-sm sm:text-base">
            You are withdrawing <strong>{amount} USDC</strong> to your wallet
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex flex-col gap-2">
          <Transaction
            chainId={BASE_SEPOLIA_CHAIN_ID}
            calls={approveAndWithdrawToMerchantCall}
            onError={handleError}
            onSuccess={handleSuccess}
            capabilities={{
              paymasterService: {
                url: process.env
                  .NEXT_PUBLIC_CDP_PAYMASTER_AND_BUNDLER_ENDPOINT as string,
              },
            }}
          >
            <TransactionButton
              className="text-sm relative group/btn  text-[#FFFFFF] w-full rounded-xl h-12 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
              text="Withdraw"
              disabled={isTransactionInProgress}
            />
            <TransactionStatus>
              <TransactionStatusLabel />
              <TransactionStatusAction />
            </TransactionStatus>
          </Transaction>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
