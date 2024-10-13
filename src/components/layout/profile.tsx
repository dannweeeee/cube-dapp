import React from "react";
import PageContainer from "./page-container";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { UserTransactions } from "../ui/profile/user-transactions";
import EthBalanceCard from "../ui/profile/eth-balance-card";
import { useAccount } from "wagmi";
import UsdcBalanceCard from "../ui/profile/usdc-balance-card";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { MerchantTransactions } from "../ui/profile/merchant-transactions";
import VaultBalanceCard from "../ui/profile/vault-balance-card";

const Profile = () => {
  const { address } = useAccount();

  return (
    <PageContainer scrollable>
      <div className="flex justify-center items-start px-4 mt-20 sm:pt-0">
        <div className="w-full max-w-4xl space-y-4">
          <Tabs defaultValue="profile" className="space-y-4">
            <div className="flex flex-col items-center justify-between gap-4">
              <TabsList className="w-full">
                <TabsTrigger className="flex-1 h-[35px]" value="profile">
                  Profile
                </TabsTrigger>
                <TabsTrigger className="flex-1 h-[35px]" value="merchant">
                  Merchant
                </TabsTrigger>
              </TabsList>
            </div>
            <TabsContent value="profile" className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                {address && <EthBalanceCard address={address} />}
                {address && <UsdcBalanceCard address={address} />}
              </div>
              <Card>
                <CardHeader>
                  <CardTitle>Recent Transactions</CardTitle>
                  <CardDescription>
                    Recent transactions on your wallet.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <UserTransactions />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="merchant" className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                {address && <UsdcBalanceCard address={address} />}
                {address && <VaultBalanceCard address={address} />}
              </div>
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Merchant Sales</CardTitle>
                    <CardDescription>
                      Recent transactions for your merchant account.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <MerchantTransactions />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </PageContainer>
  );
};

export default Profile;
