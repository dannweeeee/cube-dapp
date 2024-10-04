import { Coinbase, Wallet } from "@coinbase/coinbase-sdk";
import { encodeFunctionData, namehash, Address } from "viem";
import { normalize } from "viem/ens";
import {
  BASE_SEPOLIA_L2_RESOLVER_ADDRESS,
  BASE_SEPOLIA_REGISTRAR_CONTROLLER_ADDRESS,
} from "@/lib/constants";
import L2ResolverAbi from "@/abis/L2ResolverAbi";
import RegistrarAbi from "@/abis/RegistrarAbi";
import { createPublicClient, http } from "viem";
import { baseSepolia } from "viem/chains";

// Check if the base name is already registered
export async function isBaseNameRegistered(baseName: string) {
  const baseSepoliaClient = createPublicClient({
    chain: baseSepolia,
    transport: http(),
  });

  const isAvailable = await baseSepoliaClient.readContract({
    address: BASE_SEPOLIA_REGISTRAR_CONTROLLER_ADDRESS,
    abi: RegistrarAbi,
    functionName: "available",
    args: [baseName],
  });

  console.log(`Base name ${baseName} is available: `, isAvailable);

  return isAvailable;
}

// Create register contract method arguments
export function createRegisterContractMethodArgs(
  baseName: string,
  addressId: Address
) {
  const addressData = encodeFunctionData({
    abi: L2ResolverAbi,
    functionName: "setAddr",
    args: [namehash(normalize(baseName)), addressId],
  });
  const nameData = encodeFunctionData({
    abi: L2ResolverAbi,
    functionName: "setName",
    args: [namehash(normalize(baseName)), baseName],
  });

  const registerArgs = {
    request: [
      baseName.replace(/\.base\.eth$/, ""),
      addressId,
      "31557600",
      BASE_SEPOLIA_L2_RESOLVER_ADDRESS,
      [addressData, nameData],
      true,
    ],
  };

  console.log(`Register contract method arguments constructed: `, registerArgs);

  return registerArgs;
}

// Handle registering a base name
export async function registerBaseName(
  wallet: Wallet,
  registerArgs: { request: (string | boolean | `0x${string}`[])[] }
) {
  try {
    const contractInvocation = await wallet.invokeContract({
      contractAddress: BASE_SEPOLIA_L2_RESOLVER_ADDRESS,
      method: "register",
      abi: RegistrarAbi,
      args: registerArgs,
      amount: 0.002,
      assetId: Coinbase.assets.Eth,
    });

    await contractInvocation.wait();

    console.log(
      `Successfully registered Basename ${registerArgs.request[0]} for wallet: `,
      wallet
    );
  } catch (error) {
    console.error(`Error registering a Basename for ${wallet}: `, error);
  }
}
