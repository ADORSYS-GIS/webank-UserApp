import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "@state/Store";
import { signTransaction } from "@services/keyManagement/signTransaction";

export function useQRGenerator() {
  const navigate = useNavigate();
  const location = useLocation();
  const totalamount = location.state?.totalAmount;
  const accountId = useSelector((state: RootState) => state.account.accountId);
  const accountJwt = useSelector(
    (state: RootState) => state.account.accountCert,
  );
  const isClientOffline = location.state?.isClientOffline;
  const isClientOnline = location.state?.isClientOnline;
  const show = location.state?.show;

  const [signatureValue, setSignatureValue] = useState<string | null>(null);
  const qrRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const generateSignature = async () => {
      try {
        if (accountId && totalamount && accountJwt) {
          const signature = await signTransaction(
            accountId,
            totalamount,
            accountJwt,
          );
          setSignatureValue(signature);
        } else {
          // missing data
        }
      } catch (error) {
        // handle error
      }
    };
    generateSignature();
  }, [accountId, totalamount, accountJwt]);

  const qrValue = JSON.stringify({
    accountId: accountId,
    amount: totalamount,
    timeGenerated: Date.now(),
    ...(signatureValue && isClientOffline ? { signature: signatureValue } : {}),
  });

  // Function to download QR code with size 350
  const downloadQRCode = () => {
    const originalCanvas = qrRef.current;
    if (!originalCanvas) {
      return;
    }
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    if (!context) {
      return;
    }
    canvas.width = 350;
    canvas.height = 350;
    const img = new Image();
    img.src = originalCanvas.toDataURL("image/png");
    img.onload = () => {
      context.drawImage(img, 0, 0, 350, 350);
      const url = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = url;
      a.download = "qrcode.png";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    };
  };

  return {
    qrRef,
    qrValue,
    isClientOnline,
    isClientOffline,
    show,
    navigate,
    downloadQRCode,
  };
}
