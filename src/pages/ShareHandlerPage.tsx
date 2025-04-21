import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  storeSharedContent,
  getSharedContent,
  clearSharedContent,
  openDB,
  LoadingState,
  ErrorState,
  NoContentState,
  SharedContentDisplay,
  SharedContent,
} from "../components/share-handler";

export default function ShareHandlerPage() {
  const [sharedData, setSharedData] = useState<SharedContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

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
          return new Promise((resolve) => {
            const button = document.createElement("button");
            button.textContent = "Grant Storage Access";
            button.className = "bg-blue-500 text-white p-2 rounded";
            button.onclick = async () => {
              try {
                await document.requestStorageAccess();
                button.remove();
                resolve(true);
              } catch (err) {
                setError("Storage access denied. Check browser settings.");
                resolve(false);
              }
            };
            document.body.appendChild(button);
          });
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
          const files = await Promise.all(
            storedData.files.map(async (file) => ({
              name: file.name,
              type: file.type,
              size: file.size,
              blob: file.base64
                ? await base64ToBlob(file.base64, file.type)
                : file.blob,
            })),
          );
          console.log("Found shared data:", storedData);
          setSharedData({ ...storedData, files });
          await clearSharedContent();
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
  }, []);

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

  const handleDestinationSelect = (docType: string) => {
    if (sharedData?.files?.length) {
      navigate("/kyc", {
        state: {
          sharedFiles: sharedData.files,
          source: "share-handler",
          docType,
        },
      });
    } else {
      setError("No files available to upload");
    }
  };

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
