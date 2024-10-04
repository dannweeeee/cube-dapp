"use client";
import React from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { isBaseNameRegistered } from "../onchainkit/register-basename";

export function RegistrationForm() {
  const [baseName, setBaseName] = React.useState("");
  const [baseNameAvailable, setBaseNameAvailable] = React.useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Registration form submitted");
  };

  const checkBaseNameAvailability = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const name = e.target.value;
    try {
      const isAvailable = await isBaseNameRegistered(name);
      console.log(`Base name ${name} is available: `, isAvailable);
      setBaseNameAvailable(isAvailable);
      setBaseName(name);
    } catch (error) {
      console.error("Error checking base name availability:", error);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-4 md:p-8 rounded-none md:rounded-2xl shadow-input bg-transparent dark:bg-black">
      <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200">
        Welcome to Cube
      </h2>
      <p className="text-neutral-600 text-sm max-w-sm mt-2 dark:text-neutral-300">
        Create a Cube account on BASE to get started
      </p>

      <form className="my-8" onSubmit={handleSubmit}>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="basename">Base Name</Label>
          <div className="relative">
            <Input
              id="basename"
              placeholder="dann"
              type="text"
              className="pr-20"
              onChange={checkBaseNameAvailability}
            />
            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-xs sm:text-sm">
              {baseName
                ? baseNameAvailable
                  ? `🥳 ${baseName}.base.eth is available`
                  : `😭 ${baseName}.base.eth is taken`
                : ""}
            </span>
          </div>
        </LabelInputContainer>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="email">Email Address</Label>
          <Input id="email" placeholder="dann@gmail.com" type="email" />
        </LabelInputContainer>
        <div className="flex flex-col space-y-4 mb-4">
          <LabelInputContainer>
            <Label htmlFor="firstname">First Name</Label>
            <Input id="firstname" placeholder="Dann" type="text" />
          </LabelInputContainer>
          <LabelInputContainer>
            <Label htmlFor="lastname">Last Name</Label>
            <Input id="lastname" placeholder="Wee" type="text" />
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
