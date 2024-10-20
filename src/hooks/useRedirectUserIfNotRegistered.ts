import { useState, useEffect } from "react";
import { User } from "@/lib/types";
import { useRouter } from "next/navigation";
import { Address } from "viem";

export function useRedirectUserIfNotRegistered(
  address: Address | undefined,
  isConnected: boolean | undefined
) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchUsers() {
      if (!isConnected || !address) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch("/api/get-users-address");
        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }
        const data = await response.json();
        setUsers(data);
        setLoading(false);

        // Check if the user exists
        const userExists = data.some(
          (user: User) => user.wallet_address === address
        );
        if (!userExists) {
          router.push("/registration");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        setLoading(false);
      }
    }

    fetchUsers();
  }, [address, isConnected, router]);

  return { users, loading, error };
}
