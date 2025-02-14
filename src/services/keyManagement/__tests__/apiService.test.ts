import { describe, it, expect, vi, beforeEach } from "vitest";
import axios from "axios";
import {
  initiateRegistration,
  validateDeviceRegistration,
  sendOTP,
  validateOTP,
  createBankAccount,
  TopupAccount,
} from "../apiService"; // Adjust this path

vi.mock("axios");

const mockPost = vi.mocked(axios.post);

beforeEach(() => {
  vi.clearAllMocks(); // Reset mocks before each test
});

describe("API Functions", () => {
  const mockJwt = "mocked-jwt-token";

  it("should call initiateRegistration API correctly", async () => {
    mockPost.mockResolvedValueOnce({ data: { success: true } });

    const result = await initiateRegistration("1234567890", mockJwt);
    expect(mockPost).toHaveBeenCalledWith(
      expect.stringContaining("/dev/init"),
      { timeStamp: "1234567890" },
      {
        headers: expect.objectContaining({
          Authorization: `Bearer ${mockJwt}`,
        }),
      },
    );
    expect(result).toEqual({ success: true });
  });

  it("should handle initiateRegistration API failure", async () => {
    mockPost.mockRejectedValueOnce(new Error("API Error"));

    await expect(initiateRegistration("1234567890", mockJwt)).rejects.toThrow(
      "Failed to send OTP",
    );
  });

  it("should call validateDeviceRegistration API correctly", async () => {
    mockPost.mockResolvedValueOnce({ data: { status: "validated" } });

    const result = await validateDeviceRegistration(
      "nonce123",
      "hash123",
      "1",
      mockJwt,
    );
    expect(mockPost).toHaveBeenCalledWith(
      expect.stringContaining("/dev/validate"),
      { initiationNonce: "nonce123", powHash: "hash123", powNonce: "1" },
      {
        headers: expect.objectContaining({
          Authorization: `Bearer ${mockJwt}`,
        }),
      },
    );
    expect(result).toEqual({ status: "validated" });
  });

  it("should call sendOTP API correctly", async () => {
    mockPost.mockResolvedValueOnce({ data: { otpSent: true } });

    const result = await sendOTP("+1234567890", mockJwt, "publicKeyXYZ");
    expect(mockPost).toHaveBeenCalledWith(
      expect.stringContaining("/otp/send"),
      { phoneNumber: "+1234567890", publicKey: "publicKeyXYZ" },
      {
        headers: expect.objectContaining({
          Authorization: `Bearer ${mockJwt}`,
        }),
      },
    );
    expect(result).toEqual({ otpSent: true });
  });

  it("should call validateOTP API correctly", async () => {
    mockPost.mockResolvedValueOnce({ data: { verified: true } });

    const result = await validateOTP(
      "+1234567890",
      "123456",
      "otpHashXYZ",
      mockJwt,
    );
    expect(mockPost).toHaveBeenCalledWith(
      expect.stringContaining("/otp/validate"),
      { phoneNumber: "+1234567890", otpInput: "123456", otpHash: "otpHashXYZ" },
      {
        headers: expect.objectContaining({
          Authorization: `Bearer ${mockJwt}`,
        }),
      },
    );
    expect(result).toEqual({ verified: true });
  });

  it("should call createBankAccount API correctly", async () => {
    mockPost.mockResolvedValueOnce({ data: { accountCreated: true } });

    const result = await createBankAccount(
      "+1234567890",
      "publicKeyXYZ",
      mockJwt,
    );
    expect(mockPost).toHaveBeenCalledWith(
      expect.stringContaining("/registration"),
      { phoneNumber: "+1234567890", publicKey: "publicKeyXYZ" },
      {
        headers: expect.objectContaining({
          Authorization: `Bearer ${mockJwt}`,
        }),
      },
    );
    expect(result).toEqual({ accountCreated: true });
  });

  it("should handle createBankAccount API failure", async () => {
    mockPost.mockRejectedValueOnce(new Error("API Error"));

    await expect(
      createBankAccount("+1234567890", "publicKeyXYZ", mockJwt),
    ).rejects.toThrow("Incorrect OTP");
  });
  it("should call topupAccount API correctly", async () => {
    mockPost.mockResolvedValueOnce({ data: { topupSuccess: true } });

    const result = await TopupAccount(
      "account123",
      500,
      "otherAccount456",
      mockJwt,
    );
    expect(mockPost).toHaveBeenCalledWith(
      expect.stringContaining("/accounts/payout"),
      {
        accountID: "account123",
        amount: 500,
        otherAccountID: "otherAccount456",
      },
      {
        headers: expect.objectContaining({
          Authorization: `Bearer ${mockJwt}`,
        }),
      },
    );
    expect(result).toEqual({ topupSuccess: true });
  });

  it("should handle topupAccount API failure", async () => {
    mockPost.mockRejectedValueOnce(new Error("API Error"));

    await expect(
      TopupAccount("account123", 500, "otherAccount456", mockJwt),
    ).rejects.toThrow("Failed to top up account");
  });
});
