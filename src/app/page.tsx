"use client";

import Hero from "@/components/layout/hero";
import Profile from "@/components/layout/profile";
import { useRedirectUserIfNotRegistered } from "@/hooks/useRedirectUserIfNotRegistered";
import { useAccount } from "wagmi";

export default function Home() {
  const { address, isConnected } = useAccount();
  useRedirectUserIfNotRegistered(address, isConnected);

  return (
    <div className="flex items-center justify-center min-h-screen">
      {isConnected ? <Profile /> : <Hero />}
    </div>
  );
}
