"use client";

import Hero from "@/components/layout/hero";
import Profile from "@/components/layout/profile";
import { useFetchAllUsersAddress } from "@/hooks/useFetchAllUsersAddress";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAccount } from "wagmi";

export default function Home() {
  const { address, isConnected } = useAccount();
  const { users, loading } = useFetchAllUsersAddress();
  const router = useRouter();

  useEffect(() => {
    if (isConnected && address && !loading) {
      const userExists = users.some((user) => user.wallet_address === address);
      if (!userExists) {
        router.push("/registration");
      }
    }
  }, [isConnected, address, users, loading, router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      {isConnected ? <Profile /> : <Hero />}
    </div>
  );
}
