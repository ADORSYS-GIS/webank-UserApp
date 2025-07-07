import { useLocation, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export interface TransactionDetails {
  amount: number;
  TransactionID: string;
  paymentTime: number;
  paymentMethod: string;
}

export function useSuccessPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { transactionCert } = location.state || {};

  let transactionDetails: TransactionDetails = {
    amount: 0,
    TransactionID: "N/A",
    paymentTime: 0,
    paymentMethod: "N/A",
  };

  if (transactionCert) {
    try {
      const decoded = jwtDecode<TransactionDetails>(transactionCert);
      transactionDetails = decoded;
    } catch (error) {
      console.error("Failed to decode JWT:", error);
    }
  }

  const handleReturnToDashboard = () => {
    navigate("/dashboard");
  };

  return {
    ...transactionDetails,
    handleReturnToDashboard,
  };
}
