"use client";
import { connectorsForWallets } from "@rainbow-me/rainbowkit";
import {
  coinbaseWallet,
  metaMaskWallet,
  rainbowWallet,
  rabbyWallet,
} from "@rainbow-me/rainbowkit/wallets";
import { useMemo } from "react";
import { http, createConfig } from "wagmi";
import { baseSepolia, base } from "wagmi/chains";

export function useWagmiConfig() {
  const projectId = process.env.NEXT_PUBLIC_WC_PROJECT_ID;
  if (!projectId) {
    const providerErrMessage =
      "To connect to all Wallets you need to provide a WC_PROJECT_ID env variable";
    throw new Error(providerErrMessage);
  }

  return useMemo(() => {
    const connectors = connectorsForWallets(
      [
        {
          groupName: "Recommended Wallet",
          wallets: [coinbaseWallet],
        },
        {
          groupName: "Other Wallets",
          wallets: [rainbowWallet, metaMaskWallet, rabbyWallet],
        },
      ],
      {
        appName: "onchainkit",
        projectId,
      }
    );

    const wagmiConfig = createConfig({
      chains: [baseSepolia, base],
      // turn off injected provider discovery
      multiInjectedProviderDiscovery: false,
      connectors,
      ssr: true,
      transports: {
        [baseSepolia.id]: http(),
        [base.id]: http(),
      },
    });

    return wagmiConfig;
  }, [projectId]);
}
