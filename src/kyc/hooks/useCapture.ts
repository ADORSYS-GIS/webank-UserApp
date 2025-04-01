import React, { useState, useRef, useEffect, useCallback } from "react";

export const useCapture = (
  defaultFacingMode: "user" | "environment" = "user",
) => {
  const [showCamera, setShowCamera] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<"user" | "environment">(
    defaultFacingMode,
  );
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Function to stop the camera stream
  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
  };
  // Function to start the camera with the current facingMode
  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: facingMode },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
    }
  }, [facingMode]);

  // Function to switch between front and back cameras
  const switchCamera = () => {
    setFacingMode((prev) => (prev === "user" ? "environment" : "user"));
  };

  // Capture image from the video feed
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
        stopCamera();
      }
    }
  };

  // Handle file upload from device
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

  // Reset the capture state
  const resetCapture = () => {
    setCapturedImage(null);
    setShowCamera(false);
  };

  // Go back (exit camera or reset)
  const goBack = () => {
    if (showCamera) {
      setShowCamera(false);
    } else {
      resetCapture();
    }
  };

  // Use effect to manage camera start/stop based on showCamera and facingMode
  useEffect(() => {
    if (showCamera) {
      startCamera();
      return () => {
        stopCamera();
      };
    } else {
      stopCamera();
    }
  }, [showCamera, facingMode, startCamera]);

  return {
    showCamera,
    capturedImage,
    videoRef,
    canvasRef,
    setShowCamera,
    startCamera,
    captureImage,
    handleFileUpload,
    resetCapture,
    goBack,
    switchCamera,
  };
};

export default useCapture;
