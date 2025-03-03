import { KeyManagement } from "./requestService";
import { generateSignedSignatureJWT } from "./signedSigntaureJwt";

export async function signTransaction(
  accountId: string,
  amount: number,
  accountJwt: string,
): Promise<string> {
  try {
    // Fetch private key from KeyManagement
    const { publicKey, privateKey } = await KeyManagement();

    // Generate expiration time 5 minutes from now
    const expirationTime = Math.floor(Date.now() / 1000) + 5 * 60;

    // Generate a random nonce
    const nonce = generateSecureNonce(8);

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
      publicKey,
      accountJwt,
      payloadData,
    );

    return jwt;
  } catch (error) {
    console.error("Error signing transaction:", error);
    throw new Error("Failed to sign transaction");
  }

  /**
   * Generates a cryptographically secure nonce.
   * Works in both browser and Node.js environments.
   *
   * @param length - The number of bytes to generate.
   * @returns A hexadecimal string representation of the random bytes.
   */
  function generateSecureNonce(length: number): string {
    const array = new Uint8Array(length); // Use 8 bytes (64 bits) by default
    window.crypto.getRandomValues(array); // Fill the array with random values
    return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join(
      "",
    ); // Convert to hex string
  }
}
