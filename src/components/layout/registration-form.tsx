"use client";

import React from "react";
import axios from "axios";

import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

import { cn } from "@/lib/utils";

import { isBaseNameRegistered, registerBaseName } from "../scripts/basename";

import { useAccount } from "wagmi";
import { Address } from "viem";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/useToast";
import RegisterBasename from "../ui/transactions/register-basename";

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
    handleSubmit,
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
  const { address } = useAccount();

  const basename = watch("basename");

  const onSubmit = async (data: RegistrationFormValues) => {
    if (address && baseNameAvailable) {
      try {
        console.log("DATA", data);

        const hash = await registerBaseName(data.basename, address);

        if (hash) {
          console.log("TRANSACTION HASH", hash);
          try {
            const response = await axios.post("/api/create-user", {
              wallet_address: address,
              username: data.basename,
              email: data.email,
              first_name: data.firstname,
              last_name: data.lastname,
            });

            console.log("User registered successfully", response);
            toast({
              variant: "default",
              title: "Success!",
              description: "User registered successfully.",
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
                if (errorData.error.includes("wallet_address")) {
                  errorMessage = "This wallet address is already registered.";
                } else if (errorData.error.includes("username")) {
                  errorMessage = "This username is already taken.";
                } else if (errorData.error.includes("email")) {
                  errorMessage = "This email is already in use.";
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
        router.push("/");
      } catch (error) {
        console.error("Error registering base name:", error);
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

      <form className="my-8" onSubmit={handleSubmit(onSubmit)}>
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

        <Button
          className="relative group/btn bg-blue text-[#FFFFFF] hover:bg-blue-100 w-full rounded-xl h-12 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
          type="submit"
        >
          Register &rarr;
        </Button>
        <RegisterBasename baseName={basename} address={address as Address} />
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
