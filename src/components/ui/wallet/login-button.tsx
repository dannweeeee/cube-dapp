"use client";
import WalletWrapper from "./wallet-wrapper";

export default function LoginButton() {
  return (
    <WalletWrapper
      className="min-w-[90px] h-[48px]"
      text="Log in"
      withWalletAggregator={true}
    />
  );
}
