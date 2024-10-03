"use client";
import WalletWrapper from "./wallet-wrapper";

export default function SignupButton() {
  return (
    <WalletWrapper
      className="ockConnectWallet_Container min-w-[90px] h-[35px] shrink bg-blue-100 text-[#030712] hover:bg-blue-100/50 font-semibold"
      text="Sign up"
    />
  );
}
