import "./globals.css";
import type { Metadata } from "next";

import "@coinbase/onchainkit/styles.css";
import "@rainbow-me/rainbowkit/styles.css";
import dynamic from "next/dynamic";
import NProgressBar from "@/components/ui/nprogress-bar";
import Navbar from "@/components/layout/navbar";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: "Cube",
  description: "Real World Payments Solution with Crypto",
};

const OnchainProviders = dynamic(
  () => import("@/components/onchainkit/onchain-providers"),
  {
    ssr: false,
  }
);

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <OnchainProviders>
          <NProgressBar>
            <main className="min-h-screen">
              <AuroraBackground>
                <Navbar />
                {children}
              </AuroraBackground>
              <Toaster />
            </main>
          </NProgressBar>
        </OnchainProviders>
      </body>
    </html>
  );
}
