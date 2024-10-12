import {
  encodeFunctionData,
  namehash,
  Address,
  createPublicClient,
  createWalletClient,
  http,
} from "viem";
import { baseSepolia, base } from "viem/chains";
import { privateKeyToAccount } from "viem/accounts";

import {
  BASE_SEPOLIA_L2_RESOLVER_ADDRESS,
  BASE_SEPOLIA_REGISTRAR_CONTROLLER_ADDRESS,
} from "@/lib/constants";
import L2ResolverAbi from "@/abis/L2ResolverAbi";
import RegistrarControllerAbi from "@/abis/RegistrarControllerAbi";

import { RegistrationArgs } from "@/lib/types";

import { Basename } from "@coinbase/onchainkit/identity";

// username domains
export const USERNAME_DOMAINS: Record<number, string> = {
  [baseSepolia.id]: "basetest.eth",
  [base.id]: "base.eth",
};

// format base eth domain name
export const formatBaseEthDomain = (
  name: string,
  chainId: number
): Basename => {
  return `${name}.${
    USERNAME_DOMAINS[chainId] ?? ".base.eth"
  }`.toLocaleLowerCase() as Basename;
};

// Check if the base name is already registered
export async function isBaseNameRegistered(baseName: string) {
  const publicClient = createPublicClient({
    chain: baseSepolia,
    transport: http(),
  });

  const isAvailable = await publicClient.readContract({
    address: BASE_SEPOLIA_REGISTRAR_CONTROLLER_ADDRESS,
    abi: RegistrarControllerAbi,
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
): RegistrationArgs {
  const addressData = encodeFunctionData({
    abi: L2ResolverAbi,
    functionName: "setAddr",
    args: [namehash(formatBaseEthDomain(baseName, baseSepolia.id)), addressId],
  });

  const nameData = encodeFunctionData({
    abi: L2ResolverAbi,
    functionName: "setName",
    args: [
      namehash(formatBaseEthDomain(baseName, baseSepolia.id)),
      formatBaseEthDomain(baseName, baseSepolia.id),
    ],
  });

  const registerArgs: RegistrationArgs = {
    name: baseName,
    owner: addressId,
    duration: BigInt(31557600),
    resolver: BASE_SEPOLIA_L2_RESOLVER_ADDRESS,
    data: [addressData, nameData],
    reverseRecord: true,
  };

  console.log(`Register contract method arguments constructed: `, registerArgs);

  return registerArgs;
}

// Estimate registration price
export async function estimateMintValue(
  baseName: string,
  duration: bigint
): Promise<bigint> {
  const publicClient = createPublicClient({
    chain: baseSepolia,
    transport: http(),
  });

  const price = await publicClient.readContract({
    address: BASE_SEPOLIA_REGISTRAR_CONTROLLER_ADDRESS,
    abi: RegistrarControllerAbi,
    functionName: "registerPrice",
    args: [baseName, duration],
  });

  console.log(`Estimated mint value for ${baseName}: `, price);

  return price;
}

// Register basename for user (TODO: paymaster logic for this feature)
export async function registerBaseName(baseName: string, address: Address) {
  const publicClient = createPublicClient({
    chain: baseSepolia,
    transport: http(),
  });

  const walletClient = createWalletClient({
    chain: baseSepolia,
    transport: http(),
  });

  const registrationArgs = createRegisterContractMethodArgs(baseName, address);

  const estimatedValue = await estimateMintValue(
    baseName,
    registrationArgs.duration
  );

  const { request } = await publicClient.simulateContract({
    address: BASE_SEPOLIA_REGISTRAR_CONTROLLER_ADDRESS,
    abi: RegistrarControllerAbi,
    functionName: "register",
    args: [
      {
        name: registrationArgs.name,
        owner: registrationArgs.owner,
        duration: registrationArgs.duration,
        resolver: registrationArgs.resolver,
        data: registrationArgs.data,
        reverseRecord: registrationArgs.reverseRecord,
      },
    ],
    value: estimatedValue,
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
