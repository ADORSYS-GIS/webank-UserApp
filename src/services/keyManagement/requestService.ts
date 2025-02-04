import { generateJWT } from "./jwtService";
import storeKeyPair, { retrieveKeyPair } from "./storeKey";
import checkKeyPairExists from "./checkKeyPairExists";
import {
  createBankAccount,
  getAccountBalance,
  initiateRegistration,
  sendOTP,
  validateDeviceRegistration,
  validateOTP,
} from "./apiService";

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

export async function RequestToSendOTP(
  phoneNumber: string,
  deviceCert: string | null,
): Promise<string> {
  const { publicKey, privateKey } = await KeyManagement();

  Key = JSON.stringify(publicKey);

  const jwtToken = await generateJWT(
    privateKey,
    publicKey,
    deviceCert,
    null,
    phoneNumber,
  );
  console.log(jwtToken, "jwt token");
  console.log(deviceCert, "device cert");

  return await sendOTP(phoneNumber, jwtToken, Key);
}

export async function RequestToSendNonce(): Promise<string> {
  const date = new Date();
  const timeStamp = date.toISOString();
  console.log(timeStamp);
  const { publicKey, privateKey } = await KeyManagement();
  const jwtToken = await generateJWT(
    privateKey,
    publicKey,
    null,
    null,
    timeStamp,
  );
  return await initiateRegistration(timeStamp, jwtToken);
}

export const RequestToSendPowJWT = async (
  initiationNonce: string,
  powHash: string,
  powNonce: string,
): Promise<string> => {
  try {
    const { publicKey, privateKey } = await KeyManagement();

    const jwtToken = await generateJWT(
      privateKey,
      publicKey,
      null,
      null,
      initiationNonce,
      powHash,
      powNonce,
    );
    console.log(jwtToken);

    return await validateDeviceRegistration(
      initiationNonce,
      powHash,
      powNonce,
      jwtToken,
    );
  } catch (error) {
    console.error("Error constructing and sending PoW jwt:", error);
    throw new Error("Failed to construct and send PoW jwt");
  }
};

export async function RequestToValidateOTP(
  phoneNumber: string,
  otp: string,
  otpHash: string,
  deviceCert: string | null,
): Promise<string> {
  const { publicKey, privateKey } = await KeyManagement();

  Key = JSON.stringify(publicKey);

  const jwtToken = await generateJWT(
    privateKey,
    publicKey,
    deviceCert,
    null,
    phoneNumber,
    otp,
    otpHash,
  );
  console.log(otp);
  return await validateOTP(phoneNumber, otp, otpHash, jwtToken);
}

export async function RequestToCreateBankAccount(
  phoneNumber: string,
  deviceCert?: string | null,
  phoneNumberCert?: string | null,
): Promise<string> {
  const { publicKey, privateKey } = await KeyManagement();

  Key = JSON.stringify(publicKey);

  const jwtToken = await generateJWT(
    privateKey,
    publicKey,
    deviceCert,
    phoneNumberCert,
    phoneNumber,
    Key,
  );

  return await createBankAccount(phoneNumber, Key, jwtToken);
}

export async function RequestToGetBalance(
  accountId: string,
  accountCert?: string | null,
): Promise<string> {
  const { publicKey, privateKey } = await KeyManagement();

  Key = JSON.stringify(publicKey);

  const jwtToken = await generateJWT(privateKey, publicKey, accountCert);
  return await getAccountBalance(accountId, jwtToken);
}
export const getKey = () => Key;
