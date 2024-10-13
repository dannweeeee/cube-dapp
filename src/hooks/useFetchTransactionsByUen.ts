import { useState, useEffect } from "react";
import { Transaction } from "@/lib/types";

export function useFetchTransactionsByUen(uens: string[]) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTransactions() {
      if (!uens || uens.length === 0) {
        setTransactions([]);
        setError(null);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const allTransactions: Transaction[] = [];
        for (const uen of uens) {
          const response = await fetch(
            `/api/get-transaction-by-uen?merchant_uen=${uen}`
          );
          if (!response.ok) {
            if (response.status === 404) {
              console.log(`No transactions found for UEN: ${uen}`);
              continue;
            }
            throw new Error(`Failed to fetch transactions for UEN: ${uen}`);
          }
          const data = await response.json();
          allTransactions.push(...data);
        }
        setTransactions(allTransactions);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    }

    fetchTransactions();
  }, [uens]);

  return { transactions, loading, error };
}
