"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { useReadContract, useAccount } from "wagmi";
import { encodeFunctionData } from "viem";

import RegistryAbi from "@/abis/RegistryAbi";
import {
  BASE_SEPOLIA_CHAIN_ID,
  BASE_SEPOLIA_EXCHANGE_ADDRESS,
  BASE_SEPOLIA_REGISTRY_ADDRESS,
  BASE_SEPOLIA_USDC_ADDRESS,
} from "@/lib/constants";

import UsdcAbi from "@/abis/UsdcAbi";
import ExchangeAbi from "@/abis/ExchangeAbi";

import { toast } from "@/hooks/useToast";
import { useRouter } from "next/navigation";
import { formatUnits } from "viem";
import axios from "axios";
import {
  Transaction,
  TransactionButton,
  TransactionError,
  TransactionResponse,
  TransactionStatus,
  TransactionStatusAction,
  TransactionStatusLabel,
} from "@coinbase/onchainkit/transaction";
import { useMemo, useRef, useState } from "react";

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
  const account = useAccount();
  const router = useRouter();
  const [isTransactionInProgress, setIsTransactionInProgress] = useState(false);
  const hasPostedTransaction = useRef(false);
  const approvalAmount = BigInt(Math.ceil(amount * 0.77 * 10 ** 6));
  const formattedApprovalAmount = formatUnits(approvalAmount, 6);

  const { data } = useReadContract({
    abi: RegistryAbi,
    address: BASE_SEPOLIA_REGISTRY_ADDRESS,
    functionName: "getMerchantByUEN",
    args: [uen],
  });

  const approveAndTransferCall = useMemo(() => {
    if (!BASE_SEPOLIA_USDC_ADDRESS || !account.address || !approvalAmount)
      return [];
    return [
      {
        to: BASE_SEPOLIA_USDC_ADDRESS as `0x${string}`,
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
          functionName: "transferToMerchant",
          args: [uen, approvalAmount],
        }),
      },
    ];
  }, [approvalAmount, account.address, uen]);

  const handleSuccess = async (transactionResponse: TransactionResponse) => {
    if (isTransactionInProgress || hasPostedTransaction.current) return;
    setIsTransactionInProgress(true);

    try {
      const transactionHash =
        transactionResponse.transactionReceipts[0].transactionHash;
      console.log("Transaction Hash:", transactionHash);

      if (!hasPostedTransaction.current) {
        hasPostedTransaction.current = true;
        const response = await axios.post(
          "/api/create-transaction",
          {
            transaction_hash: transactionHash,
            merchant_uen: uen,
            user_wallet_address: account.address,
            amount: amount,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.status === 200) {
          console.log(
            "Transaction added to database successfully",
            response.data
          );
          toast({
            variant: "default",
            title: "Payment Successful",
            description: "Your payment has been processed successfully.",
          });
          onOpenChange(false);
          router.push("/");
        } else {
          throw new Error("Failed to add transaction to database");
        }
      }
    } catch (error) {
      console.error("Payment error:", error);
      toast({
        variant: "destructive",
        title: "Payment Failed",
        description:
          "There was an error processing your payment. Please try again.",
      });
    } finally {
      setIsTransactionInProgress(false);
    }
  };

  const handleError = (error: TransactionError) => {
    console.error("Payment error:", error);
    toast({
      variant: "destructive",
      title: "Payment Failed",
      description:
        "There was an error processing your payment. Please try again.",
    });
    setIsTransactionInProgress(false);
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
          <Transaction
            chainId={BASE_SEPOLIA_CHAIN_ID}
            calls={approveAndTransferCall}
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
              text="Pay"
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
