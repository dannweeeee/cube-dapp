"use client";

import Hero from "@/components/layout/hero";
import Profile from "@/components/layout/profile";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAccount } from "wagmi";

export default function Home() {
  const { isConnected } = useAccount();
  const router = useRouter();

  return (
    <div className="flex items-center justify-center h-screen">
      {isConnected ? <Profile /> : <Hero />}
    </div>
  );
}
