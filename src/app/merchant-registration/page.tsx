"use client";

import { MerchantRegistrationForm } from "@/components/layout/merchant-form";
import { useRedirectUserIfNotRegistered } from "@/hooks/useRedirectUserIfNotRegistered";
import React from "react";
import { useAccount } from "wagmi";
const MerchantRegistration = () => {
  const { address, isConnected } = useAccount();
  useRedirectUserIfNotRegistered(address, isConnected);

  return (
    <div className="flex items-center justify-center h-screen">
      <MerchantRegistrationForm />
    </div>
  );
};

export default MerchantRegistration;
