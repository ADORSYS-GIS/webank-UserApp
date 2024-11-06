import * as jose from "jose";
import CryptoJS from "crypto-js";

function hashPayload(payload: string): string {
  return CryptoJS.SHA256(JSON.stringify(payload)).toString(CryptoJS.enc.Hex);
}

export async function generateJWT(
  data: string,
  privateKeyJWK: jose.JWK,
): Promise<string> {
  // Hash the payload
  const hashedPayload = hashPayload(data);

  // Create the JWT payload
  const jwtPayload = {
    hash: hashedPayload,
  };

  try {
    // Convert the private key JWK to a CryptoKey
    const privateKey = await jose.importJWK(privateKeyJWK, "ES256");

    // Sign the JWT with the private key
    const jwt = await new jose.SignJWT(jwtPayload)
      .setProtectedHeader({ alg: "ES256" })
      .sign(privateKey);

    return jwt;
  } catch (error) {
    console.error("Error generating JWT:", error);
    throw new Error("Failed to generate JWT.");
  }
}
