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
  verifyEmailCode,storeKYCInfo, getUserLocation, storeKycDocument,

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

//Request to send Email code
export async function RequestToSendEmailOTP(
    email: string,
    accountCert: string | null): Promise<string> {
    const { publicKey, privateKey } = await KeyManagement();
    Key = JSON.stringify(publicKey);
    const jwtToken = await generateJWT(
        privateKey,
        publicKey,
        null,
        null,
        accountCert,
        null, email);
    return await sendEmailOTP(email, jwtToken, Key);
}

//Request to  Email code
export async function RequestToVerifyEmailCode(
    email: string,
    otp: string,
    accountCert: string | null): Promise<string> {
    const { publicKey, privateKey } = await KeyManagement();

    Key = JSON.stringify(publicKey);
    const jwtToken = await generateJWT(
        privateKey,
        publicKey,
        null,
        null,
        accountCert,
        null,
        email,
        otp);
    return await verifyEmailCode(email, otp, jwtToken);
}

//Request to get user Location
export async function RequestToGetUserLocation(
    accountCert: string | null): Promise<string> {
    const { publicKey, privateKey } = await KeyManagement();
    const jwtToken = await generateJWT(
      privateKey,
      publicKey,
      null,
      null,
      accountCert,
      null);
  return await getUserLocation(jwtToken);
}


export async function RequestToStoreKYCInfo(
    fullName: string,
    profession: string,
    docNumber: string,
    dateOfBirth: string,
    currentRegion: string,
    expiryDate: string,
    accountCert: string | null
): Promise<string> {
  const { publicKey, privateKey } = await KeyManagement();
  const jwtToken = await generateJWT(
      privateKey,
      publicKey,
      null,
      null,
      accountCert,
      null
  );
  return await storeKYCInfo(
      fullName,
      profession,
      docNumber,
      dateOfBirth,
      currentRegion,
      expiryDate,
      jwtToken
  );
}

//Store Kyc doc
export async function RequestToStoreKycDocument(documentData: never, documentType: string, accountCert: string | null): Promise<string> {
  const { publicKey, privateKey } = await KeyManagement();
  const jwtToken = await generateJWT(
      privateKey,
      publicKey,
      null,
      null,
      accountCert,
      null
  );
  return await storeKycDocument(documentData, jwtToken, documentType);
}
export const getKey = () => Key;
