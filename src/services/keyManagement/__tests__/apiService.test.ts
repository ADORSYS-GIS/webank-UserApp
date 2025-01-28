import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { sendOTP } from "../apiService.ts";
import { getProjectEnvVariables } from "../../../shared/projectEnvVariables.ts";

const { envVariables } = getProjectEnvVariables();

describe("sendOTP", () => {
  let mock: MockAdapter;

  beforeEach(() => {
    mock = new MockAdapter(axios);
  });

  afterEach(() => {
    mock.restore();
  });

  it("should send OTP successfully and extract account ID", async () => {
    const fullPhoneNumber = "1234567890";
    const jwtToken = "valid-token";
    const publicKey = "valid-public-key";

    const mockResponse =
      "Registration successful for phone number: 1234567890. Account ID: 2LDztRXNQVQlCfxY3nXDPw%";
    mock
      .onPost(`${envVariables.VITE_BACKEND_URL}/api/otp/send`)
      .reply(200, mockResponse);
    const response = await sendOTP(fullPhoneNumber, publicKey, jwtToken);

    expect(response).toBe(mockResponse);
  });

  it("should throw an error when API responds with an error", async () => {
    const fullPhoneNumber = "1234567890";
    const jwtToken = "valid-token";
    const publicKey = "valid-public-key";

    mock.onPost(`${envVariables.VITE_BACKEND_URL}/api/otp/send`).reply(500);

    await expect(sendOTP(fullPhoneNumber, publicKey, jwtToken)).rejects.toThrow(
      "Failed to send OTP",
    );
  });

  it("should throw an error when an invalid JWT token is provided", async () => {
    const fullPhoneNumber = "1234567890";
    const jwtToken = "invalid-token";
    const publicKey = "valid-public-key";

    mock.onPost(`${envVariables.VITE_BACKEND_URL}/api/otp/send`).reply(401);

    await expect(sendOTP(fullPhoneNumber, publicKey, jwtToken)).rejects.toThrow(
      "Failed to send OTP",
    );
  });

  it("should handle empty phone number and JWT token", async () => {
    await expect(sendOTP("", "", "")).rejects.toThrow("Failed to send OTP");
  });

  it("should handle network error", async () => {
    const fullPhoneNumber = "1234567890";
    const jwtToken = "valid-token";
    const publicKey = "valid-public-key";

    mock.onPost(`${envVariables.VITE_BACKEND_URL}/api/otp/send`).networkError();

    await expect(sendOTP(fullPhoneNumber, publicKey, jwtToken)).rejects.toThrow(
      "Failed to send OTP",
    );
  });
});
