import CryptoJS from "crypto-js";

/**
 * Perform Proof of Work (PoW) computation.
 * @param initiationNonce - The initiation nonce received from the backend.
 * @param devicePub - The public key of the client device.
 * @param difficulty - Number of leading zeros required in the hash.
 * @returns {Promise<{powHash: string, powNonce: number}>}
 */
export async function performProofOfWork(
  initiationNonce: string,
  devicePub: string,
  difficulty: number,
): Promise<{ powHash: string; powNonce: number }> {
  const target = "0".repeat(difficulty);
  let powNonce = 0;
  let powHash = "";

  const start = Date.now();
  // Iterate until a hash matching the difficulty is found
  // eslint-disable-next-line no-constant-condition
  while (true) {
    // Combine inputs to generate a hash
    const input = `${initiationNonce}:${devicePub}:${powNonce}`;
    powHash = CryptoJS.SHA256(input).toString(CryptoJS.enc.Hex);

    // Check if hash meets the difficulty
    if (powHash.startsWith(target)) {
      console.log(`Proof of Work completed in ${(Date.now() - start) / 1000}s`);
      break;
    }

    powNonce++;

    // Optional: Log progress every 1M attempts
    if (powNonce % 1_000_000 === 0) {
      console.log(`Attempts: ${powNonce}`);
    }
  }

  return { powHash, powNonce };
}
