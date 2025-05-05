import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import useInitialization from "../useInitialization";
import {
  RequestToSendPowJWT,
  RequestToSendNonce,
} from "../../services/keyManagement/requestService";
import { performProofOfWork } from "../../services/computation/proofOfWork";
import { retrieveKeyPair } from "../../services/keyManagement/storeKey";

// Mock the dependencies
vi.mock("../../services/keyManagement/requestService");
vi.mock("../../services/computation/proofOfWork");
vi.mock("../../services/keyManagement/storeKey");

describe("useInitialization", () => {
  const mockInitiationNonce = "test-nonce";
  const mockPublicKey = "test-public-key";
  const mockPowResult = {
    powNonce: 123,
    powHash: "test-hash",
  };
  const mockDevCert = "test-dev-cert";

  beforeEach(() => {
    // Reset all mocks before each test
    vi.clearAllMocks();

    // Setup default mock implementations
    (
      RequestToSendNonce as unknown as ReturnType<typeof vi.fn>
    ).mockResolvedValue(mockInitiationNonce);
    (retrieveKeyPair as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
      publicKey: mockPublicKey,
    });
    (
      performProofOfWork as unknown as ReturnType<typeof vi.fn>
    ).mockResolvedValue(mockPowResult);
    (
      RequestToSendPowJWT as unknown as ReturnType<typeof vi.fn>
    ).mockResolvedValue(mockDevCert);
  });

  it("should initialize successfully", async () => {
    const { result } = renderHook(() => useInitialization());

    // Wait for the initialization to complete
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(result.current.devCert).toBe(mockDevCert);
    expect(result.current.error).toBeNull();
  });

  it("should handle nonce request failure", async () => {
    const errorMessage = "Failed to get nonce";
    (
      RequestToSendNonce as unknown as ReturnType<typeof vi.fn>
    ).mockRejectedValue(new Error(errorMessage));

    const { result } = renderHook(() => useInitialization());

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(result.current.devCert).toBeNull();
    expect(result.current.error).toBe(errorMessage);
  });

  it("should handle proof of work failure", async () => {
    const errorMessage = "Proof of work failed";
    (
      performProofOfWork as unknown as ReturnType<typeof vi.fn>
    ).mockRejectedValue(new Error(errorMessage));

    const { result } = renderHook(() => useInitialization());

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(result.current.devCert).toBeNull();
    expect(result.current.error).toBe(errorMessage);
  });
});
