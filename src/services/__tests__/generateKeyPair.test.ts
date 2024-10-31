import generateKeyPair from "../keyManagement/generateKey";
describe("generateKeyPair", () => {
  it("should generate a valid RSA key pair", async () => {
    const { publicJWK, privateJWK } = await generateKeyPair();

    // Basic checks
    expect(publicJWK).toHaveProperty("kty", "EC");
    expect(publicJWK).toHaveProperty("crv", "P-256");
    expect(publicJWK).toHaveProperty("x");
    expect(publicJWK).toHaveProperty("y");

    expect(privateJWK).toHaveProperty("kty", "EC");
    expect(privateJWK).toHaveProperty("crv", "P-256");
    expect(privateJWK).toHaveProperty("x");
    expect(privateJWK).toHaveProperty("y");
    expect(privateJWK).toHaveProperty("d");
  });
});
