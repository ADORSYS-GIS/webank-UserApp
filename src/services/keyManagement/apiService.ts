import axios from "axios";
export const sendOTP = async (fullPhoneNumber: string, jwtToken: string) => {
    // Create the request object with both phone number and public key
    const requestBody = {
      phoneNumber: fullPhoneNumber,
    };
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${jwtToken}`, 
  };

  try {
    const response = await axios.post(
      'http://localhost:8080/api/registration', 
      requestBody,
      { headers }
    );

    // Log the response from the backend
    console.log("Response from backend:", response.data);
    
    return response.data; 
  } catch (error) {
    console.error("Error sending OTP:", error);
    throw new Error('Failed to send OTP'); 
  }
};
