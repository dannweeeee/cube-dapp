import { encodeFunctionData, namehash, Address } from "viem";
import { normalize } from "viem/ens";
import {
  BASE_SEPOLIA_L2_RESOLVER_ADDRESS,
  BASE_SEPOLIA_REGISTRAR_CONTROLLER_ADDRESS,
} from "@/lib/constants";
import L2ResolverAbi from "@/abis/L2ResolverAbi";
import RegistrarControllerAbi from "@/abis/RegistrarControllerAbi";
import { baseSepoliaPublicClient, baseSepoliaWalletClient } from "@/lib/config";
import { RegistrationArgs } from "@/lib/types";
import { privateKeyToAccount } from "viem/accounts";

// Check if the base name is already registered
export async function isBaseNameRegistered(baseName: string) {
  const isAvailable = await baseSepoliaPublicClient.readContract({
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
    args: [namehash(normalize(baseName)), addressId],
  });
  const nameData = encodeFunctionData({
    abi: L2ResolverAbi,
    functionName: "setName",
    args: [namehash(normalize(baseName)), baseName],
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

// Handle registering a base name
export async function registerBaseName(baseName: string, address: Address) {
  const registrationArgs = createRegisterContractMethodArgs(baseName, address);

  const { request } = await baseSepoliaPublicClient.simulateContract({
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
    value: BigInt(200000000000000000), // 0.002 ETH in wei
  });

  const account = privateKeyToAccount(address);

  const hash = await baseSepoliaWalletClient.writeContract({
    ...request,
    account,
    value: BigInt(200000000000000000), // 0.002 ETH in wei
  });

  console.log("TRANSACTION HASH", hash);
}
