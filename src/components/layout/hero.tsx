"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import { Highlight } from "@/components/ui/hero-highlight";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Rocket } from "lucide-react";

const Hero = () => {
  return (
    <div className="container mx-auto relative text-primary">
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
          While Staying Onchain
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
        Cube is the onchain hub for executing real world payments with crypto.
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
        className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-2"
      >
        <Button
          className={cn(
            buttonVariants(),
            "w-full max-w-80 sm:w-auto md:py-6 md:text-base bg-blue hover:bg-blue-100 text-white gap-2"
          )}
        >
          Launch Cube
          <Rocket className="w-4 h-4" />
        </Button>
      </motion.div>
    </div>
  );
};

export default Hero;
