import "./globals.css";
import type { Metadata } from "next";
import { headers } from "next/headers";

import { cookieToInitialState } from "wagmi";

import { config } from "@/config";
import AppKitProvider from "@/context";
import NprogressProvider from "@/providers/nprogress";
import Navbar from "@/components/layout/navbar";
import { AuroraBackground } from "@/components/ui/aurora-background";

export const metadata: Metadata = {
  title: "Cube",
  description: "Real World Payments Solution with Crypto",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const initialState = cookieToInitialState(config, headers().get("cookie"));
  return (
    <html lang="en">
      <body>
        <AppKitProvider initialState={initialState}>
          <NprogressProvider>
            <main className="min-h-screen">
              <AuroraBackground>
                <Navbar />
                {children}
              </AuroraBackground>
            </main>
          </NprogressProvider>
        </AppKitProvider>
      </body>
    </html>
  );
}
