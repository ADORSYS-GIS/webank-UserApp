import { OpenAPI } from "@openapi/generated/obs/requests/core/OpenAPI";
import { generateJWT } from "@services/keyManagement/jwtService";
import { KeyManagement } from "@services/keyManagement/keyManagement";

OpenAPI.interceptors.request.use(async (config) => {
  const url = config.url ?? "";
  const data = config.data ?? {};
  const deviceCert = localStorage.getItem("devCert");
  const accountCert = localStorage.getItem("accountCert");
  const kycCert = localStorage.getItem("kycCert");
  const transactionCert = localStorage.getItem("transactionCert");
  let jwt: string | null = null;

  // OBS endpoints only
  if (url.includes("/registration")) {
    const { publicKey, privateKey } = await KeyManagement();
    jwt = await generateJWT(
      privateKey,
      publicKey,
      deviceCert,
      null,
      null,
      null,
      null,
      null,
    );
    console.log("Generated JWT for OBS registration:", jwt);
  } else if (
    url.includes("/accounts/balance") ||
    url.includes("/accounts/transactions")
  ) {
    const accId = data.accountID;
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
      accId,
    );
  } else if (url.includes("/transfers/payout")) {
    const clientAccountId = data.recipientAccountId;
    const amount = data.amount;
    const agentAccountId = data.senderAccountId;
    const { publicKey, privateKey } = await KeyManagement();
    jwt = await generateJWT(
      privateKey,
      publicKey,
      null,
      null,
      accountCert,
      null,
      kycCert,
      null,
      clientAccountId,
      amount,
      agentAccountId,
    );
    console.log("Generated JWT for OBS payout:", jwt);
  } else if (url.includes("/accounts/withdraw")) {
    const clientAccountId = data.recipientAccountId;
    const amount = data.amount;
    const agentAccountId = data.senderAccountId;
    const { publicKey, privateKey } = await KeyManagement();
    jwt = await generateJWT(
      privateKey,
      publicKey,
      null,
      null,
      accountCert,
      transactionCert,
      null,
      null,
      agentAccountId,
      amount,
      clientAccountId,
    );
    console.log("Generated JWT for OBS account withdrawal:", jwt);
  } else if (url.includes("/accounts/recovery")) {
    const { publicKey, privateKey } = await KeyManagement();
    const accountId = data.accountId;
    jwt = await generateJWT(
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
    console.log("Generated JWT for OBS account deposit:", jwt);
  } else if (url.includes("/agent/topup")) {
    const agentId = data.accountId;
    const amount = data.amount;
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
      agentId,
      amount,
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
