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
  getTransactionHistory,
  TopupAccount,
  WithdrawOffline,
  getOtps,
  getKycRecords,
  UpdateKycStatus,
  getKycDocuments,
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
    null,
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
  deviceCert: string | null,
): Promise<string> {
  const { publicKey, privateKey } = await KeyManagement();

  Key = JSON.stringify(publicKey);

  const jwtToken = await generateJWT(
    privateKey,
    publicKey,
    deviceCert,
    null,
    null,
    null,
    phoneNumber,
    otp,
  );
  console.log(otp);
  return await validateOTP(phoneNumber, otp, jwtToken);
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
    null,
    null,
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

  const jwtToken = await generateJWT(
    privateKey,
    publicKey,
    null,
    null,
    accountCert,
    null,
    accountId,
  );
  console.log(jwtToken + "Account Cert!!!");
  console.log(accountId + "Account ID !!!");
  return await getAccountBalance(accountId, jwtToken);
}

// Function to retrieve transaction history
export async function RequestToGetTransactionHistory(
  accountId: string,
  accountCert?: string | null,
): Promise<string> {
  const { publicKey, privateKey } = await KeyManagement();

  Key = JSON.stringify(publicKey);

  const jwtToken = await generateJWT(
    privateKey,
    publicKey,
    null,
    null,
    accountCert,
    null,
    accountId,
  );
  console.log(jwtToken + "Account Cert!!!");
  console.log(accountId + "Account ID !!!");
  return await getTransactionHistory(accountId, jwtToken);
}

// Function to top up an account
export async function RequestToTopup(
  clientAccountId: string,
  amount: number,
  agentAccountId: string,
  agentAccountCert?: string | null,
): Promise<string> {
  const { publicKey, privateKey } = await KeyManagement();

  Key = JSON.stringify(publicKey);

  const jwtToken = await generateJWT(
    privateKey,
    publicKey,
    null,
    null,
    agentAccountCert,
    null,
    clientAccountId,
    amount,
    agentAccountId,
  );
  console.log(jwtToken + "Account Cert!!!");
  console.log(clientAccountId + "Account ID !!!");
  return await TopupAccount(clientAccountId, amount, agentAccountId, jwtToken);
}

// Request to Withdraw Offline.
export async function RequestToWithdrawOffline(
  clientAccountId: string,
  amount: number,
  agentAccountId: string,
  agentAccountCert?: string | null,
  transactionJwt?: string | null,
): Promise<string> {
  const { publicKey, privateKey } = await KeyManagement();

  Key = JSON.stringify(publicKey);

  const jwtToken = await generateJWT(
    privateKey,
    publicKey,
    null,
    null,
    agentAccountCert,
    transactionJwt,
    clientAccountId,
    amount,
    agentAccountId,
  );
  console.log(jwtToken + "Account Cert!!!");
  console.log(clientAccountId + "Account ID !!!");
  console.log(agentAccountId + "AgentAccount ID !!!");
  console.log(transactionJwt + "Signed Transaction");
  return await WithdrawOffline(
    clientAccountId,
    amount,
    agentAccountId,
    jwtToken,
  );
}

// Function to get otps for phonenumbers
export async function RequestToGetOtps(
  accountCert?: string | null,
): Promise<string> {
  const { publicKey, privateKey } = await KeyManagement();

  Key = JSON.stringify(publicKey);

  const jwtToken = await generateJWT(
    privateKey,
    publicKey,
    null,
    null,
    accountCert,
    null,
    
  );
  console.log(jwtToken + "Account Cert!!!");
  return await getOtps(jwtToken);
}

// Function to get otps for phonenumbers
export async function RequestToGetKycRecords(
  accountCert?: string | null,
): Promise<string> {
  const { publicKey, privateKey } = await KeyManagement();

  Key = JSON.stringify(publicKey);

  const jwtToken = await generateJWT(
    privateKey,
    publicKey,
    null,
    null,
    accountCert,
    null,
  );
  console.log(jwtToken + "Account Cert!!!");
  return await getKycRecords(jwtToken);
}

export async function RequestToGetKycDocuments(
  publicKeyHash: string,
  accountCert?: string | null,
): Promise<string> {
  const { publicKey, privateKey } = await KeyManagement();

  Key = JSON.stringify(publicKey);

  const jwtToken = await generateJWT(
    privateKey,
    publicKey,
    null,
    null,
    accountCert,
    null,
    publicKeyHash,
  );
  console.log(jwtToken + "Account Cert!!!");
  return await getKycDocuments(publicKeyHash, jwtToken);
}

export async function RequestToUpdateKycStatus(
  publicKeyHash: string,
  status: string,
  accountCert?: string | null,
): Promise<string> {
  const { publicKey, privateKey } = await KeyManagement();

  Key = JSON.stringify(publicKey);

  const jwtToken = await generateJWT(
    privateKey,
    publicKey,
    null,
    null,
    accountCert,
    null,
    publicKeyHash,
    status
  );
  console.log(jwtToken + "Account Cert!!!");
  return await UpdateKycStatus( publicKeyHash, status, jwtToken);
}
export const getKey = () => Key;
