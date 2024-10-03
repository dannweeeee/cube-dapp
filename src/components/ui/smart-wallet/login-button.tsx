"use client";
import WalletWrapper from "./wallet-wrapper";

export default function LoginButton() {
  return (
    <WalletWrapper
      className="min-w-[90px] h-[35px] font-semibold"
      text="Log in"
      withWalletAggregator={true}
    />
  );
}