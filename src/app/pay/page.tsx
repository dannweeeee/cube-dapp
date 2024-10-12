"use client";

import React, { useState } from "react";
import QRScanner from "@/components/layout/qr-scanner";
import { Button } from "@/components/ui/button";

const Page = () => {
  const [scannedData, setScannedData] = useState<string | null>(null);

  const handleScan = (data: string) => {
    function isLetter(char: string) {
      return char.length === 1 && char.match(/[a-z]/i);
    }

    if (data) {
      console.log("Scanned QR code:", data);

      // Pattern for PromptPay QR codes
      const promptPayPattern =
        /^00020101021130\d{2}0016A00000067701011201(\d{13}|\d{15}).*?5802TH/;

      // Existing patterns
      const paynowPattern = /PAYNOW01012021[023]([A-Za-z0-9]{10})/;
      const netsPattern = /SG\.COM\.NETS0123([0-9]{9}[A-Z])/;

      const promptPayMatch = data.match(promptPayPattern);
      const paynowMatch = data.match(paynowPattern);
      const netsMatch = data.match(netsPattern);

      if (promptPayMatch) {
        const promptPayId = promptPayMatch[1];
        console.log("Parsed QR Data (PromptPay):", promptPayId);
        setScannedData(promptPayId);
      } else if (paynowMatch) {
        // PayNow QR code logic
        const eighthChar = paynowMatch[1][paynowMatch[1].length - 2];

        if (isLetter(eighthChar)) {
          console.log(
            "Parsed QR Data (PayNow 9-character UEN):",
            paynowMatch[1].slice(0, -1)
          );
          setScannedData(paynowMatch[1].slice(0, -1));
        } else {
          console.log(
            "Parsed QR Data (PayNow 10-character UEN):",
            paynowMatch[1]
          );
          setScannedData(paynowMatch[1]);
        }
      } else if (netsMatch) {
        // NETS QR code logic
        console.log("Parsed QR Data (NETS UEN):", netsMatch[1]);
        setScannedData(netsMatch[1]);
      } else {
        // If no match found, try to find any 9-digit number followed by a letter
        const genericUenPattern = /([0-9]{9}[A-Z])/;
        const genericMatch = data.match(genericUenPattern);

        if (genericMatch) {
          console.log("Parsed QR Data (Generic UEN):", genericMatch[1]);
          setScannedData(genericMatch[1]);
        } else {
          console.log("Unrecognized QR format. Full QR Data:", data);
          setScannedData(data);
        }
      }
    }
  };

  const handleReset = () => {
    setScannedData(null);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      {scannedData ? (
        <div className="text-center">
          <h2 className="text-xl font-bold mb-2">Scanned Data:</h2>
          <p className="mb-4">{scannedData}</p>
          <Button
            onClick={handleReset}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Scan Again
          </Button>
        </div>
      ) : (
        <QRScanner onScan={handleScan} />
      )}
    </div>
  );
};

export default Page;
