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
  sendEmailOTP,
  verifyEmailCode,
  storeKYCInfo,
  getUserLocation,
  storeKycDocument,
  getKycRecords,
  UpdateKycStatus,
  getKycDocuments,
  getKycCert,

  submitRecoveryToken,
  recoverAccountCert,

  GetKycRecordsBySearch,

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
  console.log(timeStamp, "timeStamp");
  const { publicKey, privateKey } = await KeyManagement();
  const jwtToken = await generateJWT(
    privateKey,
    publicKey,
    null,
    null,
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
    null,
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
    null,
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
  kycCert?: string | null,
): Promise<string> {
  const { publicKey, privateKey } = await KeyManagement();

  Key = JSON.stringify(publicKey);

  const jwtToken = await generateJWT(
    privateKey,
    publicKey,
    null,
    null,
    null,
    null,
    kycCert,
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
  kycCert?: string | null,
  transactionJwt?: string | null,
): Promise<string> {
  const { publicKey, privateKey } = await KeyManagement();

  Key = JSON.stringify(publicKey);

  const jwtToken = await generateJWT(
    privateKey,
    publicKey,
    null,
    null,
    null,
    kycCert,
    null,
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
    null,
    null,
  );
  console.log(jwtToken + "Account Cert!!!");
  return await getOtps(jwtToken);
}

//Request to send Email code
export async function RequestToSendEmailOTP(
  email: string,
  accountCert: string | null,
  accountId: string,
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
    null,
    null,
    email,
    accountId,
  );
  console.log(jwtToken + "Account Cert!!!");
  console.log(accountId + "Account ID !!!");
  return await sendEmailOTP(email, accountId, jwtToken);
}

//Request to  Email code
export async function RequestToVerifyEmailCode(
  email: string,
  otp: string,
  accountId: string,
  accountCert: string | null,
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
    null,
    null,
    email,
    otp,
    accountId,
  );
  return await verifyEmailCode(email, otp, accountId, jwtToken);
}

//Request to get user Location
export async function RequestToGetUserLocation(
  accountCert: string | null,
  location: string,
  accountId: string,
): Promise<string> {
  const { publicKey, privateKey } = await KeyManagement();
  const jwtToken = await generateJWT(
    privateKey,
    publicKey,
    null,
    null,
    accountCert,
    null,
    null,
    null,
    location,
    accountId,
  );
  return await getUserLocation(jwtToken, location, accountId);
}

// prettier-ignore
export async function RequestToStoreKYCInfo( // NOSONAR
  fullName: string,
  profession: string,
  docNumber: string,
  dateOfBirth: string,
  currentRegion: string,
  expiryDate: string,
  accountCert: string | null,
  accountId: string,
): Promise<string> {
  const { publicKey, privateKey } = await KeyManagement();
  const jwtToken = await generateJWT(
    privateKey,
    publicKey,
    null,
    null,
    accountCert,
    null,
    null,
    null,
    fullName,
    profession,
    docNumber,
    dateOfBirth,
    currentRegion,
    expiryDate,
    accountId,
  );
  return await storeKYCInfo(
    fullName,
    profession,
    docNumber,
    dateOfBirth,
    currentRegion,
    expiryDate,
    accountId,
    jwtToken,
  );
}

//Store Kyc doc
export async function RequestToStoreKycDocument(
  frontId: string,
  backId: string,
  selfieId: string,
  taxId: string,
  accountCert: string | null,
  accountId: string,
): Promise<string> {
  const { publicKey, privateKey } = await KeyManagement();
  const jwtToken = await generateJWT(
    privateKey,
    publicKey,
    null,
    null,
    accountCert,
    null,
    null,
    null,
    frontId,
    backId,
    selfieId,
    taxId,
    accountId,
  );
  return await storeKycDocument(
    frontId,
    backId,
    selfieId,
    taxId,
    accountId,
    jwtToken,
  );
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
    null,
    null,
  );
  console.log(jwtToken + "Account Cert!!!");
  return await getKycRecords(jwtToken);
}

export async function RequestToGetKycRecordsBySearch(
  docNumber: string,
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
    null,
    docNumber,
  );

  console.log(jwtToken + "Account Cert!!!");
  return await GetKycRecordsBySearch(docNumber, jwtToken);
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
    null,
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
    null,
    null,
    publicKeyHash,
    status,
  );
  console.log(jwtToken + "Account Cert!!!");
  return await UpdateKycStatus(publicKeyHash, status, jwtToken);
}

export async function RequestToGetCert(
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
    null,
    null,
  );
  console.log(jwtToken + "Account Cert!!!");
  return await getKycCert(jwtToken);
}

//Request to send account recovery token
export async function RequestToSubmitRecoveryToken(
  newAccountId: string,
  recoveryToken: string,
  accountCert: string | null,
): Promise<string> {
  const { publicKey, privateKey } = await KeyManagement();

  const jwtToken = await generateJWT(
    privateKey,
    publicKey,
    null,
    null,
    accountCert,
    null,
    null,
    recoveryToken,
    newAccountId,
  );
  console.log(jwtToken, "jwt token");

  return await submitRecoveryToken(newAccountId, jwtToken);
}

//Request to get Account Cert
export async function RequestToRecoverAccountCert(
  accountId: string,
  recoveryToken: string,
): Promise<string> {
  const { publicKey, privateKey } = await KeyManagement();

  const jwtToken = await generateJWT(
    privateKey,
    publicKey,
    null,
    null,
    null,
    null,
    null,
    recoveryToken,
    accountId,
  );

  return await recoverAccountCert(jwtToken, accountId);
}
export const getKey = () => Key;
