import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { sendOTP } from "../apiService";
import { getProjectEnvVariables } from "../../../shared/projectEnvVariables.ts";

const { envVariables } = getProjectEnvVariables();

describe("sendOTP", () => {
  let mock: MockAdapter; // Explicitly declare the type

  beforeEach(() => {
    mock = new MockAdapter(axios);
  });

  afterEach(() => {
    mock.restore();
  });

  it("should send OTP successfully with valid inputs", async () => {
    const fullPhoneNumber = "1234567890";
    const jwtToken = "valid-token";

    mock
      .onPost(`${envVariables.VITE_BACKEND_URL}/registration`)
      .reply(200, { message: "OTP sent" });

    const response = await sendOTP(fullPhoneNumber, jwtToken);

    expect(response).toEqual({ message: "OTP sent" });
  });

  it("should throw an error when API responds with an error", async () => {
    const fullPhoneNumber = "1234567890";
    const jwtToken = "valid-token";

    mock.onPost(`${envVariables.VITE_BACKEND_URL}/registration`).reply(500);

    await expect(sendOTP(fullPhoneNumber, jwtToken)).rejects.toThrow(
      "Failed to send OTP",
    );
  });

  it("should throw an error when an invalid JWT token is provided", async () => {
    const fullPhoneNumber = "1234567890";
    const jwtToken = "invalid-token";

    mock.onPost(`${envVariables.VITE_BACKEND_URL}/registration`).reply(401);

    await expect(sendOTP(fullPhoneNumber, jwtToken)).rejects.toThrow(
      "Failed to send OTP",
    );
  });

  it("should handle empty phone number and JWT token", async () => {
    await expect(sendOTP("", "")).rejects.toThrow("Failed to send OTP");
  });

  it("should handle network error", async () => {
    const fullPhoneNumber = "1234567890";
    const jwtToken = "valid-token";

    mock.onPost(`${envVariables.VITE_BACKEND_URL}/registration`).networkError();

    await expect(sendOTP(fullPhoneNumber, jwtToken)).rejects.toThrow(
      "Failed to send OTP",
    );
  });
});
