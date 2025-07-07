import { useRef, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@state/Store";

export function useAccountQRModal(isOpen: boolean, onClose: () => void) {
  const accountId = useSelector((state: RootState) => state.account.accountId);
  const qrRef = useRef<HTMLCanvasElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const [includeName, setIncludeName] = useState(false);
  const [name, setName] = useState("");

  // Generate QR Code content with predefined values
  const qrValue = JSON.stringify({
    accountId: accountId,
    ...(includeName && name ? { name } : {}),
  });

  // Function to download QR code
  const downloadQRCode = () => {
    const canvas = qrRef.current;
    if (canvas) {
      const url = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = url;
      a.download = "account_qr.png";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  // Handle click outside to close modal
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      // Prevent scrolling when modal is open
      document.body.style.overflow = "hidden";
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
        document.body.style.overflow = "auto";
      };
    }
  }, [isOpen, onClose]);

  return {
    accountId,
    qrRef,
    modalRef,
    includeName,
    setIncludeName,
    name,
    setName,
    qrValue,
    downloadQRCode,
  };
}
