import storage from "./storageSetup"; // Import the initialized storage
import generateKeyPair from "./generateKey"; // Import your existing key generation function
import { encryptPrivateKey, decryptPrivateKey } from "./encrypt";

// Function to store a key pair in IndexedDB
export async function storeKeyPair() {
  console.log("Starting key pair generation...");
  const { publicKey, privateKey } = await generateKeyPair();
  console.log("Key pair generated successfully.");

  console.log("Encrypting private key...");
  const encryptedPriv = await encryptPrivateKey(privateKey);
  console.log("Private key encrypted successfully.");

  console.log("Storing key pair in IndexedDB...");
  await storage.insert("keys", {
    value: {
      pub: publicKey,
      priv: encryptedPriv,
      kid: 1,
    },
  });
  console.log("Key pair stored successfully.");
}

// Function to retrieve the key pair from IndexedDB
export async function retrieveKeyPair(kid: number) {
  console.log(`Retrieving key pair with ID: ${kid} from IndexedDB...`);
  const retrievedRecord = await storage.findOne("keys", kid);

  if (retrievedRecord) {
    console.log("Key pair retrieved successfully:", retrievedRecord);

    const { pub: publicKey, priv: encryptedPriv } = retrievedRecord.value;

    console.log("Decrypting private key...");
    const privateKey = await decryptPrivateKey(encryptedPriv);
    console.log("Private key decrypted successfully.");

    return { publicKey, privateKey };
  } else {
    console.error("No key pair found with key ID:", kid);
    return { publicKey: null, privateKey: null };
  }
}

export default storeKeyPair;
