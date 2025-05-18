import CryptoJS from 'crypto-js';
import * as jose from 'jose';

// Function to hash a string using SHA256
function hashPayload(payload: string): string {
  return CryptoJS.SHA256(payload).toString(CryptoJS.enc.Hex);
}

export async function generateSignedSignatureJWT(
  privateKeyJWK: jose.JWK,
  publicKeyJWK?: jose.JWK | null,
  accountJwt?: string | null,
  payloadData: Record<string, { value: string | number; hash?: boolean }> = {},
): Promise<string> {
  try {
    // Convert the private key JWK to a CryptoKey
    const privateKey = await jose.importJWK(privateKeyJWK, 'ES256');

    // Prepare the JWT payload
    const jwtPayload: Record<string, string | number> = {};

    // Process the payload data
    for (const [key, { value, hash }] of Object.entries(payloadData)) {
      if (hash) {
        // Hash the value if the 'hash' flag is true
        jwtPayload[key] = hashPayload(String(value));
      } else {
        // Use the raw value if no hashing is required
        jwtPayload[key] = value;
      }
    }

    // Prepare the JWT header
    const header: jose.JWTHeaderParameters = {
      typ: 'JWT',
      alg: 'ES256',
      jwk: publicKeyJWK || undefined,
    };

    // Add optional fields to the header
    if (accountJwt) {
      header['accountJwt'] = accountJwt;
    }

    // Sign the JWT with the private key and custom header
    const jwt = await new jose.SignJWT(jwtPayload)
      .setProtectedHeader(header)
      .sign(privateKey);

    return jwt;
  } catch (error) {
    console.error('Error generating JWT:', error);
    throw new Error('Failed to generate JWT.');
  }
}
