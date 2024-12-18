import { useFetchTransactionsByAddress } from "@/hooks/useFetchTransactionsByAddress";
import { useAccount } from "wagmi";
import { formatDistanceToNow } from "date-fns";
import { Loader2, ExternalLink } from "lucide-react";
import { Transaction } from "@/lib/types";

export function UserTransactions() {
  const { address } = useAccount();
  const { transactions, loading, error } = useFetchTransactionsByAddress(
    address ?? null
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (
    !transactions ||
    !Array.isArray(transactions) ||
    transactions.length === 0 ||
    error
  ) {
    return (
      <div className="text-gray-500 text-center p-4">
        No transactions found.
      </div>
    );
  }

  const sortedTransactions = [...transactions].sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  return (
    <div className="space-y-4">
      {sortedTransactions.map((transaction: Transaction, index: number) => (
        <div key={index} className="bg-white shadow rounded-lg p-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-gray-900">
                To: {transaction.merchant_uen}
              </p>
              <p className="text-xs text-gray-500">
                {formatDistanceToNow(new Date(transaction.created_at), {
                  addSuffix: true,
                })}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-green-600">
                ${Number(transaction.amount).toFixed(2)} SGD
              </p>
            </div>
          </div>
          <div className="mt-2 flex items-center text-xs text-gray-500">
            <a
              href={`https://sepolia.basescan.org/tx/${transaction.transaction_hash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center hover:text-blue-500 transition-colors"
            >
              View on BaseScan
              <ExternalLink className="h-3 w-3 ml-1" />
            </a>
          </div>
        </div>
      ))}
    </div>
  );
}
