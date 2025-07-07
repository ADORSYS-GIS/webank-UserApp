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
      const img = new window.Image();
      img.src = sharedImage;
      img.onload = async () => {
        try {
          const canvas = document.createElement("canvas");
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.drawImage(img, 0, 0);
            const imageData = ctx.getImageData(0, 0, img.width, img.height);
            // Assuming Html5Qrcode has scanImage method
            if (scannerRef.current) {
              const result = await scannerRef.current.scanImage(imageData);
              onDecodedText(result);
            }
          }
        } catch (err) {
          setError("Failed to process shared image.");
        }
      };
    }
  }, [sharedImage, onDecodedText]);

  // File upload QR scan
  const handleFileUpload = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = async (e) => {
        const img = new window.Image();
        img.src = e.target?.result as string;
        img.onload = async () => {
          try {
            const canvas = document.createElement("canvas");
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext("2d");
            if (ctx) {
              ctx.drawImage(img, 0, 0);
              const imageData = ctx.getImageData(0, 0, img.width, img.height);
              // Assuming Html5Qrcode has scanImage method
              if (scannerRef.current) {
                const result = await scannerRef.current.scanImage(imageData);
                onDecodedText(result);
              }
            }
          } catch (err) {
            setError("Failed to process uploaded image.");
          }
        };
      };
      reader.readAsDataURL(file);
    },
    [onDecodedText],
  );

  return {
    error,
    handleFileUpload,
  };
}
