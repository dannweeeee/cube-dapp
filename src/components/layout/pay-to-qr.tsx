"use client";

import React, { useState } from "react";
import axios from "axios";

import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Switch } from "../ui/switch";

import { cn } from "@/lib/utils";

import { useAccount } from "wagmi";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/useToast";
import { useFetchUserByAddress } from "@/hooks/useFetchUserByAddress";
import { registerMerchant } from "../scripts/registry";

import QRScanner from "@/components/layout/qr-scanner";
import { ScanQrCode } from "lucide-react";

const merchantRegistrationFormSchema = z.object({
  uen: z.string().min(4).max(50),
  merchantname: z.string().min(4).max(100),
  vault: z.boolean(),
});

type RegistrationFormValues = z.infer<typeof merchantRegistrationFormSchema>;

export function PayToQRForm() {
  const [scanData, setScanData] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<RegistrationFormValues>({
    resolver: zodResolver(merchantRegistrationFormSchema),
    defaultValues: {
      uen: "",
      merchantname: "",
      vault: false,
    },
  });

  const router = useRouter();
  const { toast } = useToast();
  const { address } = useAccount();

  const { user } = useFetchUserByAddress(address || null);

  const handleScan = (data: string) => {
    function isLetter(char: string) {
      return char.length === 1 && char.match(/[a-z]/i);
    }

    if (data) {
      console.log("Scanned QR code:", data);

      // Pattern for PromptPay QR codes
      const promptPayPattern =
        /^00020101021130\d{2}0016A00000067701011201(\d{13}|\d{15}).*?5802TH/;

      // Pattern for PayNow QR codes
      const paynowPattern = /PAYNOW01012021[023]([A-Za-z0-9]{10})/;

      // Pattern for NETS QR codes
      const netsPattern = /SG\.COM\.NETS0123([0-9]{9}[A-Z])/;

      const promptPayMatch = data.match(promptPayPattern);
      const paynowMatch = data.match(paynowPattern);
      const netsMatch = data.match(netsPattern);

      let uenValue = "";

      if (promptPayMatch) {
        uenValue = promptPayMatch[1];
        console.log("Parsed QR Data (PromptPay):", uenValue);
      } else if (paynowMatch) {
        // PayNow QR code logic
        const eighthChar = paynowMatch[1][paynowMatch[1].length - 2];

        if (isLetter(eighthChar)) {
          uenValue = paynowMatch[1].slice(0, -1);
          console.log("Parsed QR Data (PayNow 9-character UEN):", uenValue);
        } else {
          uenValue = paynowMatch[1];
          console.log("Parsed QR Data (PayNow 10-character UEN):", uenValue);
        }
      } else if (netsMatch) {
        // NETS QR code logic
        uenValue = netsMatch[1];
        console.log("Parsed QR Data (NETS UEN):", uenValue);
      } else {
        // If no match found, try to find any 9-digit number followed by a letter
        const genericUenPattern = /([0-9]{9}[A-Z])/;
        const genericMatch = data.match(genericUenPattern);

        if (genericMatch) {
          uenValue = genericMatch[1];
          console.log("Parsed QR Data (Generic UEN):", uenValue);
        } else {
          console.log("Unrecognized QR format. Full QR Data:", data);
          uenValue = data;
        }
      }

      setValue("uen", uenValue);
      setScanData(false);
    }
  };

  const onSubmit = async (data: RegistrationFormValues) => {
    if (address && user) {
      try {
        console.log("DATA", data);

        const hash = await registerMerchant(
          data.uen,
          data.merchantname,
          user.username,
          address
        );

        if (hash) {
          console.log("TRANSACTION HASH", hash);
          try {
            const response = await axios.post("/api/create-merchant", {
              uen: data.uen,
              merchant_name: data.merchantname,
              username: user.username,
              merchant_wallet_address: address,
              use_vault: data.vault,
            });

            console.log("Merchant registered successfully", response);
            toast({
              variant: "default",
              title: "Success!",
              description: "Merchant registered successfully.",
            });
          } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
              const errorData = error.response.data;
              let errorMessage =
                "There was a problem with your request. Please try again.";

              if (
                errorData.error &&
                errorData.error.includes("duplicate key value")
              ) {
                if (errorData.error.includes("uen")) {
                  errorMessage = "This UEN is already registered.";
                }
              }

              toast({
                variant: "destructive",
                title: "Uh oh! Something went wrong ser.",
                description: errorMessage,
              });
              throw new Error(errorMessage);
            }
          }
        }
        router.push("/merchant");
      } catch (error) {
        console.error("Error registering merchant:", error);
        toast({
          variant: "destructive",
          title: "Registration Error",
          description:
            error instanceof Error
              ? error.message
              : "An unexpected error occurred.",
        });
      }
    } else {
      toast({
        variant: "destructive",
        title: "Registration Error",
        description: "User information or wallet address is missing.",
      });
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-4 md:p-8 rounded-none md:rounded-2xl shadow-input bg-transparent dark:bg-black">
      {scanData ? (
        <>
          <div className="text-center">
            <h2 className="font-bold text-2xl text-neutral-800 dark:text-neutral-200 mb-4 bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text">
              Scan QR Code
            </h2>
            <p className="text-neutral-600 text-sm max-w-sm mx-auto mb-6 dark:text-neutral-300 italic">
              Align camera with QR code to pay in <strong>Singapore</strong>,{" "}
              <strong>China</strong>, <strong>Malaysia</strong>,
              <strong>Thailand</strong> and other{" "}
              <strong>SGQR-supported</strong> countries worldwide.
            </p>
          </div>
          <div className="flex justify-center">
            <QRScanner onScan={handleScan} />
          </div>
        </>
      ) : (
        <>
          <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200">
            Join Cube&apos;s Merchant Network
          </h2>
          <p className="text-neutral-600 text-sm max-w-sm mt-2 dark:text-neutral-300">
            Register your Merchant UEN with Cube on BASE (Sepolia).
          </p>

          <form className="my-8" onSubmit={handleSubmit(onSubmit)}>
            <LabelInputContainer className="mb-4">
              <Label htmlFor="uen">Merchant UEN</Label>
              <div className="relative flex w-full">
                <Input
                  id="uen"
                  placeholder="00022100K"
                  type="text"
                  {...register("uen")}
                  className="pr-40"
                />
                <div className="absolute inset-y-0 right-0 flex items-center">
                  <Button
                    className="relative group/btn bg-blue text-[#FFFFFF] hover:bg-blue-100 w-auto rounded-xl h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
                    onClick={() => {
                      setScanData(true);
                    }}
                  >
                    <ScanQrCode className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              {errors.uen && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.uen.message}
                </p>
              )}
            </LabelInputContainer>
            <LabelInputContainer className="mb-4">
              <Label htmlFor="merchantname">Merchant Name</Label>
              <Input
                id="merchantname"
                placeholder="333 Carrot Cake"
                type="text"
                {...register("merchantname")}
              />
              {errors.merchantname && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.merchantname.message}
                </p>
              )}
            </LabelInputContainer>
            <div className="flex flex-col space-y-4 mb-4">
              <LabelInputContainer>
                <Label htmlFor="vault">
                  Would you like to use Cube vault feature?
                </Label>
                <Switch id="vault" {...register("vault")} className="" />
              </LabelInputContainer>
            </div>

            <Button
              className="relative group/btn bg-blue text-[#FFFFFF] hover:bg-blue-100 w-full rounded-xl h-12 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
              type="submit"
            >
              Register &rarr;
            </Button>
          </form>
        </>
      )}
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
