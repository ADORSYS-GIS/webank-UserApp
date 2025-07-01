import { OpenAPI } from "@openapi/generated/prs/requests/core/OpenAPI";
import { generateJWT } from "@services/keyManagement/jwtService";
import { KeyManagement } from "@services/keyManagement/keyManagement";

OpenAPI.interceptors.request.use(async (config) => {
  const url = config.url ?? "";
  const data = config.data ?? {};
  const deviceCert = localStorage.getItem("devCert");
  const accountCert = localStorage.getItem("accountCert");
  const kycCert = localStorage.getItem("kycCert");
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
  } else if (url.includes("/accounts/balance")) {
    const accId = data.accountId;
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
      accId,
    );
  } else if (url.includes("/accounts/payout")) {
    const clientAccountId = data.clientAccountId;
    const amount = data.amount;
    const agentAccountId = data.agentAccountId;
    const accountCertVal = accountCert;
    const kycCertVal = kycCert;
    const { publicKey, privateKey } = await KeyManagement();
    jwt = await generateJWT(
      privateKey,
      publicKey,
      null,
      null,
      accountCertVal,
      null,
      kycCertVal,
      null,
      clientAccountId,
      amount,
      agentAccountId,
    );
  } else if (url.includes("/accounts/withdraw")) {
    const clientAccountId = data.clientAccountId;
    const amount = data.amount;
    const agentAccountId = data.agentAccountId;
    const accountCertVal = accountCert;
    const transactionJwt = data.transactionJwt;
    const { publicKey, privateKey } = await KeyManagement();
    jwt = await generateJWT(
      privateKey,
      publicKey,
      null,
      null,
      accountCertVal,
      transactionJwt,
      null,
      null,
      clientAccountId,
      amount,
      agentAccountId,
    );
  } else if (url.includes("/kyc/agent/topup")) {
    const agentId = data.agentId;
    const amount = data.amount;
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
