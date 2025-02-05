import axios from "axios";
import { getProjectEnvVariables } from "../../shared/projectEnvVariables.ts";

const { envVariables } = getProjectEnvVariables();
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
      `${envVariables.VITE_WEBANK_PRS_URL}/api/prs/dev/init`,
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
      `${envVariables.VITE_WEBANK_PRS_URL}/api/prs/dev/validate`,
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
      `${envVariables.VITE_WEBANK_PRS_URL}/api/prs/otp/send`,
      requestBody,
      { headers },
    );

    return response.data;
  } catch (error) {
    console.error("Error sending OTP:", error);
    throw new Error("Failed to send OTP");
  }
};

export const validateOTP = async (
  fullPhoneNumber: string,
  otp: string,
  otpHash: string,
  jwtToken: string,
) => {
  // Create the request object with both phone number and public key
  const requestBody = {
    phoneNumber: fullPhoneNumber,
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
      `${envVariables.VITE_WEBANK_PRS_URL}/api/prs/otp/validate`,
      requestBody,
      { headers },
    );

    console.log("response", response);

    return response.data;
  } catch (error) {
    console.error("Error validating OTP:", error);
    throw new Error("Incorrect OTP");
  }
};

export const createBankAccount = async (
  fullPhoneNumber: string,
  publicKey: string,
  jwtToken: string,
) => {
  // Create the request object with both phone number and public key
  const requestBody = {
    publicKey: publicKey,
    phoneNumber: fullPhoneNumber,
  };
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${jwtToken}`,
  };

  try {
    const response = await axios.post(
      `${envVariables.VITE_WEBANK_OBS_URL}/api/registration`,
      requestBody,
      { headers },
    );

    console.log("response", response);
    return response.data;
  } catch (error) {
    console.error("Error creating bank account:", error);
    throw new Error("Incorrect OTPq");
  }
};
export const getTransactionHistory = async (
  accountId: string,
  jwtToken: string,
) => {
  // Construct the URL for the API request
  const url = `${envVariables.VITE_WEBANK_PRS_URL}/api/accounts/transactions`;
  const requestBody = {
    accountId: accountId,
  };
  // Set up the headers for the request, including the JWT token for authorization
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${jwtToken}`,
  };

  try {
    // Send the POST request to the backend
    const response = await axios.post(url, {
      requestBody,
      headers: headers,
    });
    // Return the data from the response
    return response.data;
  } catch (error) {
    console.error("Error fetching transaction history:", error);
    throw new Error("Failed to fetch transaction history");
  }
};
