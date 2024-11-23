import axios from "axios";
import { getProjectEnvVariables } from "../../shared/projectEnvVariables.ts";

const { envVariables } = getProjectEnvVariables()
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
    console.log(envVariables.VITE_BACKEND_URL);
    console.log(envVariables.VITE_FRONTEND_URL);
    const response = await axios.post(
      `${envVariables.VITE_BACKEND_URL}/api/registration`,
      requestBody,
      { headers },
    );

    // Log the response from the backend
    console.log("Response from backend:", response.data);

    return response.data;
  } catch (error) {
    console.error("Error sending OTP:", error);
    throw new Error("Failed to send OTP");
  }
};
