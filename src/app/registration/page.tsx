"use client";

import React from "react";
import { RegistrationForm } from "@/components/layout/registration-form";
import { useAccount } from "wagmi";
import { useRedirectUserIfRegistered } from "@/hooks/useRedirectUserIfRegistered";

const Registration = () => {
  const { address, isConnected } = useAccount();
  useRedirectUserIfRegistered(address, isConnected);

  return (
    <div className="flex items-center justify-center h-screen">
      <RegistrationForm />
    </div>
  );
};

export default Registration;
