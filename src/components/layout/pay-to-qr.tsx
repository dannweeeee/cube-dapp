"use client";

import React, { useState } from "react";

import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

import { cn } from "@/lib/utils";

import { useAccount } from "wagmi";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/useToast";
import { useFetchUserByAddress } from "@/hooks/useFetchUserByAddress";

import QRScanner from "@/components/layout/qr-scanner";
import { ScanQrCode, Send } from "lucide-react";
import { PayConfirmation } from "../ui/payment/pay-confirmation";

const paymentFormSchema = z.object({
  uen: z.string().min(4).max(50),
  amount: z.number().min(0),
});

type PaymentFormValues = z.infer<typeof paymentFormSchema>;

export function PayToQRForm() {
  const [scanData, setScanData] = useState<boolean>(true);
  const [uen, setUen] = useState<string>("");
  const [amount, setAmount] = useState<number>(0);
  const [isPayConfirmationOpen, setIsPayConfirmationOpen] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentFormSchema),
    defaultValues: {
      uen: "",
      amount: undefined,
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

  const onSubmit = async (data: PaymentFormValues) => {
    if (address && user) {
      try {
        console.log("DATA", data);
        setUen(data.uen);
        setAmount(data.amount);
        setIsPayConfirmationOpen(true);
      } catch (error) {
        console.error("Error paying merchant:", error);
        toast({
          variant: "destructive",
          title: "Payment Error",
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
              Scan QR Code to Auto-Fill
            </h2>
            <p className="text-neutral-600 text-sm max-w-sm mx-auto mb-6 dark:text-neutral-300 italic">
              Align camera with QR code to pay in <strong>Singapore</strong>,{" "}
              <strong>China</strong>, <strong>Malaysia</strong>,
              <strong>Thailand</strong> and other{" "}
              <strong>SGQR-supported</strong> countries worldwide.
            </p>
          </div>
          <div className="flex flex-col items-center justify-center">
            <QRScanner onScan={handleScan} />
            <Button
              className="mt-5 relative group/btn bg-blue text-[#FFFFFF] hover:bg-blue-100 w-1/3 rounded-xl h-12 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
              onClick={() => {
                router.push("/");
              }}
            >
              Cancel
            </Button>
          </div>
        </>
      ) : (
        <>
          <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200">
            Payment Details
          </h2>
          <p className="text-neutral-600 text-sm max-w-sm mt-2 dark:text-neutral-300">
            Please check the details below and confirm the payment.
          </p>

          <form className="my-8" onSubmit={handleSubmit(onSubmit)}>
            <LabelInputContainer className="mb-4">
              <Label htmlFor="uen">Merchant UEN</Label>
              <div className="relative flex w-full">
                <Input
                  id="uen"
                  type="text"
                  placeholder="...merchant UEN"
                  {...register("uen")}
                  className="pr-36"
                  disabled={!scanData}
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
              <Label htmlFor="amount">Amount in SGD</Label>
              <Input
                id="amount"
                placeholder="Please enter the amount"
                type="text"
                inputMode="decimal"
                pattern="^\d*\.?\d{0,2}$"
                min="0"
                step="0.01"
                onKeyPress={(event: React.KeyboardEvent<HTMLInputElement>) => {
                  const target = event.target as HTMLInputElement;
                  if (
                    !/[0-9.]/.test(event.key) ||
                    (event.key === "." && target.value.includes(".")) ||
                    (target.value.includes(".") &&
                      target.value.split(".")[1].length >= 2)
                  ) {
                    event.preventDefault();
                  }
                }}
                style={{ WebkitAppearance: "none", MozAppearance: "textfield" }}
                {...register("amount", {
                  setValueAs: (v) => (v === "" ? undefined : parseFloat(v)),
                })}
              />
              {errors.amount && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.amount.message}
                </p>
              )}
            </LabelInputContainer>

            <Button
              className="relative group/btn bg-blue text-[#FFFFFF] hover:bg-blue-100 w-full rounded-xl h-12 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
              type="submit"
            >
              Confirm Payment
            </Button>
          </form>
        </>
      )}
      <PayConfirmation
        uen={uen}
        amount={amount}
        isOpen={isPayConfirmationOpen}
        onOpenChange={setIsPayConfirmationOpen}
      />
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
