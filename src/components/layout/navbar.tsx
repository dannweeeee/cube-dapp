"use client";

import Link from "next/link";
import { navItems } from "@/lib/constants";
import NavMobile from "./navbar-mobile";
import Image from "next/image";
import React from "react";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import LoginButton from "../ui/smart-wallet/login-button";
import SignupButton from "../ui/smart-wallet/signup-button";
import { useAccount } from "wagmi";

const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { address } = useAccount();

  return (
    <>
      <header className="fixed top-0 left-0 right-0 isolate z-10 bg-contrast/50 backdrop-filter backdrop-blur-xl shadow-sm bg-white/50">
        <nav
          aria-label="Desktop navigation"
          className="mx-auto flex container items-center justify-between p-6 lg:!px-8 !py-4"
        >
          <div className="flex-1 hidden md:block justify-start items-center">
            <div className="flex items-center">
              <div className="flex items-center gap-8">
                {navItems.map((navItem, idx: number) => (
                  <React.Fragment key={`nav-item-${idx}`}>
                    {address && (
                      <Button
                        variant="link"
                        onClick={() => router.push(navItem.href)}
                        className={`relative ${
                          pathname === navItem.href
                            ? "bg-blue-100/50"
                            : "bg-blue-100/30 "
                        } hover:bg-blue-100/15  transition-colors h-[48px] w-auto text-sm`}
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
            </div>
          </div>
          <div className="flex items-center justify-center px-4">
            <Link href="/">
              <Image
                src="/assets/svg/cube-blue.svg"
                alt="cube-logo"
                width={50}
                height={50}
                className="hover:opacity-80 transition-opacity duration-300"
              />
            </Link>
          </div>
          <div className="flex-1 justify-end items-center hidden md:!flex gap-2">
            {" "}
            <SignupButton />
            {!address && <LoginButton />}
          </div>
          <div className="block md:hidden ml-8">
            <NavMobile navItems={navItems} />
          </div>
        </nav>
      </header>
    </>
  );
};

export default Navbar;
