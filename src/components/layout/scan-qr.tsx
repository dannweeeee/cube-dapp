"use client";

import React from "react";
import { Scanner } from "@yudiel/react-qr-scanner";
import { CSSProperties } from "react";

const ScanQR = () => {
  const scannerStyles: {
    container?: CSSProperties;
    video?: CSSProperties;
    finderBorder?: number;
  } = {
    container: {
      width: "100%",
      height: "100%",
      color: "#118DF0",
    },
    video: {
      width: "100%",
      height: "100%",
      objectFit: "cover",
    },
    finderBorder: 4,
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-[500px] aspect-square">
        <Scanner
          onScan={(result) => console.log(result)}
          styles={scannerStyles}
          constraints={{
            facingMode: "environment",
          }}
        />
      </div>
    </div>
  );
};

export default ScanQR;
