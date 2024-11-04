import { describe, it, expect } from "vitest"; // Import necessary functions from Vitest
import storage from "../storageSetup"; // Import the initialized storage
import { storeKeyPair, retrieveKeyPair } from "../storeKey"; // Adjust the import to the correct module path

describe("Key Pair Storage Tests", () => {
  it("should store and retrieve a key pair correctly", async () => {
    // Step 1: Store a key pair
    await storeKeyPair(); // Call the function to store the key pair

    // Step 2: Retrieve the keys stored in IndexedDB
    const storedKeys = await storage.findAll("keys"); // Get all records from the 'keys' store
    expect(storedKeys).toHaveLength(1); // Check that one key pair is stored

    const { value } = storedKeys[0]; // Get the stored record
    const { pub: publicKey, priv: privateKey } = value; // Destructure keys from the stored value

    // Step 3: Ensure the public and private keys are not null
    expect(publicKey).toBeDefined();
    expect(privateKey).toBeDefined();

    // Step 4: Retrieve the key pair using the key ID
    const retrievedKeys = await retrieveKeyPair(1); // Use the ID from the stored record
    expect(retrievedKeys.publicKey).toEqual(publicKey); // Check if the retrieved public key matches
    expect(retrievedKeys.privateKey).toEqual(privateKey); // Check if the retrieved private key matches
  });

  it("should return null for a non-existent key ID", async () => {
    const retrievedKeys = await retrieveKeyPair(999); // Attempt to retrieve with a non-existent ID
    expect(retrievedKeys.publicKey).toBeNull(); // Expect public key to be null
    expect(retrievedKeys.privateKey).toBeNull(); // Expect private key to be null
  });
});
