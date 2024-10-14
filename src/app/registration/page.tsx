"use client";

import React from "react";
import { RegistrationForm } from "@/components/layout/registration-form";
import { useAccount } from "wagmi";
import { useFetchAllUsersAddress } from "@/hooks/useFetchAllUsersAddress";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const Registration = () => {
  const { address, isConnected } = useAccount();
  const { users, loading } = useFetchAllUsersAddress();
  const router = useRouter();

  useEffect(() => {
    if (isConnected && address && !loading) {
      const userExists = users.some((user) => user.wallet_address === address);
      if (userExists) {
        router.push("/");
      }
    }
  }, [isConnected, address, users, loading, router]);

  return (
    <div className="flex items-center justify-center h-screen">
      <RegistrationForm />
    </div>
  );
};

export default Registration;
