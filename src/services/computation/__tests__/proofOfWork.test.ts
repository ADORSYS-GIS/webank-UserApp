import { describe, it, expect, vi } from "vitest";
import { performProofOfWork } from "../proofOfWork";

// Mock console.log to prevent clutter in test output
vi.spyOn(console, "log").mockImplementation(() => {});

describe("performProofOfWork", () => {
  it("should return a valid PoW hash and nonce", async () => {
    const initiationNonce = "test_nonce";
    const devicePub = "test_public_key";
    const difficulty = 2;

    const { powHash, powNonce } = await performProofOfWork(
      initiationNonce,
      devicePub,
      difficulty,
    );

    expect(powHash).toMatch(new RegExp(`^0{${difficulty}}`));
    expect(typeof powNonce).toBe("number");
    expect(powNonce).toBeGreaterThanOrEqual(0);
  });

  it("should handle difficulty 0 instantly", async () => {
    const { powHash, powNonce } = await performProofOfWork(
      "nonce",
      "publicKey",
      0,
    );

    expect(powHash).toBeTruthy(); // Any valid hash is fine
    expect(powNonce).toBe(0); // Should not need iterations
  });
});
