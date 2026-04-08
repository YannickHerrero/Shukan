import { useEffect, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";

export default function BarcodeScanner({
  onScan,
  onError,
}: {
  onScan: (barcode: string) => void;
  onError?: (error: string) => void;
}) {
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const containerId = "barcode-scanner";
    const scanner = new Html5Qrcode(containerId);
    scannerRef.current = scanner;

    scanner
      .start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 250, height: 150 } },
        (decodedText) => {
          scanner.stop().catch(() => {});
          onScan(decodedText);
        },
        () => {},
      )
      .catch((err) => {
        onError?.(String(err));
      });

    return () => {
      scanner.stop().catch(() => {});
    };
  }, [onScan, onError]);

  return (
    <div>
      <div id="barcode-scanner" ref={containerRef} className="rounded-lg overflow-hidden" />
    </div>
  );
}
