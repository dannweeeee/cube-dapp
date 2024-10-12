"use client";

import React from "react";

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
import { Switch } from "../ui/switch";

const merchantRegistrationFormSchema = z.object({
  uen: z.string().min(4).max(50),
  merchantname: z.string().min(4).max(100),
  vault: z.boolean(),
});

type RegistrationFormValues = z.infer<typeof merchantRegistrationFormSchema>;

export function MerchantRegistrationForm() {
  const {
    register,
    handleSubmit,
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

  const onSubmit = async (data: RegistrationFormValues) => {
    if (address && user) {
      try {
        console.log("DATA", data);

        const response = await fetch("/api/create-merchant", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            uen: data.uen,
            merchant_name: data.merchantname,
            username: user.username,
            merchant_wallet_address: address,
            use_vault: data.vault,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          let errorMessage =
            "There was a problem with your request. Please try again.";

          if (
            errorData.error &&
            errorData.error.includes("duplicate key value")
          ) {
            if (errorData.error.includes("uen")) {
              errorMessage = "This UEN is already registered.";
            } else if (errorData.error.includes("username")) {
              errorMessage = "This username is already taken.";
            } else if (errorData.error.includes("merchant_wallet_address")) {
              errorMessage =
                "This wallet address is already registered as a merchant.";
            }
          }

          toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong ser.",
            description: errorMessage,
          });
          throw new Error(errorMessage);
        } else {
          console.log("Merchant registered successfully");
          toast({
            variant: "default",
            title: "Success!",
            description: "Merchant registered successfully.",
          });
          router.push("/");
        }
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
      <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200">
        Join Cube&apos;s Merchant Network
      </h2>
      <p className="text-neutral-600 text-sm max-w-sm mt-2 dark:text-neutral-300">
        Register your Merchant UEN with Cube on BASE (Sepolia). It&apos;s just
        that simple!
      </p>

      <form className="my-8" onSubmit={handleSubmit(onSubmit)}>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="uen">Merchant UEN</Label>
          <div className="relative">
            <Input
              id="uen"
              placeholder="00022100K"
              type="text"
              className="pr-20"
              {...register("uen")}
            />
          </div>
          {errors.uen && (
            <p className="text-red-500 text-sm mt-1">{errors.uen.message}</p>
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
