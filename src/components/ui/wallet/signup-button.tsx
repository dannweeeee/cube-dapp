"use client";
import WalletWrapper from "./wallet-wrapper";

export default function SignupButton() {
  return (
    <WalletWrapper
      className="ockConnectWallet_Container min-w-[90px] shrink text-black bg-blue-100/80 hover:bg-blue-100/65 flex h-[48px] items-center justify-center"
      text="Sign up"
    />
  );
}
