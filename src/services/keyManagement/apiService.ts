import axios from "axios";
import { getProjectEnvVariables } from "../../shared/projectEnvVariables.ts";

const { envVariables } = getProjectEnvVariables();
let accountId: string | null = null;

export const sendOTP = async (fullPhoneNumber: string, jwtToken: string, publicKey: string) => {
  // Create the request object with both phone number and public key
  const requestBody = {
    phoneNumber: fullPhoneNumber,
    publicKey: publicKey
  };
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${jwtToken}`,
  };

  try {
    // Send the post request to the backend
    const response = await axios.post(
      // `${envVariables.VITE_BACKEND_URL}/registration`,
      'http://localhost:8080/api/otp/send',
      requestBody,
      { headers },
    );

    // Log the response from the backend
    console.log("Response from backend:", publicKey);
    console.log("Response from backend:", response.data);

    // Extract the account ID from the response
    // accountId = response.data.split("Account ID: ")[1];

    return response.data;
  } catch (error) {
    console.error("Error sending OTP:", error);
    throw new Error("Failed to send OTP");
  }
};

export const getAccountId = () => accountId;
