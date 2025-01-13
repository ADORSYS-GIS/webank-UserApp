import { generateJWT } from "./jwtService";
import storeKeyPair, { retrieveKeyPair } from "./storeKey";
import checkKeyPairExists from "./checkKeyPairExists";
import { sendOTP, validateOTP } from "./apiService";

let Key: string | null = null;

export async function KeyManagement(phoneNumber: string) {
  const keyPairExists = await checkKeyPairExists();
  let jwtToken = "";

  if (!keyPairExists) {
    await storeKeyPair();
  }

  const { publicKey, privateKey } = await retrieveKeyPair(1);

  if (!publicKey || !privateKey) {
    throw new Error("Failed to retrieve key pair.");
  }

  jwtToken = await generateJWT(phoneNumber, privateKey, publicKey);

  return { jwtToken, publicKey };
}

export async function RequestToSendOTP(phoneNumber: string): Promise<string> {
  const { jwtToken, publicKey } = await KeyManagement(phoneNumber);

  Key = JSON.stringify(publicKey);

  return await sendOTP(phoneNumber, jwtToken, Key);
}

export async function RequestToValidateOTP(
  phoneNumber: string,
  otp: string,
  otpHash: string,
): Promise<boolean> {
  const { publicKey, jwtToken } = await KeyManagement(phoneNumber);

  Key = JSON.stringify(publicKey);

  return await validateOTP(phoneNumber, Key, otp, otpHash, jwtToken);
}

export const getKey = () => Key;
