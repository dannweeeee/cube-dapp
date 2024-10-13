"use client";

import React from "react";
import Link from "next/link";
import { Button } from "../ui/button";
import { Github, Twitter } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-white/50 text-black py-8 sm:py-12 font-sans">
      <div className="container mx-auto px-4">
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-blue-600 uppercase tracking-wide">
            Breaking The Ice In Finance, One Cube At A Time
          </h2>
          <p className="mt-2 text-sm sm:text-base text-blue-100/90 font-light leading-relaxed">
            Real World Payments 🫱🏻‍🫲🏽 Onchain Economy
          </p>
        </div>

        <div className="flex flex-col items-center justify-center mb-6 sm:mb-8 gap-3">
          <Button
            variant="link"
            asChild
            className="text-black bg-blue-100/30 hover:bg-blue-100/15 font-medium text-sm sm:text-md w-full sm:w-3/4 md:w-1/2 lg:w-1/4"
          >
            <Link href="/pay">Scan & Pay</Link>
          </Button>
          <Button
            variant="link"
            asChild
            className="text-black bg-blue-100/30 hover:bg-blue-100/15 font-medium text-sm sm:text-md w-full sm:w-3/4 md:w-1/2 lg:w-1/4"
          >
            <Link href="/merchant-registration">Join Merchant Network</Link>
          </Button>
        </div>

        <div className="flex justify-center space-x-4 mb-6 sm:mb-8">
          {/* <Button
            size="icon"
            className="rounded-full bg-yellow-100 hover:bg-yellow-200"
            onClick={() => window.open("https://x.com/dannonchain", "_blank")}
          >
            <Twitter className="w-4 h-4" />
          </Button> */}
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

        <div className="text-center text-xs sm:text-sm text-gray-600">
          <p className="font-medium">
            © {new Date().getFullYear()} Cube Protocol. All rights reserved.
          </p>
          <p className="mt-2">
            <i className="text-xs font-light">Deployed on fleek.xyz</i>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
