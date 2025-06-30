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

// Initialize the storage with the schema
const storage: StorageFactory<MyDatabase> = new StorageFactory<MyDatabase>(
  "KeysDB",
  1,
  {
    upgrade: (db) => {
      if (!db.objectStoreNames.contains("keys")) {
        db.createObjectStore("keys", {
          keyPath: "kid",
          autoIncrement: true,
        });
      }
    },
  },
);

export default storage;
