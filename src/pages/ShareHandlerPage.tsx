import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faImage,
  faFilePdf,
  faFileLines,
  faArrowLeft,
  faTriangleExclamation,
} from "@fortawesome/free-solid-svg-icons";

interface SharedContent {
  title: string;
  text: string;
  url: string;
  files: Array<{
    name: string;
    type: string;
    size: number;
    blob?: Blob;
    base64?: string;
  }>;
}

// IndexedDB setup
const DB_NAME = "webank-db";
const STORE_NAME = "shared-content";
const DB_VERSION = 1;

const openDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onerror = () => reject(new Error("Failed to open IndexedDB"));
    request.onsuccess = () => resolve(request.result);
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      db.createObjectStore(STORE_NAME, { keyPath: "id" });
    };
  });
};

const storeSharedContent = async (data: SharedContent): Promise<void> => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], "readwrite");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.put({ id: "sharedContent", ...data });
    request.onerror = () => reject(new Error("Failed to store shared content"));
    request.onsuccess = () => resolve();
    transaction.oncomplete = () => db.close();
  });
};

const getSharedContent = async (): Promise<SharedContent | null> => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], "readonly");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.get("sharedContent");
    request.onerror = () =>
      reject(new Error("Failed to retrieve shared content"));
    request.onsuccess = () => resolve(request.result || null);
    transaction.oncomplete = () => db.close();
  });
};

const clearSharedContent = async (): Promise<void> => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], "readwrite");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.delete("sharedContent");
    request.onerror = () => reject(new Error("Failed to clear shared content"));
    request.onsuccess = () => resolve();
    transaction.oncomplete = () => db.close();
  });
};

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
    return (
      <div className="p-4 text-center">
        <div className="animate-pulse text-[#20B2AA]">
          <div className="mb-2">⏳</div>
          <p>Loading shared content...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto p-4">
        <div className="text-red-500 text-center">
          <FontAwesomeIcon
            icon={faTriangleExclamation}
            className="text-3xl mb-3"
          />
          <h2 className="text-xl font-semibold mb-2">Storage Access Issue</h2>
          <p className="mb-4">{error}</p>

          <div className="grid gap-3 max-w-sm mx-auto">
            <button
              onClick={storeTestData}
              className="bg-green-100 text-green-800 p-3 rounded-lg hover:bg-green-200"
            >
              🧪 Load Test Data
            </button>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-100 text-blue-800 p-3 rounded-lg hover:bg-blue-200"
            >
              🔄 Try Again
            </button>
            <button
              onClick={() => {
                window.location.href = `chrome://settings/content/siteDetails?site=${encodeURIComponent(window.location.origin)}`;
              }}
              className="bg-yellow-100 text-yellow-800 p-3 rounded-lg hover:bg-yellow-200"
            >
              ⚙️ Open Browser Settings
            </button>
            <button
              onClick={() => navigate("/")}
              className="bg-[#20B2AA] text-white p-3 rounded-lg hover:bg-[#1C8C8A]"
            >
              ← Return to Home
            </button>
          </div>

          <div className="mt-6 p-4 bg-gray-100 rounded-lg text-left">
            <h3 className="font-bold mb-2">Troubleshooting Steps:</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Ensure you're not in private/incognito mode.</li>
              <li>Enable third-party cookies in browser settings.</li>
              <li>Click "Load Test Data" to simulate shared content.</li>
              <li>Share a file from your device to this app.</li>
              <li>Ensure the app is running over HTTPS.</li>
              <li>Contact support if the issue persists.</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  if (!sharedData?.files?.length) {
    return (
      <div className="max-w-2xl mx-auto p-4 text-center">
        <div className="text-gray-500">
          <h2 className="text-xl font-semibold mb-2">No Content Found</h2>
          <p className="mb-4">The shared content could not be loaded.</p>
          <button
            onClick={storeTestData}
            className="bg-green-100 text-green-800 px-6 py-2 rounded-lg hover:bg-green-200 mr-4"
          >
            Load Test Data
          </button>
          <button
            onClick={() => navigate("/")}
            className="bg-[#20B2AA] text-white px-6 py-2 rounded-lg hover:bg-[#1C8C8A] transition"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <button
        onClick={() => navigate("/")}
        className="mb-6 text-[#20B2AA] hover:text-[#1C8C8A] flex items-center"
      >
        <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
        Back to Home
      </button>

      <h1 className="text-2xl font-bold mb-6">Received Shared Content</h1>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Files to Upload</h2>
        <div className="grid gap-4">
          {sharedData.files.map((file, index) => (
            <div
              key={index}
              className="p-4 border rounded-lg bg-white shadow-sm"
            >
              <div className="flex items-center mb-2">
                <FontAwesomeIcon
                  icon={getFileIcon(file.type)}
                  className="text-[#20B2AA] mr-3 text-xl"
                />
                <span className="font-medium break-all">{file.name}</span>
              </div>
              <p className="text-sm text-gray-500">
                {file.type} • {formatFileSize(file.size)}
              </p>
              {file.type.startsWith("image/") && file.blob && (
                <img
                  src={URL.createObjectURL(file.blob)}
                  alt="Preview"
                  className="mt-2 max-h-48 w-auto object-contain border rounded"
                />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
        <h2 className="text-lg font-semibold mb-4">Select KYC Document Type</h2>
        <div className="grid gap-3">
          <button
            onClick={() => handleDestinationSelect("front-id")}
            className="p-4 text-left rounded-lg bg-white hover:bg-gray-50 border border-gray-200 transition-all duration-200 hover:shadow-sm"
          >
            <span className="block font-medium">🆔 Submit Front ID</span>
            <span className="text-sm text-gray-500">
              Upload the front side of your identity document
            </span>
          </button>

          <button
            onClick={() => handleDestinationSelect("back-id")}
            className="p-4 text-left rounded-lg bg-white hover:bg-gray-50 border border-gray-200 transition-all duration-200 hover:shadow-sm"
          >
            <span className="block font-medium">🆔 Submit Back ID</span>
            <span className="text-sm text-gray-500">
              Upload the back side of your identity document
            </span>
          </button>

          <button
            onClick={() => handleDestinationSelect("selfie")}
            className="p-4 text-left rounded-lg bg-white hover:bg-gray-50 border border-gray-200 transition-all duration-200 hover:shadow-sm"
          >
            <span className="block font-medium">🤳 Submit Selfie</span>
            <span className="text-sm text-gray-500">
              Upload a selfie for identity verification
            </span>
          </button>

          <button
            onClick={() => handleDestinationSelect("tax-id")}
            className="p-4 text-left rounded-lg bg-white hover:bg-gray-50 border border-gray-200 transition-all duration-200 hover:shadow-sm"
          >
            <span className="block font-medium">
              📄 Submit Tax Identification Document
            </span>
            <span className="text-sm text-gray-500">
              Upload your tax identification document
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

function getFileIcon(mimeType: string) {
  if (mimeType.startsWith("image/")) return faImage;
  if (mimeType === "application/pdf") return faFilePdf;
  return faFileLines;
}

function formatFileSize(bytes: number) {
  const units = ["B", "KB", "MB", "GB"];
  let size = bytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${size.toFixed(1)} ${units[unitIndex]}`;
}