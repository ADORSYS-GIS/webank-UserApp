import { SharedContent } from "./SharedContentDisplay";

const DB_NAME = "webank-db";
const STORE_NAME = "shared-content";
const KYC_STORE_NAME = "kyc-images";
const DB_VERSION = 2;

const openDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onerror = () => reject(new Error("Failed to open IndexedDB"));
    request.onsuccess = () => resolve(request.result);
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id" });
      }
      if (!db.objectStoreNames.contains(KYC_STORE_NAME)) {
        db.createObjectStore(KYC_STORE_NAME, { keyPath: "type" });
      }
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

const storeKycImage = async (type: string, base64: string): Promise<void> => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([KYC_STORE_NAME], "readwrite");
    const store = transaction.objectStore(KYC_STORE_NAME);
    const request = store.put({ type, base64 });
    request.onerror = () => reject(new Error("Failed to store KYC image"));
    request.onsuccess = () => resolve();
    transaction.oncomplete = () => db.close();
  });
};

const getKycImage = async (type: string): Promise<string | null> => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([KYC_STORE_NAME], "readonly");
    const store = transaction.objectStore(KYC_STORE_NAME);
    const request = store.get(type);
    request.onerror = () => reject(new Error("Failed to retrieve KYC image"));
    request.onsuccess = () => {
      const result = request.result;
      resolve(result ? result.base64 : null);
    };
    transaction.oncomplete = () => db.close();
  });
};

const getAllKycImages = async (): Promise<Record<string, string | null>> => {
  const types = ["frontID", "backID", "selfieID", "taxDoc"];
  const images: Record<string, string | null> = {};
  await Promise.all(
    types.map(async (type) => {
      images[type] = await getKycImage(type);
    }),
  );
  return images;
};

export {
  openDB,
  storeSharedContent,
  getSharedContent,
  clearSharedContent,
  storeKycImage,
  getAllKycImages,
};
