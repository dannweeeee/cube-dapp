"use client";
import {
  Avatar,
  EthBalance,
  Identity,
  Name,
} from "@coinbase/onchainkit/identity";
import {
  ConnectWallet,
  Wallet,
  WalletDropdown,
  WalletDropdownBasename,
  WalletDropdownDisconnect,
  WalletDropdownFundLink,
  WalletDropdownLink,
} from "@coinbase/onchainkit/wallet";
import { useAccount } from "wagmi";
import { generateOnRampURL } from "@coinbase/cbpay-js";
import Image from "next/image";

type WalletWrapperParams = {
  text?: string;
  className?: string;
  withWalletAggregator?: boolean;
};
export default function WalletWrapper({
  className,
  text,
  withWalletAggregator = false,
}: WalletWrapperParams) {
  const { address } = useAccount();

  const onRampURL = generateOnRampURL({
    appId: process.env.NEXT_PUBLIC_CDP_PROJECT_ID,
    destinationWallets: [
      {
        address: address ?? "",
        blockchains: ["ethereum"],
        assets: ["ETH", "USDC"],
      },
    ],
  });

  return (
    <>
      <Wallet>
        <ConnectWallet
          withWalletAggregator={withWalletAggregator}
          text={text}
          className={className}
        >
          <Image
            src={`https://api.multiavatar.com/${address}.png`}
            alt="profile-image"
            className="rounded-full"
            width={28}
            height={28}
          />
          <Name className="text-sm" />
        </ConnectWallet>
        <WalletDropdown>
          <Identity className="px-4 pt-3 pb-2" hasCopyAddressOnClick={true}>
            <Avatar />
            <Name />
            <EthBalance />
          </Identity>
          <WalletDropdownBasename />
          <WalletDropdownLink
            icon="wallet"
            href="https://wallet.coinbase.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            Go to Wallet Dashboard
          </WalletDropdownLink>
          <WalletDropdownFundLink
            fundingUrl={onRampURL}
            target="_blank"
            rel="noopener noreferrer"
          />
          <WalletDropdownDisconnect />
        </WalletDropdown>
      </Wallet>
    </>
  );
}
