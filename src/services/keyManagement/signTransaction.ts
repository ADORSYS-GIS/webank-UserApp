import { KeyManagement } from "./requestService";
import { generateSignedSignatureJWT } from "./signedSigntaureJwt";

export async function signTransaction(
  accountId: string,
  amount: number,
  accountJwt: string,
): Promise<string> {
  try {
    // Fetch private key from KeyManagement
    const { privateKey } = await KeyManagement();

    // Generate expiration time 5 minutes from now
    const expirationTime = Math.floor(Date.now() / 1000) + 5 * 60;

    // Generate a random nonce
    const nonce = Math.random().toString(36).substring(2, 10);

    // Prepare the payload data with hashing logic
    const payloadData = {
      accountId: { value: accountId, hash: true }, // Hash the accountId
      amount: { value: amount, hash: false }, // Do not hash the amount
      expirationTime: { value: expirationTime, hash: false }, // Do not hash the expiration time
      nonce: { value: nonce, hash: false }, // Do not hash the nonce
    };

    // Generate the JWT
    const jwt = await generateSignedSignatureJWT(
      privateKey,
      null,
      accountJwt,
      payloadData,
    );

    return jwt;
  } catch (error) {
    console.error("Error signing transaction:", error);
    throw new Error("Failed to sign transaction");
  }
}
