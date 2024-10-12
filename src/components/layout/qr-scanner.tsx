"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import QrScanner from "qr-scanner";

interface QRScannerProps {
  onScan: (data: string) => void;
}

export default function QRScanner({ onScan }: QRScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const qrScannerRef = useRef<QrScanner>();
  const [error, setError] = useState<string | null>(null);

  const handleScan = useCallback(
    (result: QrScanner.ScanResult) => {
      if (result?.data) {
        onScan(result.data);
      }
    },
    [onScan]
  );

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (window.isSecureContext) {
        try {
          qrScannerRef.current = new QrScanner(videoRef.current!, handleScan, {
            maxScansPerSecond: 5,
            highlightScanRegion: false,
            highlightCodeOutline: true,
            returnDetailedScanResult: true,
          });
          qrScannerRef.current.start();
        } catch (err: unknown) {
          setError(
            err instanceof Error
              ? err.message
              : "Failed to start QR scanner. Please ensure camera permissions are granted."
          );
        }
      } else {
        setError(
          "QR scanner requires a secure context (HTTPS). Please access this page via HTTPS."
        );
      }
    }

    return () => {
      qrScannerRef.current?.stop();
    };
  }, [handleScan]);

  return (
    <div className="aspect-square w-full max-w-[300px] mx-auto overflow-hidden rounded-xl">
      {error ? (
        <div className="w-full h-full flex items-center justify-center bg-gray-200 text-red-500 p-4 text-center">
          {error}
        </div>
      ) : (
        <video ref={videoRef} className="w-full h-full object-cover"></video>
      )}
    </div>
  );
}
