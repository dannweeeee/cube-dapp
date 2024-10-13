import { useState, useEffect } from "react";
import { Address, formatEther } from "viem";
import { publicClient } from "@/components/onchainkit/clients";

export function useUserEthBalance(address: Address) {
  const [balance, setBalance] = useState<string>("0");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchBalance = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const result = await publicClient.getBalance({
          address: address,
        });
        setBalance(formatEther(result));
      } catch (error) {
        console.error("Error fetching balance:", error);
        setError(
          error instanceof Error
            ? error
            : new Error("An error occurred while fetching the balance")
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchBalance();
  }, [address]);

  return { balance, isLoading, error };
}
