import { StorageFactory } from "@adorsys-gis/storage";
import { DBSchema } from "idb";

interface MyDatabase extends DBSchema {
  keys: {
    key: number; // Represents a unique identifier for the key record
    value: {
      pub: JsonWebKey; // Public Key in JWK format
      priv: JsonWebKey; // Private Key in JWK format
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
          keyPath: "id",
        });
      }
    },
  },
);

export default storage;
