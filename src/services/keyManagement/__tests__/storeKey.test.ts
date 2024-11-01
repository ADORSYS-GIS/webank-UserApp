import { beforeEach, describe, expect, it, vi } from "vitest";
import { storeKeyPair, retrieveKeyPair } from "../storeKey";
import storage from "../storageSetup";
import generateKeyPair from "../generateKey";

// Mocking storage and generateKeyPair functions
vi.mock("../storageSetup", () => ({
  default: {
    insert: vi.fn(),
    findOne: vi.fn(),
  },
}));

vi.mock("../generateKey", () => ({
  default: vi.fn(async () => ({
    publicKey: { alg: "RSA-OAEP", kty: "RSA", use: "enc" },
    privateKey: { alg: "RSA-OAEP", kty: "RSA", use: "enc" },
  })),
}));

describe("Key Management Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks(); // Clear mocks before each test to reset the calls
  });

  it("should store a key pair in IndexedDB", async () => {
    await storeKeyPair();

    expect(generateKeyPair).toHaveBeenCalledTimes(1);
    expect(storage.insert).toHaveBeenCalledWith("keys", {
      value: {
        pub: { alg: "RSA-OAEP", kty: "RSA", use: "enc" },
        priv: { alg: "RSA-OAEP", kty: "RSA", use: "enc" },
      },
    });
    expect(storage.insert).toHaveBeenCalledTimes(1);
  });

  it("should retrieve the key pair from IndexedDB", async () => {
    // Set up mock return for storage.findOne
    storage.findOne.mockResolvedValue({
      value: {
        pub: { alg: "RSA-OAEP", kty: "RSA", use: "enc" },
        priv: { alg: "RSA-OAEP", kty: "RSA", use: "enc" },
      },
    });

    const keyPair = await retrieveKeyPair(1);

    expect(storage.findOne).toHaveBeenCalledWith("keys", 1);
    expect(storage.findOne).toHaveBeenCalledTimes(1);

    expect(keyPair.publicKey).toEqual({ alg: "RSA-OAEP", kty: "RSA", use: "enc" });
    expect(keyPair.privateKey).toEqual({ alg: "RSA-OAEP", kty: "RSA", use: "enc" });
  });

  it("should return null if no key pair is found", async () => {
    // Set up mock return for storage.findOne with no record found
    storage.findOne.mockResolvedValue(null);

    const keyPair = await retrieveKeyPair(999); // Use an ID unlikely to exist

    expect(storage.findOne).toHaveBeenCalledWith("keys", 999);
    expect(storage.findOne).toHaveBeenCalledTimes(1);

    expect(keyPair.publicKey).toBeNull();
    expect(keyPair.privateKey).toBeNull();
  });
});
