"use client";
import {
  Transaction,
  TransactionButton,
  TransactionStatus,
  TransactionStatusAction,
  TransactionStatusLabel,
} from "@coinbase/onchainkit/transaction";
import type {
  TransactionError,
  TransactionResponse,
} from "@coinbase/onchainkit/transaction";
import type { Address, ContractFunctionParameters } from "viem";
import {
  BASE_SEPOLIA_CHAIN_ID,
  BASE_SEPOLIA_REGISTRAR_CONTROLLER_ADDRESS,
} from "@/lib/constants";
import RegistrarControllerAbi from "@/abis/RegistrarControllerAbi";
import { useEffect, useState } from "react";
import {
  createRegisterContractMethodArgs,
  estimateMintValue,
} from "@/components/scripts/basename";
import { RegistrationArgs } from "@/lib/types";

export default function RegisterBasename({
  baseName,
  address,
}: {
  baseName: string;
  address: Address;
}) {
  const [estimatedValue, setEstimatedValue] = useState<bigint | null>(null);
  const [registrationArgs, setRegistrationArgs] =
    useState<RegistrationArgs | null>(null);

  useEffect(() => {
    if (baseName && address) {
      const args = createRegisterContractMethodArgs(baseName, address);
      setRegistrationArgs(args);

      const fetchEstimatedValue = async () => {
        const value = await estimateMintValue(baseName, args.duration);
        setEstimatedValue(value);
      };

      fetchEstimatedValue();
    }
  }, [baseName, address]);

  if (!address || !registrationArgs) {
    console.error("Address is undefined or registration args not ready");
    return null;
  }

  const contracts = [
    {
      address: BASE_SEPOLIA_REGISTRAR_CONTROLLER_ADDRESS,
      abi: RegistrarControllerAbi,
      functionName: "register",
      args: [
        {
          name: registrationArgs.name,
          owner: registrationArgs.owner,
          duration: registrationArgs.duration,
          resolver: registrationArgs.resolver,
          data: registrationArgs.data,
          reverseRecord: registrationArgs.reverseRecord,
        },
      ],
      value: estimatedValue,
    },
  ] as unknown as ContractFunctionParameters[];

  const handleError = (err: TransactionError) => {
    console.error("Transaction error:", err);
  };

  const handleSuccess = (response: TransactionResponse) => {
    console.log("Transaction successful", response);
  };

  return (
    <div className="flex w-[450px]">
      <Transaction
        contracts={contracts}
        className="w-[450px]"
        chainId={BASE_SEPOLIA_CHAIN_ID}
        onError={handleError}
        onSuccess={handleSuccess}
        capabilities={{
          paymasterService: {
            url: process.env
              .NEXT_PUBLIC_CDP_PAYMASTER_AND_BUNDLER_ENDPOINT as string,
          },
        }}
      >
        <TransactionButton className="mt-0 mr-auto ml-auto w-[450px] max-w-full text-[white]" />
        <TransactionStatus>
          <TransactionStatusLabel />
          <TransactionStatusAction />
        </TransactionStatus>
      </Transaction>
    </div>
  );
}
