import { StorageFactory } from "@adorsys-gis/storage";
import { DBSchema } from "idb";

interface MyDatabase extends DBSchema {
  keys: {
    key: number;
    value: {
      pub: JsonWebKey;
      priv: {
        jwe: string;
        salt: number[];
      };
      kid: number;
    };
  };
}

async function initializeStorage(): Promise<StorageFactory<MyDatabase> | null> {
  const databases = await indexedDB.databases();
  const dbExists = databases.some((db) => db.name === "KeysDB");

  if (!dbExists) {
    return new StorageFactory<MyDatabase>("KeysDB", 1, {
      upgrade: (db) => {
        if (!db.objectStoreNames.contains("keys")) {
          db.createObjectStore("keys", {
            keyPath: "kid",
            autoIncrement: true,
          });
        }
      },
    });
  }
  return null;
}

const storagePromise = initializeStorage();
export default storagePromise;