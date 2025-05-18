import { StorageFactory } from "@adorsys-gis/storage";
import type { DBSchema } from "idb";
import type { RootState } from '@wua/store/Store.ts';

export interface WebankDatabase extends DBSchema {
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
  redux: {
    key: string;
    value: RootState
  };
}

// Initialize the storage with the schema
const storage: StorageFactory<WebankDatabase> = new StorageFactory<WebankDatabase>(
  "webank",
  1,
  {
    upgrade: (db) => {
      if (!db.objectStoreNames.contains("keys")) {
        db.createObjectStore("keys", {
          keyPath: "kid",
          autoIncrement: true,
        });
      }

      if (!db.objectStoreNames.contains("redux")) {
        db.createObjectStore("redux");
      }
    },
  },
);

export default storage;
