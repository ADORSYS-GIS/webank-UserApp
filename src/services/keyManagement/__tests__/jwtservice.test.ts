import * as jose from "jose";
import { generateJWT } from "../jwtService";
import CryptoJS from "crypto-js";

describe("JWT Generation", () => {
  it("should generate a valid JWT with a hash of the payload and a valid signature", async () => {
    // Step 1: Define test data and calculate expected hash
    const data = "+237659143005";
    const expectedHash = CryptoJS.SHA256(JSON.stringify(data)).toString(
      CryptoJS.enc.Hex,
    );

    // Step 2: Generate an ES256 key pair
    const { privateKey, publicKey } = await jose.generateKeyPair("ES256", {
      extractable: true,
    });
    // Convert privateKey to JWK for use with generateJWT
    const privateKeyJWK = await jose.exportJWK(privateKey);

    // Step 3: Call  the generateJWT function
    const jwt = await generateJWT(data, privateKeyJWK);

    // Step 4: Verify the JWT signature and payload
    const publicKeyJWK = await jose.exportJWK(publicKey); // Convert publicKey to JWK for verification
    const { payload } = await jose.jwtVerify(
      jwt,
      await jose.importJWK(publicKeyJWK, "ES256"),
      {
        algorithms: ["ES256"],
      },
    );

    // Step 5: Verify that the payload includes the expected hash
    expect(payload).toHaveProperty("hash", expectedHash);
  });
});
