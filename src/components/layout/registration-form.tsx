"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";

import { Label } from "../ui/label";
import { Input } from "../ui/input";

import { cn } from "@/lib/utils";

import {
  createRegisterContractMethodArgs,
  estimateMintValue,
  isBaseNameRegistered,
} from "../scripts/basename";

import { useAccount } from "wagmi";
import { encodeFunctionData } from "viem";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/useToast";
import {
  Transaction,
  TransactionButton,
  TransactionError,
  TransactionResponse,
  TransactionStatus,
  TransactionStatusAction,
  TransactionStatusLabel,
} from "@coinbase/onchainkit/transaction";
import {
  BASE_SEPOLIA_CHAIN_ID,
  BASE_SEPOLIA_REGISTRAR_CONTROLLER_ADDRESS,
} from "@/lib/constants";
import { RegistrationArgs } from "@/lib/types";
import RegistrarControllerAbi from "@/abis/RegistrarControllerAbi";

const registrationFormSchema = z.object({
  basename: z.string().min(4).max(20),
  email: z.string().email(),
  firstname: z.string().min(1).max(20),
  lastname: z.string().min(1).max(20),
});

type RegistrationFormValues = z.infer<typeof registrationFormSchema>;

export function RegistrationForm() {
  const {
    register,
    watch,
    formState: { errors },
  } = useForm<RegistrationFormValues>({
    resolver: zodResolver(registrationFormSchema),
    defaultValues: {
      basename: "",
      email: "",
      firstname: "",
      lastname: "",
    },
  });

  const [haveInput, setHaveInput] = React.useState(false);
  const [baseNameAvailable, setBaseNameAvailable] = React.useState(false);

  const router = useRouter();
  const { toast } = useToast();
  const account = useAccount();

  const formData = watch();

  const [registrationArgs, setRegistrationArgs] =
    useState<RegistrationArgs | null>(null);
  const [estimatedValue, setEstimatedValue] = useState<number | null>(null);

  const [isTransactionInProgress, setIsTransactionInProgress] = useState(false);
  const hasPostedTransaction = useRef(false);

  useEffect(() => {
    const fetchRegistrationData = async () => {
      if (formData.basename && account.address) {
        const args = createRegisterContractMethodArgs(
          formData.basename,
          account.address
        );
        const value = await estimateMintValue(formData.basename, args.duration);
        setRegistrationArgs(args);
        setEstimatedValue(Number(value));
      }
    };

    fetchRegistrationData();
  }, [formData.basename, account.address]);

  const registerBasenameCall = useMemo(() => {
    if (
      !BASE_SEPOLIA_REGISTRAR_CONTROLLER_ADDRESS ||
      !account.address ||
      !registrationArgs ||
      estimatedValue === null
    )
      return [];
    return [
      {
        to: BASE_SEPOLIA_REGISTRAR_CONTROLLER_ADDRESS as `0x${string}`,
        data: encodeFunctionData({
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
        }),
        value: BigInt(estimatedValue),
      },
    ];
  }, [registrationArgs, account.address, estimatedValue]);

  console.log("registerBasenameCall", registerBasenameCall);

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
          "/api/create-user",
          {
            wallet_address: account.address,
            username: formData.basename,
            email: formData.email,
            first_name: formData.firstname,
            last_name: formData.lastname,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.status === 200) {
          console.log("User added to database successfully", response.data);
          toast({
            variant: "default",
            title: "Your account has been created successfully!",
            description: "Welcome to Cube!",
          });
          router.push("/");
        } else {
          throw new Error("Failed to add user to database");
        }
      }
    } catch (error) {
      console.error("User registration error:", error);
      toast({
        variant: "destructive",
        title: "User Registration Failed",
        description:
          "There was an error creating your account. Please try again.",
      });
    } finally {
      setIsTransactionInProgress(false);
    }
  };

  const handleError = (error: TransactionError) => {
    console.error("Transaction Error:", error);
    toast({
      variant: "destructive",
      title: "Transaction Error",
      description: error.message,
    });
  };

  const checkBaseNameAvailability = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const name = e.target.value;
    try {
      const isAvailable = await isBaseNameRegistered(name);
      console.log(`Base name ${name} is available: `, isAvailable);
      setBaseNameAvailable(isAvailable);
    } catch (error) {
      console.error("Error checking base name availability:", error);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto mt-20 p-4 md:p-8 rounded-none md:rounded-2xl shadow-input bg-transparent dark:bg-black">
      <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200">
        Welcome to Cube
      </h2>
      <p className="text-neutral-600 text-sm max-w-sm mt-2 dark:text-neutral-300">
        Create a Cube account on BASE (Sepolia) to get started.
      </p>

      <form className="my-8">
        <LabelInputContainer className="mb-4">
          <Label htmlFor="basename">
            Username - <i>this will be your basename</i>
          </Label>
          <div className="relative">
            <Input
              id="basename"
              placeholder="dann"
              type="text"
              className="pr-20"
              {...register("basename")}
              onChange={(e) => {
                const lowercaseValue = e.target.value.toLowerCase();
                e.target.value = lowercaseValue;
                register("basename").onChange(e);
                setHaveInput(true);
                checkBaseNameAvailability(e);
              }}
              onKeyPress={(e) => {
                const char = String.fromCharCode(e.which);
                if (!/[a-z]/.test(char)) {
                  e.preventDefault();
                }
              }}
            />
            {haveInput && (
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-xs sm:text-sm">
                {errors.basename?.message ||
                  (baseNameAvailable ? `✅ available` : `❌ taken`)}
              </span>
            )}
          </div>
        </LabelInputContainer>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            placeholder="dann@gmail.com"
            type="email"
            {...register("email")}
          />
          {errors.email && (
            <span className="text-red-500 text-sm">{errors.email.message}</span>
          )}
        </LabelInputContainer>
        <div className="flex flex-col space-y-4 mb-4">
          <LabelInputContainer>
            <Label htmlFor="firstname">First Name</Label>
            <Input
              id="firstname"
              placeholder="Dann"
              type="text"
              {...register("firstname")}
            />
            {errors.firstname && (
              <span className="text-red-500 text-sm">
                {errors.firstname.message}
              </span>
            )}
          </LabelInputContainer>
          <LabelInputContainer>
            <Label htmlFor="lastname">Last Name</Label>
            <Input
              id="lastname"
              placeholder="Wee"
              type="text"
              {...register("lastname")}
            />
            {errors.lastname && (
              <span className="text-red-500 text-sm">
                {errors.lastname.message}
              </span>
            )}
          </LabelInputContainer>
        </div>
        <Transaction
          chainId={BASE_SEPOLIA_CHAIN_ID}
          calls={registerBasenameCall}
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
            text="Register"
            disabled={isTransactionInProgress}
          />
          <TransactionStatus>
            <TransactionStatusLabel />
            <TransactionStatusAction />
          </TransactionStatus>
        </Transaction>
      </form>
    </div>
  );
}

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex flex-col space-y-2 w-full", className)}>
      {children}
    </div>
  );
};
