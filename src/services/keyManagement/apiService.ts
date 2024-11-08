import axios from "axios";

// otpService.ts
let accountId: string | null = null;

export const sendOTP = async (fullPhoneNumber: string, jwtToken: string) => {
  const requestBody = {
    phoneNumber: fullPhoneNumber,
  };
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${jwtToken}`,
  };

  try {
    const response = await axios.post(
      "http://localhost:8080/api/registration",
      requestBody,
      { headers }
    );

    console.log("Response from backend:", response.data);

    // Extract the account ID from the response
    accountId = response.data.split("Account ID: ")[1];

    return accountId;
  } catch (error) {
    console.error("Error sending OTP:", error);
    throw new Error("Failed to send OTP");
  }
};

// Export the accountId directly
export const getAccountId = () => accountId;
