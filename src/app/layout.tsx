import "./globals.css";
import type { Metadata } from "next";

import "@coinbase/onchainkit/styles.css";
import "@rainbow-me/rainbowkit/styles.css";
import dynamic from "next/dynamic";
import NProgressBar from "@/components/ui/nprogress-bar";
import Navbar from "@/components/layout/navbar";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { Toaster } from "@/components/ui/toaster";
import Footer from "@/components/layout/footer";

export const metadata: Metadata = {
  metadataBase: new URL("https://usecube.vercel.app"),
  title: "Cube",
  description: "Real World Payments Solution with Crypto",
  keywords: [
    "SGQR",
    "Stablecoins",
    "ERC4626",
    "Paymaster",
    "Basenames",
    "Onchainkit",
  ],
  openGraph: {
    images:
      "https://github.com/usecube/.github/blob/main/assets/png/cube-banner.png?raw=true",
  },
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
                <Footer />
              </AuroraBackground>
              <Toaster />
            </main>
          </NProgressBar>
        </OnchainProviders>
      </body>
    </html>
  );
}
