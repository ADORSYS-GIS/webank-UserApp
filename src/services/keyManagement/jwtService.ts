import * as jose from "jose";
import CryptoJS from "crypto-js";

function hashPayload(payload: string): string {
  return CryptoJS.SHA256(payload).toString(CryptoJS.enc.Hex);
}

// prettier-ignore
export async function generateJWT( //NOSONAR
  privateKeyJWK: jose.JWK,
  publicKeyJWK: jose.JWK,
  devJwt?: string | null,
  phoneNumberJwt?: string | null,
  accountJwt?: string | null,
  transactionJwt?: string | null,
  kycJwt?: string | null,
  ...data: Array<string | number>
): Promise<string> {
  // Hash the payload
  let concatenatedString = "";
  data.forEach((element) => {
    concatenatedString += element;
  });
  const hashedPayload = hashPayload(concatenatedString);
  console.log(concatenatedString);
  console.log(hashedPayload);

  // Create the JWT payload
  const jwtPayload = {
    hash: hashedPayload,
  };

  try {
    // Convert the private key JWK to a CryptoKey
    const privateKey = await jose.importJWK(privateKeyJWK, "ES256");

    // Prepare the JWT header
    const header: jose.JWTHeaderParameters = {
      typ: "JWT",
      alg: "ES256",
      jwk: publicKeyJWK,
    };

    // If devJwt is provided, add it to the header
    if (devJwt) {
      header["devJwt"] = devJwt;
    }
    if (phoneNumberJwt) {
      header["phoneNumberJwt"] = phoneNumberJwt;
    }
    if (accountJwt) {
      header["accountJwt"] = accountJwt;
    }
    if (transactionJwt) {
      header["transactionJwt"] = transactionJwt;
    }

    if (kycJwt) {
      header["kycJwt"] = kycJwt;
    }

    // Sign the JWT with the private key and custom header
    const jwt = await new jose.SignJWT(jwtPayload)
      .setProtectedHeader(header)
      .sign(privateKey);

    return jwt;
  } catch (error) {
    console.error("Error generating JWT:", error);
    throw new Error("Failed to generate JWT.");
  }
}
