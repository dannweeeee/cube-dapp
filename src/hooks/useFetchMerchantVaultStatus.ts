import { useState, useEffect } from "react";
import { Merchant } from "@/lib/types";

export function useFetchMerchantVaultStatus(merchantUEN: string) {
  const [merchantVaultStatus, setMerchantVaultStatus] = useState<
    boolean | null
  >(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMerchantVaultStatus() {
      if (!merchantUEN) {
        setMerchantVaultStatus(null);
        setError(null);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `/api/get-merchant-by-uen?uen=${merchantUEN}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch merchant");
        }
        const data: Merchant = await response.json();
        console.log("Merchant data:", data);
        setMerchantVaultStatus(data.is_vault_enabled);
      } catch (error) {
        setError(error instanceof Error ? error.message : "An error occurred");
        setMerchantVaultStatus(null);
      } finally {
        setLoading(false);
      }
    }

    fetchMerchantVaultStatus();
  }, [merchantUEN]);

  return { merchantVaultStatus, loading, error };
}
