import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import { RootState } from "@state/Store";
import useDisableScroll from "@shared/hooks/useDisableScroll";
import { RequestToGetRecoveryToken } from "@services/keyManagement/requestService";

export function useAccountConfirmation() {
  useDisableScroll();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get account certificate from Redux store
  const accountCert = useSelector(
    (state: RootState) => state.account.accountCert,
  );

  // Extract state values
  const newAccountId = location.state?.accountId as string | undefined;
  const oldAccountId = location.state?.oldAccountId as string | undefined;

  // Handle confirmation with API call
  const handleConfirm = async () => {
    if (!newAccountId || !oldAccountId) {
      toast.error(
        "Missing account details. Please try the scanning process again.",
      );
      return navigate(-1);
    }

    setIsSubmitting(true);
    try {
      // Get recovery token from API
      const recoveryToken = await RequestToGetRecoveryToken(
        oldAccountId,
        newAccountId,
        accountCert,
      );

      // Navigate with the recovery token
      navigate("/recovery/recoverytoken", {
        state: {
          oldAccountId,
          newAccountId,
          recoveryToken,
        },
      });
    } catch (error) {
      toast.error("Failed to get recovery token. Please try again.");
      // Optionally log error
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    handleConfirm,
    navigate,
    newAccountId,
    oldAccountId,
  };
}
