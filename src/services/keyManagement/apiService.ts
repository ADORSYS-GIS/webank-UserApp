import axios from "axios";
import { getProjectEnvVariables } from "../../shared/projectEnvVariables.ts";

const { envVariables } = getProjectEnvVariables();
let accountId: string | null = null;

export const sendOTP = async (fullPhoneNumber: string, jwtToken: string) => {
  // Create the request object with both phone number and public key
  const requestBody = {
    phoneNumber: fullPhoneNumber,
  };
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${jwtToken}`,
  };

  try {
    // Send the post request to the backend
    const response = await axios.post(
      `${envVariables.VITE_BACKEND_URL}/registration`,
      requestBody,
      { headers },
    );

    // Log the response from the backend
    console.log("Response from backend:", response.data);

    // Extract the account ID from the response
    accountId = response.data.split("Account ID: ")[1];

    return response.data;
  } catch (error) {
    console.error("Error sending OTP:", error);
    throw new Error("Failed to send OTP");
  }
};

export const getAccountId = () => accountId;
