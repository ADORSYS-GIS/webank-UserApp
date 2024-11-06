import storage from "./storageSetup";

// Function to check if a key pair exists in IndexedDB
export async function checkKeyPairExists(): Promise<boolean> {
  const count = await storage.count("keys"); // Count the number of records in 'keys' store
  return count > 0; // Return true if at least one key pair exists
}

export default checkKeyPairExists;
