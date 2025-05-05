import { useEffect, useRef, useState, useCallback } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { toast } from "sonner";

export function useQRScannerCore({
  onDecodedText,
  onScanError,
  sharedImage,
}: {
  onDecodedText: (decodedText: string) => void;
  onScanError?: (errorMessage: string) => void;
  sharedImage?: string;
}) {
  const [error, setError] = useState<string | null>(null);
  const scannerRef = useRef<Html5Qrcode | null>(null);

  const stopScanner = useCallback(async () => {
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop();
        scannerRef.current = null;
      } catch (err) {
        console.error("Error stopping scanner:", err);
      }
    }
  }, []);

  // Start scanner
  useEffect(() => {
    const startScanner = async () => {
      await stopScanner();
      if (!scannerRef.current) {
        try {
          scannerRef.current = new Html5Qrcode("qr-reader");
          await scannerRef.current.start(
            { facingMode: "environment" },
            {
              fps: 30,
              qrbox: { width: 400, height: 400 },
              aspectRatio: 1.0,
              disableFlip: true,
            },
            onDecodedText,
            onScanError || (() => {}),
          );
        } catch (err) {
          setError("Unable to access camera. Please allow camera permissions.");
          toast.error("Camera access denied. Enable permissions.");
        }
      }
    };
    startScanner();
    return () => {
      stopScanner();
    };
  }, [onDecodedText, onScanError, stopScanner]);

  // Handle shared image from navigation state
  useEffect(() => {
    if (sharedImage) {
      const processSharedImage = async () => {
        try {
          const response = await fetch(sharedImage);
          const blob = await response.blob();
          const file = new File([blob], "shared-qr.png", { type: blob.type });
          await stopScanner();
          const qrScanner = new Html5Qrcode("qr-reader");
          const result = await qrScanner.scanFile(file, false);
          onDecodedText(result);
        } catch (err) {
          setError(
            "Failed to read QR code from shared image. Please try again.",
          );
          toast.error(
            "Invalid QR code in shared image. Try scanning manually.",
          );
        }
      };
      processSharedImage();
    }
  }, [sharedImage, onDecodedText, stopScanner]);

  // Handle file upload for QR code scanning
  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];
      if (!allowedTypes.includes(file.type)) {
        setError("Unsupported file type. Please upload a PNG or JPEG image.");
        toast.error("Invalid file format. Use PNG or JPG.");
        return;
      }
      try {
        await stopScanner();
        const qrScanner = new Html5Qrcode("qr-reader");
        const result = await qrScanner.scanFile(file, false);
        onDecodedText(result);
      } catch (err) {
        setError("Failed to read QR code from image. Please try again.");
        toast.error("QR code scanning failed. Try another image.");
      }
    }
  };

  return {
    error,
    setError,
    handleFileUpload,
    scannerRef,
    stopScanner,
  };
}
