import { generateJWT } from "./jwtService";
import storeKeyPair, { retrieveKeyPair } from "./storeKey";
import checkKeyPairExists from "./checkKeyPairExists";
import { sendOTP, validateOTP } from "./apiService";

let Key: string | null = null; // Declare `Key` at the module level for export
export async function KeyManagement(
  phoneNumber: string,
) {
  // Check if a key pair already exists
  const keyPairExists = await checkKeyPairExists();
  let jwtToken = ""; // Initialize JWT token

  if (!keyPairExists) {
    console.log("Generating key pair...");
    await storeKeyPair();
    console.log("Key pair generated and stored successfully.");
  }

  // Retrieve the key pair
  const { publicKey, privateKey } = await retrieveKeyPair(1);

  // Throw an error if the key pair is not found
  if (!publicKey || !privateKey) {
    throw new Error("Failed to retrieve key pair.");
  }

  // Generate JWT with the full phone number
  jwtToken = await generateJWT(phoneNumber, privateKey, publicKey);

  return { jwtToken, publicKey  };
}

export async function RequestToSendOTP (phoneNumber: string) {
  const { jwtToken, publicKey } = await KeyManagement(phoneNumber);

  Key = JSON.stringify(publicKey);

  const otpHash = await sendOTP(phoneNumber, jwtToken, Key);

  return otpHash;
}

export async function RequestToValidateOTP (phoneNumber: string, otp: string, otpHash: string) {
  const { publicKey, jwtToken } = await KeyManagement(phoneNumber);
  
  Key = JSON.stringify(publicKey);

  const reponse = await validateOTP(phoneNumber, Key, otp, otpHash, jwtToken);
  
  return reponse;
}

// Export `Key`
export const getKey = () => Key;