import { useState, useEffect } from "react";
import { Merchant } from "@/lib/types";

export function useFetchAllMerchantsAddress() {
  const [merchants, setMerchants] = useState<Merchant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMerchants() {
      try {
        const response = await fetch("/api/get-merchants-address");
        if (!response.ok) {
          throw new Error("Failed to fetch merchants");
        }
        const data = await response.json();
        setMerchants(data);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        setLoading(false);
      }
    }

    fetchMerchants();
  }, []);

  return { merchants, loading, error };
}
