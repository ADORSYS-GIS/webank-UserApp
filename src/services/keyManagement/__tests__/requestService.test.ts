import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import axios from "axios";
import {
  initiateRegistration,
  validateDeviceRegistration,
  sendOTP,
  validateOTP,
  createBankAccount,
  getTransactionHistory,
  getAccountBalance,
} from "../apiService"; // Update the import path

// Mock axios and environment variables
vi.mock("axios");
vi.mock("../../shared/projectEnvVariables.ts", () => ({
  getProjectEnvVariables: () => ({
    envVariables: {
      VITE_WEBANK_PRS_URL: "http://localhost:8080/api/prs",
      VITE_WEBANK_OBS_URL: "http://localhost:8080/api",
    },
  }),
}));

describe("API Functions", () => {
  beforeEach(() => {
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("initiateRegistration", () => {
    it("should make correct POST request", async () => {
      const mockData = { nonce: "test-nonce" };
      const mockedPost = vi
        .mocked(axios.post)
        .mockResolvedValue({ data: mockData });

      const result = await initiateRegistration("2024-01-01", "test-token");

      expect(mockedPost).toHaveBeenCalledWith(
        expect.stringContaining("/dev/init"),

        { timeStamp: "2024-01-01" },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer test-token",
          },
        },
      );
      expect(result).toEqual(mockData);
    });

    it("should handle error", async () => {
      vi.mocked(axios.post).mockRejectedValue(new Error("Network error"));

      await expect(
        initiateRegistration("2024-01-01", "test-token"),
      ).rejects.toThrow("Failed to send OTP");
      expect(console.error).toHaveBeenCalled();
    });
  });

  describe("validateDeviceRegistration", () => {
    it("should validate device correctly", async () => {
      const mockData = { success: true };
      vi.mocked(axios.post).mockResolvedValue({ data: mockData });

      const result = await validateDeviceRegistration(
        "nonce",
        "hash",
        "pow-nonce",
        "jwt-token",
      );

      expect(axios.post).toHaveBeenCalledWith(
        expect.stringContaining("/dev/validate"),

        {
          initiationNonce: "nonce",
          powHash: "hash",
          powNonce: "pow-nonce",
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer jwt-token",
          },
        },
      );
      expect(result).toEqual(mockData);
    });

    it("should handle validation error", async () => {
      vi.mocked(axios.post).mockRejectedValue(new Error("Validation failed"));

      await expect(
        validateDeviceRegistration("nonce", "hash", "nonce", "token"),
      ).rejects.toThrow("failed to validate device");
    });
  });

  describe("sendOTP", () => {
    it("should send OTP with correct parameters", async () => {
      const mockData = { otpHash: "hash" };
      vi.mocked(axios.post).mockResolvedValue({ data: mockData });

      const result = await sendOTP("+123456789", "jwt-token", "public-key");

      expect(axios.post).toHaveBeenCalledWith(
        expect.stringContaining("/otp/send"),
        {
          phoneNumber: "+123456789",
          publicKey: "public-key",
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer jwt-token",
          },
        },
      );
      expect(result).toEqual(mockData);
    });

    it("should handle OTP send failure", async () => {
      vi.mocked(axios.post).mockRejectedValue(new Error("API error"));

      await expect(sendOTP("+123", "token", "key")).rejects.toThrow(
        "Failed to send OTP",
      );
    });
  });

  describe("validateOTP", () => {
    it("should validate OTP correctly", async () => {
      const mockData = { verified: true };
      vi.mocked(axios.post).mockResolvedValue({ data: mockData });

      const result = await validateOTP(
        "+123456789",
        "123456",
        "otp-hash",
        "jwt-token",
      );

      expect(axios.post).toHaveBeenCalledWith(
        expect.stringContaining("/otp/validate"),
        {
          phoneNumber: "+123456789",
          otpInput: "123456",
          otpHash: "otp-hash",
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer jwt-token",
          },
        },
      );
      expect(result).toEqual(mockData);
    });

    it("should handle invalid OTP", async () => {
      vi.mocked(axios.post).mockRejectedValue(new Error("Invalid OTP"));

      await expect(
        validateOTP("+123", "wrong", "hash", "token"),
      ).rejects.toThrow("Incorrect OTP");
    });
  });

  describe("createBankAccount", () => {
    it("should create account with correct parameters", async () => {
      const mockData = { accountId: "acc-123" };
      vi.mocked(axios.post).mockResolvedValue({ data: mockData });

      const result = await createBankAccount(
        "+123456789",
        "public-key",
        "jwt-token",
      );

      expect(axios.post).toHaveBeenCalledWith(
        expect.stringContaining("/registration"),
        {
          phoneNumber: "+123456789",
          publicKey: "public-key",
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer jwt-token",
          },
        },
      );
      expect(result).toEqual(mockData);
    });

    it("should handle account creation failure", async () => {
      vi.mocked(axios.post).mockRejectedValue(new Error("Creation failed"));

      await expect(createBankAccount("+123", "key", "token")).rejects.toThrow(
        "Incorrect OTPq",
      );
    });
  });

  describe("getTransactionHistory", () => {
    it("should fetch transactions correctly", async () => {
      const mockData = { transactions: [] };
      vi.mocked(axios.post).mockResolvedValue({ data: mockData });

      const result = await getTransactionHistory("acc-123", "jwt-token");

      expect(axios.post).toHaveBeenCalledWith(
        expect.stringContaining("/transactions"),
        { accountID: "acc-123" },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer jwt-token",
          },
        },
      );
      expect(result).toEqual(mockData);
    });

    it("should handle transaction fetch error", async () => {
      vi.mocked(axios.post).mockRejectedValue(new Error("Fetch failed"));

      await expect(getTransactionHistory("acc-123", "token")).rejects.toThrow(
        "Failed to fetch transaction history",
      );
    });
  });

  describe("getAccountBalance", () => {
    it("should retrieve balance correctly", async () => {
      const mockData = { balance: 1000 };
      vi.mocked(axios.post).mockResolvedValue({ data: mockData });

      const result = await getAccountBalance("acc-123", "jwt-token");

      expect(axios.post).toHaveBeenCalledWith(
        expect.stringContaining("/accounts/balance"),
        { accountID: "acc-123" },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer jwt-token",
          },
        },
      );
      expect(result).toEqual(mockData);
    });

    it("should handle balance retrieval error", async () => {
      vi.mocked(axios.post).mockRejectedValue(new Error("Balance error"));

      await expect(getAccountBalance("acc-123", "token")).rejects.toThrow(
        "Failed to retrieve account balance",
      );
    });
  });
});
