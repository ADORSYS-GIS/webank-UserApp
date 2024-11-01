import storage from "./storageSetup"; // Import the initialized storage
import generateKeyPair from "./generateKey"; // Import your existing key generation function

// Function to store a key pair in IndexedDB
export async function storeKeyPair() {
  const { publicKey, privateKey } = await generateKeyPair(); // Generate the key pair

  // Store both keys in a single record in IndexedDB
  await storage.insert("keys", {
    value: {
      pub: { ...publicKey },
      priv: { ...privateKey },
    },
  });
}

// Function to retrieve the key pair from IndexedDB
export async function retrieveKeyPair(keyId: number) {
  const retrievedRecord = await storage.findOne("keys", keyId);

  if (retrievedRecord) {
    const { pub: publicKey, priv: privateKey } = retrievedRecord.value;

    return { publicKey, privateKey };
  } else {
    console.error("No key pair found with key ID:", keyId);
  }

  return { publicKey: null, privateKey: null };
}

export default storeKeyPair;
