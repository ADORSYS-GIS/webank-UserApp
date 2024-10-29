import { StorageFactory } from '@adorsys-gis/storage';
import { DBSchema } from 'idb';
import generateKeyPair from './generateKey'; // Import your existing key generation function

interface MyDatabase extends DBSchema {
  keys: {
    key: number; // Represents a unique identifier for the key record
    value: {
      Key: JsonWebKey; // Key in JWK format
    };
  };
}

// Initialize the storage with the schema
const storage: StorageFactory<MyDatabase> = new StorageFactory<MyDatabase>('KeysDB', 1, {
  upgrade: (db) => {
    if (!db.objectStoreNames.contains('keys')) {
      db.createObjectStore('keys', {
        keyPath: 'keyId',
        autoIncrement: true // Use 'key' as a unique identifier for the record
      });
    }
  },
});

// Function to store a key pair in IndexedDB
export async function storeKeyPair() {
  console.log("App installed successfully. Generating key pair...");

  const { publicKey, privateKey } = await generateKeyPair(); // This should return the keys in JWK format
  console.log("Key pair generated successfully.");

  // Store the key pair in IndexedDB directly
  await storage.insert('keys', {
    value: {
      pub: { ...publicKey }, // Directly use the public key
    }
  });

  await storage.insert('keys', {
    value: {
      priv: { ...privateKey }, // Directly use the private key
    }
  });

  console.log("Key pair stored successfully with key ID");
}

// Function to retrieve a key pair by its key ID from IndexedDB
export async function retrieveKeyPair(keyId: number) {
  const retrievedRecord = await storage.findOne('keys', keyId);

  if (retrievedRecord) {
    console.log("Retrieved key pair:", retrievedRecord.value);
  } else {
    console.error("No key pair found with key ID:", keyId);
  }
  return retrievedRecord?.value || null;
}

export default storeKeyPair;
