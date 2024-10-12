import RegistryAbi from "@/abis/RegistryAbi";
import { BASE_SEPOLIA_REGISTRY_ADDRESS } from "@/lib/constants";

import { createPublicClient, createWalletClient, Address, http } from "viem";
import { baseSepolia } from "viem/chains";
import { privateKeyToAccount } from "viem/accounts";

export async function registerMerchant(
  uen: string,
  entityname: string,
  owner: string,
  address: Address
) {
  const publicClient = createPublicClient({
    chain: baseSepolia,
    transport: http(),
  });

  const walletClient = createWalletClient({
    chain: baseSepolia,
    transport: http(),
  });

  const { request } = await publicClient.simulateContract({
    address: BASE_SEPOLIA_REGISTRY_ADDRESS,
    abi: RegistryAbi,
    functionName: "addMerchantBrandNew",
    args: [uen, entityname, owner, address],
  });

  const account = privateKeyToAccount(
    `0x${process.env.NEXT_PUBLIC_PRIVATE_KEY}`
  );

  const hash = await walletClient.writeContract({
    ...request,
    account,
  });
  console.log("TRANSACTION HASH", hash);

  return hash;
}
