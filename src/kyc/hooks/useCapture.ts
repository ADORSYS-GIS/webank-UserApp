// src/kyc/hooks/useCapture.ts
import { useState, useRef } from "react";

export const useCapture = () => {
  const [showCamera, setShowCamera] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Start Camera
  const startCamera = async () => {
    setShowCamera(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
    }
  };

  // Capture Image from Camera
  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");
      if (context) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageUrl = canvas.toDataURL("image/png");
        setCapturedImage(imageUrl);

        // Stop camera stream after capture
        const stream = video.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
      }
    }
  };

  // Upload Image from Device
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setCapturedImage(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Reset capture state
  const resetCapture = () => {
    setCapturedImage(null);
    setShowCamera(false);
  };

  // Go back (exit camera mode or reset)
  const goBack = () => {
    if (showCamera) {
      setShowCamera(false);
    } else {
      resetCapture();
    }
  };

  return {
    showCamera,
    capturedImage,
    videoRef,
    canvasRef,
    startCamera,
    captureImage,
    handleFileUpload,
    resetCapture,
    goBack,
  };
};
