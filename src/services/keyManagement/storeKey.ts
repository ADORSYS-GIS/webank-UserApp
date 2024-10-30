import storage from "./storageSetup"; // Import the initialized storage
import generateKeyPair from "./generateKey"; // Import your existing key generation function

// Function to store a key pair in IndexedDB
export async function storeKeyPair() {
  const { publicKey, privateKey } = await generateKeyPair(); // Generate the key pair

  // Store both keys in a single record in IndexedDB
  await storage.insert("keys", {
    value: {
      pub: { ...publicKey }, // Store public key
      priv: { ...privateKey }, // Store private key
    },
  });

  console.log("Key pair stored successfully in IndexedDB.");
}

// Function to retrieve the key pair from IndexedDB
export async function retrieveKeyPair(keyId: number) {
  const retrievedRecord = await storage.findOne("keys", keyId);

  if (retrievedRecord) {
    const { pub: publicKey, priv: privateKey } = retrievedRecord.value; // Destructure the keys
    console.log("Retrieved public key:", publicKey);
    console.log("Retrieved private key:", privateKey);

    return { publicKey, privateKey }; // Return keys separately
  } else {
    console.error("No key pair found with key ID:", keyId);
  }

  return { publicKey: null, privateKey: null }; // Return null if not found
}

export default storeKeyPair;
