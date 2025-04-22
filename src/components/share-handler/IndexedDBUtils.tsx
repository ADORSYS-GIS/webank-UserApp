import { SharedContent } from "./SharedContentDisplay";

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

const storeDocumentImage = async (
  docType: string,
  imageData: string,
): Promise<void> => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], "readwrite");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.put({ id: docType, imageData });
    request.onerror = () => reject(new Error(`Failed to store ${docType}`));
    request.onsuccess = () => resolve();
    transaction.oncomplete = () => db.close();
  });
};

const getDocumentImage = async (docType: string): Promise<string | null> => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], "readonly");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.get(docType);
    request.onerror = () => reject(new Error(`Failed to retrieve ${docType}`));
    request.onsuccess = () => {
      const result = request.result;
      resolve(result ? result.imageData : null);
    };
    transaction.oncomplete = () => db.close();
  });
};

export {
  openDB,
  storeSharedContent,
  getSharedContent,
  clearSharedContent,
  storeDocumentImage,
  getDocumentImage,
};
