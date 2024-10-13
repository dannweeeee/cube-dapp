import { useState, useEffect } from "react";
import { Transaction } from "@/lib/types";

export function useFetchTransactionsByAddress(walletAddress: string | null) {
  const [transactions, setTransactions] = useState<Transaction | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTransactions() {
      if (!walletAddress) {
        setTransactions(null);
        setError(null);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `/api/get-transaction-by-address?user_wallet_address=${walletAddress}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch transactions");
        }
        const data = await response.json();
        setTransactions(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        setTransactions(null);
      } finally {
        setLoading(false);
      }
    }

    fetchTransactions();
  }, [walletAddress]);

  return { transactions, loading, error };
}
