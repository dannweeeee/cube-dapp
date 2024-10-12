import { useState, useEffect } from "react";
import { User } from "@/lib/types";

export function useFetchUserByAddress(walletAddress: string | null) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUser() {
      if (!walletAddress) {
        setUser(null);
        setError(null);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `/api/get-user-by-address?address=${walletAddress}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch user");
        }
        const data = await response.json();
        setUser(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, [walletAddress]);

  return { user, loading, error };
}
