import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import useDisableScroll from "@shared/hooks/useDisableScroll";

export function useRecoveryToken() {
  useDisableScroll();
  const location = useLocation();
  const navigate = useNavigate();
  const recoveryToken = location.state?.recoveryToken || "N/A";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(recoveryToken);
      toast.success("Copied to clipboard!");
    } catch (error) {
      toast.error("Failed to copy!");
    }
  };

  const goToDashboard = () => {
    navigate("/account-recovery");
  };

  return {
    recoveryToken,
    handleCopy,
    goToDashboard,
  };
}
