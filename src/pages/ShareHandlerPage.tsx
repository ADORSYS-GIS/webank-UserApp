import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  storeSharedContent,
  getSharedContent,
  //clearSharedContent,
  openDB,
  LoadingState,
  ErrorState,
  NoContentState,
  SharedContentDisplay,
  SharedContent,
} from "../components/share-handler";
import KYCSubmissionCompleted from "../components/share-handler/KYCSubmissionCompleted";

import jsQR from "jsqr";
import { useNavigate } from "react-router-dom";
import { RootState } from "../store/Store";

export default function ShareHandlerPage() {
  const [sharedData, setSharedData] = useState<SharedContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  // Get documentStatus from Redux store
  const documentStatus = useSelector(
    (state: RootState) => state.account.documentStatus,
  );

  useEffect(() => {
    let timeoutId: NodeJS.Timeout | undefined = undefined;
    let retryCount = 0;
    const maxRetries = 3;

    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === "STORE_SHARED_CONTENT") {
        console.log("Received shared content from SW:", event.data.data);
        storeSharedContent(event.data.data)
          .then(() => {
            console.log("Stored shared content in IndexedDB");
            loadSharedData();
          })
          .catch((err) => {
            console.error("Failed to store shared content in IndexedDB:", err);
            setError("Failed to store shared content.");
            setLoading(false);
          });
      }
    };

    navigator.serviceWorker?.addEventListener("message", handleMessage);

    const validateStorage = async () => {
      try {
        const db = await openDB();
        db.close();
        return true;
      } catch (e) {
        setError(
          "IndexedDB blocked. Please disable private mode or relax browser restrictions.",
        );
        return false;
      }
    };

    const handleStorageAccessRequest = async (
      button: HTMLButtonElement,
    ): Promise<boolean> => {
      try {
        await document.requestStorageAccess();
        button.remove();
        return true;
      } catch (err) {
        setError("Storage access denied. Check browser settings.");
        return false;
      }
    };

    const setupStorageAccessButton = () => {
      const button = document.createElement("button");
      button.textContent = "Grant Storage Access";
      button.className = "bg-blue-500 text-white p-2 rounded";
      document.body.appendChild(button);
      return button;
    };

    const handleStorageAccessPromise = (button: HTMLButtonElement) => {
      return new Promise<boolean>((resolve) => {
        button.onclick = () => handleStorageAccessRequest(button).then(resolve);
      });
    };

    const requestStoragePermission = async () => {
      try {
        if (!navigator.storage || !navigator.permissions) {
          console.warn("Storage API not supported");
          return true;
        }

        const hasAccess = document.hasStorageAccess
          ? await document.hasStorageAccess()
          : true;

        if (!hasAccess) {
          setError('Click "Grant Access" to allow storage access.');
          const button = setupStorageAccessButton();
          return handleStorageAccessPromise(button);
        }

        const persisted = await navigator.storage.persisted();
        if (!persisted) {
          const result = await navigator.storage.persist();
          if (!result) {
            setError("Browser denied storage persistence");
            return false;
          }
        }

        const estimate = await navigator.storage.estimate();
        if ((estimate.quota || 0) < 1024 * 1024 * 10) {
          setError("Insufficient storage quota (need at least 10MB)");
          return false;
        }

        return true;
      } catch (error) {
        console.error("Permission error:", error);
        setError("Storage access failed. Check browser permissions.");
        return false;
      }
    };

    const base64ToBlob = async (
      base64: string,
      type: string,
    ): Promise<Blob> => {
      const response = await fetch(base64);
      const blob = await response.blob();
      return new Blob([blob], { type });
    };

    const isQRCode = async (file: {
      base64?: string;
      type: string;
    }): Promise<boolean> => {
      try {
        if (!file.base64 || !file.type.startsWith("image/")) {
          return false;
        }

        // Load the image
        const img = new Image();
        const loadPromise = new Promise((resolve, reject) => {
          img.onload = () => resolve(undefined);
          img.onerror = reject;
          img.src = file.base64 || "";
        });
        await loadPromise;

        // Create a canvas to draw the image
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          return false;
        }
        ctx.drawImage(img, 0, 0);

        // Get image data
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        // Use jsQR to detect QR code
        const qrCode = jsQR(imageData.data, imageData.width, imageData.height);
        return !!qrCode; // Returns true if QR code is detected
      } catch (err) {
        console.error("Error detecting QR code:", err);
        return false;
      }
    };

    const loadSharedData = async () => {
      try {
        setLoading(true);

        if (!(await validateStorage())) return;

        const hasPermission = await requestStoragePermission();
        if (!hasPermission) {
          setLoading(false);
          return;
        }

        console.log("Starting to load shared data from IndexedDB...");
        const storedData = await getSharedContent();
        console.log("IndexedDB contents:", storedData);

        if (storedData) {
          // Check file sizes before processing
          const MAX_FILE_SIZE = 100 * 1024; // 100KB in bytes
          const oversizedFiles = storedData.files.filter(file => file.size > MAX_FILE_SIZE);
          if (oversizedFiles.length > 0) {
            setError(`File size exceeds 100KB limit: ${oversizedFiles.map(f => f.name).join(', ')}`);
            setLoading(false);
            return;
          }

          const files = await Promise.all(
            storedData.files.map(async (file) => ({
              name: file.name,
              type: file.type,
              size: file.size,
              base64: file.base64,
              blob: file.base64
                ? await base64ToBlob(file.base64, file.type)
                : file.blob,
            })),
          );
          console.log("Found shared data:", storedData);

          // Check if the first file is a QR code
          if (files.length > 0) {
            const isQR = await isQRCode(files[0]);
            if (isQR) {
              console.log("QR code detected, redirecting to /qr-scan");
              navigate("/qr-scan", {
                state: {
                  sharedImage: files[0].base64,
                  show: "Transfer", // or "Payment" depending on the context
                },
              });
              return;
            }
          }
          setSharedData({ ...storedData, files });
          //await clearSharedContent();
          console.log("Cleared shared data from IndexedDB");
        } else if (retryCount < maxRetries) {
          console.warn(
            `No shared data found, retrying (${retryCount + 1}/${maxRetries})`,
          );
          retryCount++;
          timeoutId = setTimeout(loadSharedData, 1000);
          return;
        } else {
          console.error("No shared data found after retries");
          setError(
            "No shared content found. Please share files before accessing this page.",
          );
        }

        setLoading(false);
      } catch (error) {
        console.error("Error loading shared data:", error);
        setError(
          "Failed to access storage. Please check permissions and try again.",
        );
        setLoading(false);
      }
    };

    loadSharedData();

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      navigator.serviceWorker?.removeEventListener("message", handleMessage);
    };
  }, [navigate]);

  const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const storeTestData = async () => {
    try {
      // Create test image
      const canvas = document.createElement("canvas");
      canvas.width = 400;
      canvas.height = 300;
      const ctx = canvas.getContext("2d");

      if (ctx) {
        // Draw test image
        ctx.fillStyle = "#20B2AA";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "white";
        ctx.font = "30px Arial";
        ctx.textAlign = "center";
        ctx.fillText("Webank Test Image", canvas.width / 2, canvas.height / 2);
      }

      // Convert canvas to Blob
      const blob: Blob = await new Promise((resolve) => {
        canvas.toBlob((blob) => {
          if (blob) resolve(blob);
          else throw new Error("Canvas to Blob conversion failed");
        }, "image/png");
      });

      const base64 = await blobToBase64(blob);
      const testData: SharedContent = {
        title: "Test Image Share",
        text: "Sample image for testing purposes",
        url: "https://th.bing.com/th/id/OIP.n0lDRFThM72xoYQHI-lUIgHaHa?rs=1&pid=ImgDetMain",
        files: [
          {
            name: "test-image.png",
            type: "image/png",
            size: blob.size,
            base64,
          },
        ],
      };

      await storeSharedContent(testData);
      console.log("Stored image test data in IndexedDB");
      window.location.reload();
    } catch (error) {
      console.error("Error storing test data:", error);
      setError("Failed to store test data.");
    }
  };

  const docTypeMap: Record<string, string> = {
    "front-id": "frontID",
    "back-id": "backID",
    selfie: "selfieID",
    "tax-id": "taxDoc",
  };

  const handleDestinationSelect = (selectedDocType: string) => {
    const docType = docTypeMap[selectedDocType];
    if (docType && sharedData?.files?.length) {
      const file = sharedData.files[0];
      if (file.base64) {
        localStorage.setItem(docType, file.base64);
        navigate("/kyc/imgs");
      } else {
        setError("No base64 data available for the file");
      }
    } else {
      setError("Invalid document type or no files available");
    }
  };

  if (documentStatus === "PENDING") {
    return <KYCSubmissionCompleted />;
  }

  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState error={error} storeTestData={storeTestData} />;
  }

  if (!sharedData?.files?.length) {
    return <NoContentState storeTestData={storeTestData} />;
  }

  return (
    <SharedContentDisplay
      sharedData={sharedData}
      handleDestinationSelect={handleDestinationSelect}
    />
  );
}
