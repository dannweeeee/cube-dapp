"use client";

import { useCallback, useEffect, useRef } from "react";
import QrScanner from "qr-scanner";

interface QRScannerProps {
  onScan: (data: string) => void;
}

export default function QRScanner({ onScan }: QRScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const qrScannerRef = useRef<QrScanner>();

  const handleScan = useCallback(
    (result: QrScanner.ScanResult) => {
      if (result?.data) {
        onScan(result.data);
      }
    },
    [onScan]
  );

  useEffect(() => {
    qrScannerRef.current = new QrScanner(videoRef.current!, handleScan, {
      maxScansPerSecond: 4,
      highlightScanRegion: false,
      highlightCodeOutline: true,
    });
    qrScannerRef.current.start();
    return () => {
      qrScannerRef.current!.stop();
    };
  }, [handleScan]);

  return (
    <div className="aspect-square w-full max-w-[300px] mx-auto overflow-hidden rounded-xl">
      <video ref={videoRef} className="w-full h-full object-cover"></video>
    </div>
  );
}
