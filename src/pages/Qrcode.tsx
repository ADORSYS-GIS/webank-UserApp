import { QRCodeCanvas } from 'qrcode.react';
import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router';
import useDisableScroll from '../hooks/useDisableScroll';
import { signTransaction } from '../services/keyManagement/signTransaction';
import { RootState } from '../store/Store';

const QRGenerator: React.FC = () => {
  useDisableScroll();
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
          console.log('Generated Signature:', signature);
        } else {
          console.warn('Missing data, cannot generate signature.');
        }
      } catch (error) {
        console.error('Error generating signature:', error);
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
      console.error('QR code canvas not found.');
      return;
    }

    // Create an off-screen canvas with 350x350 size
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    if (!context) {
      console.error('Failed to create canvas context.');
      return;
    }

    canvas.width = 350;
    canvas.height = 350;

    // Draw the original QR code onto the new canvas, scaling it up
    const img = new Image();
    img.src = originalCanvas.toDataURL('image/png');
    img.onload = () => {
      context.drawImage(img, 0, 0, 350, 350);

      // Convert to PNG and trigger download
      const url = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = url;
      a.download = 'qrcode.png';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    };
  };

  return (
    <div className='h-screen flex items-center justify-center p-4 bg-gradient-to-br from-indigo-50 to-blue-50'>
      <div className='bg-white rounded-xl shadow-lg p-6 md:p-8 w-full max-w-md md:max-w-lg flex flex-col items-center gap-6 mt-[-50px] md:mt-[-10px]'>
        <h2 className='text-2xl md:text-3xl font-bold text-gray-800 text-center'>
          {isClientOnline ? 'Top-Up QR Code' : 'Withdraw QR Code'}
        </h2>

        <div className='p-4 bg-white rounded-xl shadow-md border border-gray-200 flex items-center justify-center w-[270px] h-[270px]'>
          <div className='p-4 bg-gray-50 rounded-lg shadow-sm border border-gray-300 flex items-center justify-center w-[250px] h-[250px]'>
            <QRCodeCanvas value={qrValue} size={250} ref={qrRef} level='L' />
          </div>
        </div>

        <div className='w-full flex flex-col md:flex-col items-center gap-3'>
          <button
            onClick={downloadQRCode}
            className='w-full px-6 py-3 text-white bg-emerald-600 rounded-lg shadow-md transition hover:bg-emerald-700 active:scale-95'>
            Download QR
          </button>

          {show == 'Pay out' && (
            <button
              onClick={() =>
                navigate('/qr-scan/top-up', { state: { isClientOffline } })
              }
              className='w-full px-6 py-3 text-white bg-amber-600 rounded-lg shadow-md transition hover:bg-amber-700 active:scale-95'>
              Scan Instead
            </button>
          )}

          <button
            onClick={() => window.history.back()}
            className='w-full px-6 py-3 text-white bg-blue-600 rounded-lg shadow-md transition hover:bg-blue-700 active:scale-95'>
            ← Back
          </button>
        </div>
      </div>
    </div>
  );
};

export { QRGenerator as Component };
