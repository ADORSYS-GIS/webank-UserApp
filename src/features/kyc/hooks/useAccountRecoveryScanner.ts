import { useState, useEffect, useRef, useCallback } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import useDisableScroll from "@shared/hooks/useDisableScroll";

export function useAccountRecoveryScanner() {
  useDisableScroll();
  const [error, setError] = useState<string | null>(null);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const oldAccountId = location.state.oldAccountId;

  // Stop the scanner safely
  const stopScanner = async () => {
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop();
        scannerRef.current = null;
      } catch (err) {
        console.error("Error stopping scanner:", err);
      }
    }
  };

  // Process the decoded QR code immediately
  const handleDecodedText = useCallback(
    (decodedText: string) => {
      try {
        const data = JSON.parse(decodedText);
        if (data.accountId) {
          stopScanner();
          navigate("/recovery/account-confirmation", {
            state: { accountId: data.accountId, oldAccountId },
          });
        } else {
          throw new Error("Invalid QR Code: Missing accountId");
        }
      } catch (err) {
        console.error("Error decoding QR code:", err);
        setError("Failed to read recovery QR code. Please try again.");
        toast.error("Invalid QR code. Try again.");
      }
    },
    [navigate, oldAccountId],
  );

  const handleScanError = useCallback((errorMessage: string) => {
    console.log("Scanning error:", errorMessage);
  }, []);

  useEffect(() => {
    const startScanner = async () => {
      await stopScanner();
      if (!scannerRef.current) {
        try {
          scannerRef.current = new Html5Qrcode("qr-reader");
          await scannerRef.current.start(
            { facingMode: "environment" },
            {
              fps: 10,
              qrbox: { width: 250, height: 250 },
            },
            handleDecodedText,
            handleScanError,
          );
        } catch (err) {
          setError("Failed to start QR scanner. Try again.");
        }
      }
    };
    startScanner();
    return () => {
      stopScanner();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [handleDecodedText, handleScanError]);

  return {
    error,
    setError,
    scannerRef,
    oldAccountId,
  };
}
