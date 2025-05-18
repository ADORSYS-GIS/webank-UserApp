import * as jose from "jose";

async function generateKeyPair(kid = 1) {
  // Generate an RSA key pair
  const { publicKey, privateKey } = await jose.generateKeyPair("ES256", {
    extractable: true,
  });

  // Convert keys to JSON format
  const publicJWK = await jose.exportJWK(publicKey);
  const privateJWK = await jose.exportJWK(privateKey);

  return { publicKey: publicJWK, privateKey: privateJWK, kid };
}

export default generateKeyPair;
