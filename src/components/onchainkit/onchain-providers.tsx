"use client";
import { OnchainKitProvider } from "@coinbase/onchainkit";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { baseSepolia } from "viem/chains";
import { WagmiProvider } from "wagmi";
import { useWagmiConfig } from "./wagmi";

type Props = { children: ReactNode };

const queryClient = new QueryClient();

function OnchainProviders({ children }: Props) {
  const CDP_ONCHAINKIT_API_KEY =
    process.env.CDP_ONCHAINKINEXT_PUBLIC_CDP_ONCHAINKIT_API_KEYT_API_KEY;
  const wagmiConfig = useWagmiConfig();

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <OnchainKitProvider apiKey={CDP_ONCHAINKIT_API_KEY} chain={baseSepolia}>
          <RainbowKitProvider modalSize="compact">
            {children}
          </RainbowKitProvider>
        </OnchainKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default OnchainProviders;
