import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { useReadContract } from "wagmi";
import RegistryAbi from "@/abis/RegistryAbi";
import { BASE_SEPOLIA_REGISTRY_ADDRESS } from "@/lib/constants";

export function PayConfirmation({
  uen,
  isOpen,
  onOpenChange,
  amount,
}: {
  uen: string;
  amount: number;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { data } = useReadContract({
    abi: RegistryAbi,
    address: BASE_SEPOLIA_REGISTRY_ADDRESS,
    functionName: "getMerchantByUEN",
    args: [uen],
  });

  console.log("DATA", data);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] w-[95vw] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">
            Confirm Payment
          </DialogTitle>
          <DialogDescription className="text-sm sm:text-base">
            Please confirm the payment details
          </DialogDescription>
          <DialogDescription className="text-sm sm:text-base">
            UEN: <strong>{uen}</strong>
          </DialogDescription>
          <DialogDescription className="text-sm sm:text-base">
            You are paying <strong>{amount} SGD</strong> to{" "}
            <strong>{data?.entity_name}</strong>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex flex-row justify-between gap-2">
          <Button onClick={() => onOpenChange(false)} className="flex-1">
            Cancel
          </Button>
          <Button type="submit" className="flex-1">
            Confirm Payment
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
