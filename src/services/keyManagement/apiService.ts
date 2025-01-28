import axios from "axios";
import { getProjectEnvVariables } from "../../shared/projectEnvVariables.ts";

const { envVariables } = getProjectEnvVariables();
let accountId: string | null = null;
export const sendOTP = async (
  fullPhoneNumber: string,
  jwtToken: string,
  publicKey: string,
) => {
  // Create the request object with both phone number and public key
  const requestBody = {
    phoneNumber: fullPhoneNumber,
    publicKey: publicKey,
  };
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${jwtToken}`,
  };

  try {
    // Send the post request to the backend
    const response = await axios.post(
      // `${envVariables.VITE_BACKEND_URL}/api/otp/send`,
      'http://localhost:8080/api/otp/send',
      requestBody,
      { headers },
    );

    return response.data;
  } catch (error) {
    console.error("Error sending OTP:", error);
    throw new Error("Failed to send OTP");
  }
};

export const initiateRegistration = async (
  timeStamp: string,
  jwtToken: string,
) => {
  // Create the request object with both phone number and public key
  const requestBody = {
    timeStamp,
  };
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${jwtToken}`,
  };

  try {
    // Send the post request to the backend
    const response = await axios.post(
      // `${envVariables.VITE_BACKEND_URL}/api/dev/init`,
      "http://localhost:8080/api/dev/init",
      requestBody,
      { headers },
    );
    console.log(jwtToken);
    return response.data;
  } catch (error) {
    console.error("Error sending OTP:", error);
    throw new Error("Failed to send OTP");
  }
};

export const validateDeviceRegistration = async (
  initiationNonce: string,
  powHash: string,
  powNonce: string,
  jwtToken: string,
) => {
  // Create the request object with both phone number and public key
  const requestBody = {
    initiationNonce,
    powHash,
    powNonce,
  };
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${jwtToken}`,
  };

  try {
    // Send the post request to the backend
    const response = await axios.post(
      // ${envVariables.VITE_BACKEND_URL}/api/dev/validate`,
      "http://localhost:8080/api/dev/validate",
      requestBody,
      { headers },
    );
    console.log(jwtToken);
    return response.data;
  } catch (error) {
    console.error("failed to validate", error);
    throw new Error("failed to validate device");
  }
};

export const validateOTP = async (
  fullPhoneNumber: string,
  publicKey: string,
  otp: string,
  otpHash: string,
  jwtToken: string,
) => {
  // Create the request object with both phone number and public key
  const requestBody = {
    phoneNumber: fullPhoneNumber,
    publicKey: publicKey,
    otpInput: otp,
    otpHash: otpHash,
  };
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${jwtToken}`,
  };

  try {
    // Send the post request to the backend
    const response = await axios.post(
      `${envVariables.VITE_BACKEND_URL}/api/otp/validate`,
      // "http://localhost:8080/api/otp/validate",
      requestBody,
      { headers },
    );
    accountId = response.data.split("Account ID: ")[1];
    console.log(response);

    return response.data;
  } catch (error) {
    console.error("Error validating OTP:", error);
    throw new Error("Incorrect OTP");
  }
};
export const getAccountId = () => accountId;
