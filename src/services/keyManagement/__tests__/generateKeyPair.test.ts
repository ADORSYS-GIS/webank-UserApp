import generateKeyPair from "../generateKey";
describe("generateKeyPair", () => {
  it("should generate a valid RSA key pair", async () => {
    const { publicKey, privateKey } = await generateKeyPair();

    // Basic checks
    expect(publicKey).toHaveProperty("kty", "EC");
    expect(publicKey).toHaveProperty("crv", "P-256");
    expect(publicKey).toHaveProperty("x");
    expect(publicKey).toHaveProperty("y");

    expect(privateKey).toHaveProperty("kty", "EC");
    expect(privateKey).toHaveProperty("crv", "P-256");
    expect(privateKey).toHaveProperty("x");
    expect(privateKey).toHaveProperty("y");
    expect(privateKey).toHaveProperty("d");
  });
});
