import { generateJWT } from "./jwtService";
import storeKeyPair, { retrieveKeyPair } from "./storeKey";
import checkKeyPairExists from "./checkKeyPairExists";
import { sendOTP } from "./apiService";

let Key: string | null = null; // Declare `Key` at the module level for export
export async function sendOtpWithKeyManagement(
  phoneNumber: string,
): Promise<void> {
  // Check if a key pair already exists
  const keyPairExists = await checkKeyPairExists();
  let jwtToken = ""; // Initialize JWT token

  if (!keyPairExists) {
    console.log("Generating key pair...");
    await storeKeyPair();
    console.log("Key pair generated and stored successfully.");
    const { publicKey, privateKey } = await retrieveKeyPair(1);

    if (!publicKey || !privateKey) {
      throw new Error("Failed to retrieve keys from IndexedDB.");
    }

    // Generate JWT with the full phone number
    jwtToken = await generateJWT(phoneNumber, privateKey, publicKey);
    Key = JSON.stringify(publicKey);
    // Send the JWT and phone number
    const response = await sendOTP(phoneNumber, jwtToken, Key);
    console.log(response);
    return response;
  } else {
    console.log("Key pair already exists. Skipping generation.");
  }
}
// Export `Key`
export const getKey = () => Key;