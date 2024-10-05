import { createPublicClient, createWalletClient, http } from "viem";
import { base, baseSepolia } from "viem/chains";

export const basePublicClient = createPublicClient({
  chain: base,
  transport: http(),
});

export const baseSepoliaPublicClient = createPublicClient({
  chain: baseSepolia,
  transport: http(),
});

export const baseWalletClient = createWalletClient({
  chain: base,
  transport: http(),
});

export const baseSepoliaWalletClient = createWalletClient({
  chain: baseSepolia,
  transport: http(),
});
