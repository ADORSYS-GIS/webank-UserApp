import * as jose from "jose";

async function generateKeyPair() {
  // Generate an RSA key pair
  const { publicKey, privateKey } = await jose.generateKeyPair("ES256", {
    extractable: true,
  });

  // Convert keys to JSON format
  const publicJWK = await jose.exportJWK(publicKey);
  const privateJWK = await jose.exportJWK(privateKey);

  console.log("Public Key:", publicJWK);
  console.log("Private Key:", privateJWK);

  // Return both keys
  return { publicKey: publicJWK, privateKey: privateJWK };
}

export default generateKeyPair;
