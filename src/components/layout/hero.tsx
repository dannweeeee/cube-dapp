"use client";

import { buttonVariants } from "@/components/ui/button";
import { Highlight } from "@/components/ui/hero-highlight";
import { cn } from "@/lib/utils";
import { ConnectWallet } from "@coinbase/onchainkit/wallet";
import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAccount } from "wagmi";

const Hero = () => {
  const { isConnected } = useAccount();
  const router = useRouter();

  useEffect(() => {
    if (isConnected) {
      router.push("/registration");
    }
  }, [isConnected, router]);

  return (
    <div className="container mx-auto flex flex-col items-center text-center justify-center text-primary py-16 md:py-24 mt-28">
      <motion.h1
        initial={{
          opacity: 0,
          y: 20,
        }}
        animate={{
          opacity: 1,
          y: [20, -5, 0],
        }}
        transition={{
          duration: 0.4,
          ease: [0.4, 0.0, 0.2, 1],
        }}
        className="font-bold text-[22px] sm:text-3xl md:text-4xl lg:text-5xl text-center !leading-tight"
      >
        Pay With Crypto
        <br />
        <Highlight className="text-black dark:text-white rounded-xl">
          While Staying Onchain{" "}
        </Highlight>
      </motion.h1>
      <motion.p
        initial={{
          opacity: 0,
          y: 20,
        }}
        animate={{
          opacity: 1,
          y: [20, -5, 0],
        }}
        transition={{
          duration: 0.4,
          ease: [0.4, 0.0, 0.2, 1],
          delay: 0.2,
        }}
        className="text-center mt-4 sm:text-lg md:text-xl lg:text-[22px] md:max-w-prose mx-auto font-medium relative bg-contrast"
      >
        Cube is the onchain hub for executing real world payments with crypto
      </motion.p>
      <motion.div
        initial={{
          opacity: 0,
          y: 20,
        }}
        animate={{
          opacity: 1,
          y: [20, -5, 0],
        }}
        transition={{
          duration: 0.3,
          ease: [0.4, 0.0, 0.2, 1],
          delay: 0.6,
        }}
        className="mt-6 flex flex-col items-center justify-center w-full px-4 sm:px-0"
      >
        <ConnectWallet
          withWalletAggregator={true}
          text="Explore Cube 🧊"
          className={cn(
            buttonVariants(),
            "w-full sm:w-3/4 md:w-2/3 lg:w-1/2 py-4 sm:py-6 text-sm sm:text-base bg-blue hover:bg-blue-100 text-white gap-2 rounded-2xl transition-all duration-300 ease-in-out shadow-lg hover:shadow-xl"
          )}
        />
      </motion.div>
      <motion.div
        initial={{
          opacity: 0,
          y: 20,
        }}
        animate={{
          opacity: 1,
          y: [20, -5, 0],
        }}
        transition={{
          duration: 0.4,
          ease: [0.4, 0.0, 0.2, 1],
          delay: 0.8,
        }}
        className="container mx-auto mt-8"
      >
        <div className="relative rounded-lg w-full md:w-10/12 mx-auto overflow-hidden">
          <Image
            src="/assets/png/cube-cover-banner-v4.png"
            height={720}
            width={1080}
            alt="Cube Banner"
            className="w-full h-auto rounded-3xl"
          />
        </div>
      </motion.div>
    </div>
  );
};

export default Hero;
