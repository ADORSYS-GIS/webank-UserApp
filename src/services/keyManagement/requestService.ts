import { generateJWT } from "./jwtService";
import storeKeyPair, { retrieveKeyPair } from "./storeKey";
import checkKeyPairExists from "./checkKeyPairExists";
import { initiateRegistration, sendOTP, validateOTP } from "./apiService";

let Key: string | null = null;

export async function KeyManagement() {
  const keyPairExists = await checkKeyPairExists();

  if (!keyPairExists) {
    await storeKeyPair();
  }

  const { publicKey, privateKey } = await retrieveKeyPair(1);

  if (!publicKey || !privateKey) {
    throw new Error("Failed to retrieve key pair.");
  }

  return { publicKey, privateKey };
}

export async function RequestToSendOTP(phoneNumber: string): Promise<string> {
  const { publicKey, privateKey } = await KeyManagement();

  Key = JSON.stringify(publicKey);

  const jwtToken = await generateJWT(privateKey, publicKey, phoneNumber);

  return await sendOTP(phoneNumber, jwtToken, Key);
}

export async function RequestToSendNonce(): Promise<string> {
  const number = "hello world";
  const date = new Date();
  const timeStamp = date.toISOString();
  console.log(timeStamp);
  const { publicKey, privateKey } = await KeyManagement();
  const jwtToken = await generateJWT(privateKey, publicKey, timeStamp, number);
  return await initiateRegistration(timeStamp, jwtToken);
}

export async function RequestToValidateOTP(
  phoneNumber: string,
  otp: string,
  otpHash: string,
): Promise<string> {
  const { publicKey, privateKey } = await KeyManagement();

  Key = JSON.stringify(publicKey);

  const jwtToken = await generateJWT(privateKey, publicKey, phoneNumber);

  return await validateOTP(phoneNumber, Key, otp, otpHash, jwtToken);
}

export const getKey = () => Key;
