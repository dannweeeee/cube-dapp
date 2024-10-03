"use client";

import Hero from "@/components/layout/hero";
import Profile from "@/components/layout/profile";
import { useAccount } from "wagmi";

export default function Home() {
  const { isConnected } = useAccount();
  return <div>{isConnected ? <Profile /> : <Hero />}</div>;
}
