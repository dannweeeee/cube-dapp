import { useState, useEffect } from "react";
import { Address } from "viem";

export function useCheckMerchantIfRegistered(address: Address | undefined) {
  const [isRegistered, setIsRegistered] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function checkMerchantRegistration() {
      if (!address) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch("/api/get-merchants-address");
        if (!response.ok) {
          throw new Error("Failed to fetch merchants");
        }
        const merchants = await response.json();
        const merchantExists = merchants.some(
          (merchant: { merchant_wallet_address: string }) =>
            merchant.merchant_wallet_address.toLowerCase() ===
            address.toLowerCase()
        );
        setIsRegistered(merchantExists);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        setLoading(false);
      }
    }

    checkMerchantRegistration();
  }, [address]);

  return { isRegistered, loading, error };
}
