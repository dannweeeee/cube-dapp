"use client";

import React from "react";
import Link from "next/link";
import { Button } from "../ui/button";
import { Github } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-white/50 text-black py-6 font-sans">
      <div className="container mx-auto px-4">
        <div className="text-center mb-4">
          <h2 className="text-xl font-bold text-blue-600 uppercase tracking-wide">
            Breaking The Ice In Finance
          </h2>
          <p className="mt-1 text-sm text-blue-100/90 font-light">
            Real World Payments 🫱🏻‍🫲🏽 Onchain Economy
          </p>
        </div>

        <div className="flex flex-col items-center space-y-4 mb-4">
          <Button
            variant="link"
            asChild
            className="text-black bg-blue-100/30 hover:bg-blue-100/15 font-medium text-sm w-full max-w-xs"
          >
            <Link href="/pay">Scan & Pay</Link>
          </Button>
          <Button
            variant="link"
            asChild
            className="text-black bg-blue-100/30 hover:bg-blue-100/15 font-medium text-sm w-full max-w-xs"
          >
            <Link href="/merchant-registration">Join Merchant Network</Link>
          </Button>
          <Button
            size="icon"
            className="rounded-full bg-yellow-100 hover:bg-yellow-200"
            onClick={() =>
              window.open("https://github.com/cube-protocol", "_blank")
            }
          >
            <Github className="w-4 h-4" />
          </Button>
        </div>

        <div className="text-center text-xs text-gray-600">
          <p>
            © {new Date().getFullYear()} Cube Protocol. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
