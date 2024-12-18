"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { AlignRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import React from "react";
import { usePathname, useRouter } from "next/navigation";
import LoginButton from "../ui/wallet/login-button";
import SignupButton from "../ui/wallet/signup-button";
import { useAccount } from "wagmi";
import { Button } from "../ui/button";

const NavMobile = ({
  navItems,
}: {
  navItems: Array<{ href: string; name: React.ReactNode; icon: string }>;
}) => {
  const pathname = usePathname();
  const router = useRouter();
  const { address, isConnected } = useAccount();

  return (
    <Sheet>
      <SheetTrigger>
        <AlignRight
          className="w-6 h-6 text-accent hover:text-accent/80 transition-colors duration-300"
          strokeWidth={3}
        />
      </SheetTrigger>
      <SheetContent aria-describedby="mobile-nav" className="!max-w-72">
        <SheetHeader>
          <SheetTitle>
            <div className="flex items-center gap-3">
              <Link href="/">
                <Image
                  src="/assets/svg/cube-blue.svg"
                  alt="cube-logo"
                  width={40}
                  height={40}
                  className="hover:opacity-80 transition-opacity duration-300"
                />
              </Link>
            </div>
          </SheetTitle>
          <div className="h-4" />
          <div className="flex items-center justify-center gap-4">
            {navItems.map((navItem, idx: number) => (
              <React.Fragment key={`nav-item-${idx}`}>
                {isConnected && (
                  <Button
                    variant="link"
                    onClick={() => router.push(navItem.href)}
                    className={`relative ${
                      pathname === navItem.href
                        ? "bg-blue-100/50"
                        : "bg-blue-100/30 "
                    } hover:bg-blue-100/15  transition-colors h-[48px] w-1/2 text-sm`}
                  >
                    <span className="flex items-center gap-1 text-md !cursor-pointer font-semibold text-black">
                      <Image
                        src={navItem.icon}
                        alt={`${navItem.name} icon`}
                        width={16}
                        height={16}
                      />
                      {navItem.name}
                      {pathname === navItem.href && (
                        <span className="absolute bottom-0 left-0 w-full h-0.5 bg-accent"></span>
                      )}
                    </span>
                  </Button>
                )}
              </React.Fragment>
            ))}
          </div>
          <div className="h-4" />
          <div className="flex items-center justify-center gap-2">
            <SignupButton />
            {!address && <LoginButton />}
          </div>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
};

export default NavMobile;
