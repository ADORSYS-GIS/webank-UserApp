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
      `${envVariables.VITE_WEBANK_PRS_URL}/dev/init`,
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
      `${envVariables.VITE_WEBANK_PRS_URL}/dev/validate`,
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
      `${envVariables.VITE_WEBANK_PRS_URL}/otp/send`,
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
  jwtToken: string,
) => {
  // Create the request object with both phone number and public key
  const requestBody = {
    phoneNumber: fullPhoneNumber,
    otpInput: otp,
  };
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${jwtToken}`,
  };

  try {
    // Send the post request to the backend
    const response = await axios.post(
      `${envVariables.VITE_WEBANK_PRS_URL}/otp/validate`,
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
      `${envVariables.VITE_WEBANK_OBS_URL}/registration`,
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
  const requestBody = {
    accountID: accountId,
  };
  // Set up the headers for the request, including the JWT token for authorization
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${jwtToken}`,
  };

  try {
    // Send the POST request to the backend
    const response = await axios.post(
      `${envVariables.VITE_WEBANK_OBS_URL}/accounts/transactions`,
      requestBody,
      { headers },
    );
    // Return the data from the response
    return response.data;
  } catch (error) {
    console.error("Error fetching transaction history:", error);
    throw new Error("Failed to fetch transaction history");
  }
};
export const getAccountBalance = async (
  accountId: string,
  jwtToken: string,
) => {
  // Create the request object with both phone number and public key
  const requestBody = {
    accountID: accountId,
  };
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${jwtToken}`,
  };

  try {
    // Send the POST request to retrieve account balance
    const response = await axios.post(
      `${envVariables.VITE_WEBANK_OBS_URL}/accounts/balance`,
      requestBody,
      { headers },
    );

    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Error retrieving account balance:", error);
    throw new Error("Failed to retrieve account balance");
  }
};
export const TopupAccount = async (
  clientAccountId: string,
  amount: number,
  agentAccountId: string,
  jwtToken: string,
) => {
  // Create the request object
  const requestBody = {
    recipientAccountId: clientAccountId,
    senderAccountId: agentAccountId,
    amount: amount,
  };
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${jwtToken}`,
  };
  console.log(requestBody);
  try {
    // Send the POST request to retrieve account balance
    const response = await axios.post(
      `${envVariables.VITE_WEBANK_OBS_URL}/accounts/payout`,
      requestBody,
      { headers },
    );

    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Error toping up account ", error);
    throw new Error("Failed to top up account");
  }
};

export const WithdrawOffline = async (
  clientAccountId: string,
  amount: number,
  agentAccountId: string,
  jwtToken: string,
) => {
  // Create the request object
  const requestBody = {
    recipientAccountId: agentAccountId,
    senderAccountId: clientAccountId,
    amount: amount,
  };
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${jwtToken}`,
  };
  console.log(requestBody);
  try {
    // Send the POST request to retrieve account balance
    const response = await axios.post(
      `${envVariables.VITE_WEBANK_OBS_URL}/accounts/withdraw`,
      requestBody,
      { headers },
    );

    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Error withdrawing offline ", error);
    throw new Error("Failed to withdraw offline");
  }
};
export const getOtps = async (jwtToken: string) => {
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${jwtToken}`,
  };
  console.log(headers, "headers");

  try {
    // Send the GET request to retrieve OTPs
    const response = await axios.get(
      `${envVariables.VITE_WEBANK_PRS_URL}/otp/pending`,
      { headers },
    );

    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Error retrieving otps:", error);
    throw new Error("Failed to retrieve otps");
  }
};

//Email

export const sendEmailOTP = async (
  email: string,
  jwtToken: string,
  publicKey: string,
) => {
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${jwtToken}`,
  };

  const requestBody = {
    email,
    publicKey,
  };

  try {
    const response = await axios.post(
      `${envVariables.VITE_WEBANK_PRS_URL}/email/send-otp`,
      requestBody,
      { headers },
    );
    return response.data;
  } catch (error) {
    console.error("Error sending email OTP:", error);
    throw new Error("Failed to send email OTP");
  }
};

export const verifyEmailCode = async (
  email: string,
  otp: string,
  jwtToken: string,
) => {
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${jwtToken}`,
  };

  const requestBody = {
    email,
    otp,
  };

  try {
    const response = await axios.post(
      `${envVariables.VITE_WEBANK_PRS_URL}/email/verify-code`,
      requestBody,
      { headers },
    );
    return response.data;
  } catch (error) {
    console.error("Error verifying email code:", error);
    throw new Error("Failed to verify email code");
  }
};

//User Location
export const getUserLocation = async (jwtToken: string) => {
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${jwtToken}`,
  };

  try {
    const response = await axios.post(
      `${envVariables.VITE_WEBANK_PRS_URL}/user/location`,
      { headers },
    );
    return response.data;
  } catch (error) {
    console.error("Error retrieving user location:", error);
    throw new Error("Failed to retrieve user location");
  }
};

//Id Card
export const storeKYCInfo = async (
  fullName: string,
  profession: string,
  docNumber: string,
  dateOfBirth: string,
  currentRegion: string,
  expiryDate: string,
  jwtToken: string,
) => {
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${jwtToken}`,
  };

  const requestBody = {
    fullName,
    profession,
    idNumber: docNumber,
    dateOfBirth,
    currentRegion,
    expiryDate,
  };

  try {
    const response = await axios.post(
      `${envVariables.VITE_WEBANK_PRS_URL}/kyc/info`,
      requestBody,
      { headers },
    );
    return response.data;
  } catch (error) {
    console.error("Error storing ID Card info:", error);
    throw new Error("Failed to store ID Card info");
  }
};

export const storeKycDocument = async (
  frontId: string,
  backId: string,
  selfieId: string,
  taxId: string,
  jwtToken: string,
) => {
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${jwtToken}`,
  };

  const requestBody = {
    frontId,
    backId,
    selfieId,
    taxId,
  };

  try {
    const response = await axios.post(
      `${envVariables.VITE_WEBANK_PRS_URL}/kyc/documents`,
      requestBody,
      { headers },
    );
    return response.data;
  } catch (error) {
    console.error("Error storing ID Card info:", error);
    throw new Error("Failed to store ID Card info");
  }
};
