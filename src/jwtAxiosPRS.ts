import { OpenAPI } from "@openapi/generated/prs/requests/core/OpenAPI";
import { generateJWT } from "@services/keyManagement/jwtService";
import { KeyManagement } from "@services/keyManagement/keyManagement";

// This file is used to generate JWTs for PRS endpoints using the OpenAPI client.
// It intercepts requests and adds the JWT to the headers based on the endpoint being called.
// It handles various PRS endpoints such as device registration, OTP validation, KYC processes,
// and account recovery, generating the appropriate JWT based on the request data.

// prettier-ignore
OpenAPI.interceptors.request.use(async (config) => {//NOSONAR
  const url = config.url ?? "";
  const data = config.data ?? {};
  const accountCert = localStorage.getItem("accountCert");
  let jwt: string | null = null;

  // PRS endpoints only
  // Device registration/init
  if (url.includes("/dev/init")) {
    const timeStamp = data.timeStamp;
    const { publicKey, privateKey } = await KeyManagement();
    jwt = await generateJWT(
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
    console.log("Generated JWT for PRS device registration:", jwt);
  } else if (url.includes("/dev/validate")) {
    const { initiationNonce, powHash, powNonce } = data ?? {};
    const { publicKey, privateKey } = await KeyManagement();
    jwt = await generateJWT(
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
    console.log("Generated JWT for PRS device validation:", jwt);
  } else if (url.includes("/otp/send")) {
    const phoneNumber = data.phoneNumber;
    const { publicKey, privateKey } = await KeyManagement();
    jwt = await generateJWT(
      privateKey,
      publicKey,
      null,
      null,
      accountCert,
      null,
      null,
      null,
      phoneNumber,
    );
  } else if (url.includes("/otp/validate")) {
    const phoneNumber = data.phoneNumber;
    const otpInput = data.otpInput;
    const { publicKey, privateKey } = await KeyManagement();
    jwt = await generateJWT(
      privateKey,
      publicKey,
      null,
      null,
      accountCert,
      null,
      null,
      null,
      phoneNumber,
      otpInput,
    );
  } else if (url.includes("/email-otp/send")) {
    const email = data.email;
    const accountId = data.accountId;
    const { publicKey, privateKey } = await KeyManagement();
    jwt = await generateJWT(
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
    console.log("Generated JWT for PRS email-otp send:", jwt);
  } else if (url.includes("/email-otp/validate")) {
    const email = data.email;
    const otpInput = data.otpInput;
    const accountId = data.accountId;
    const { publicKey, privateKey } = await KeyManagement();
    jwt = await generateJWT(
      privateKey,
      publicKey,
      null,
      null,
      accountCert,
      null,
      null,
      null,
      email,
      otpInput,
      accountId,
    );
  } else if (url.includes("/kyc/location")) {
    const location = data.location;
    const accId = data.accountId;
    const { publicKey, privateKey } = await KeyManagement();
    jwt = await generateJWT(
      privateKey,
      publicKey,
      null,
      null,
      accountCert,
      null,
      null,
      null,
      location,
      accId,
    );
  } else if (url.includes("/kyc/info")) {
    const docNumber = data.idNumber;
    const expiryDate = data.expiryDate;
    const accountIdVal = data.accountId;
    const { publicKey, privateKey } = await KeyManagement();
    jwt = await generateJWT(
      privateKey,
      publicKey,
      null,
      null,
      accountCert,
      null,
      null,
      null,
      docNumber,
      expiryDate,
      accountIdVal,
    );
  } else if (url.includes("/kyc/documents")) {
    const { frontId, backId, selfieId, taxId, accountId: accId } = data;
    const { publicKey, privateKey } = await KeyManagement();
    jwt = await generateJWT(
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
      accId,
    );
  } else if (url.includes("/kyc/status")) {
    const { docNumber, expiryDate, accountId: accId, status, reason } = data;
    const { publicKey, privateKey } = await KeyManagement();
    jwt = await generateJWT(
      privateKey,
      publicKey,
      null,
      null,
      accountCert,
      null,
      null,
      null,
      docNumber,
      expiryDate,
      accId,
      status,
      reason,
    );
  } else if (url.includes("/kyc/pending") || url.includes("/kyc/search")) {
    const docNumber = data.docNumber;
    const { publicKey, privateKey } = await KeyManagement();
    jwt = await generateJWT(
      privateKey,
      publicKey,
      null,
      null,
      accountCert,
      null,
      null,
      null,
      docNumber,
    );
  } else if (url.includes("/kyc/cert")) {
    const { publicKey, privateKey } = await KeyManagement();
    jwt = await generateJWT(
      privateKey,
      publicKey,
      null,
      null,
      accountCert,
      null,
      null,
      null,
    );
  } else if (url.includes("/recovery/token")) {
    const oldAccountId = data.oldAccountId;
    const newAccountId = data.newAccountId;
    const accountCertVal = accountCert;
    const { publicKey, privateKey } = await KeyManagement();
    jwt = await generateJWT(
      privateKey,
      publicKey,
      null,
      null,
      accountCertVal,
      null,
      null,
      null,
      oldAccountId,
      newAccountId,
    );
  } else if (url.includes("/recovery/validate")) {
    const newAccountId = data.newAccountId;
    const recoveryToken = data.recoveryToken;
    const accountCertVal = accountCert;
    const { publicKey, privateKey } = await KeyManagement();
    jwt = await generateJWT(
      privateKey,
      publicKey,
      null,
      null,
      accountCertVal,
      null,
      null,
      recoveryToken,
      newAccountId,
    );
  } else if (url.includes("/recovery/cert")) {
    const accId = data.accountId;
    const { publicKey, privateKey } = await KeyManagement();
    jwt = await generateJWT(
      privateKey,
      publicKey,
      null,
      null,
      null,
      null,
      null,
      accId,
    );
  }

  if (jwt) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${jwt}`,
    };
  }
  return config;
});

export default OpenAPI;
