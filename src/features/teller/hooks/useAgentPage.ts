import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "@state/Store";

export interface UseAgentPageProps {
  onClose?: () => void;
}

export function useAgentPage({ onClose }: UseAgentPageProps) {
  const navigate = useNavigate();
  const accountId = useSelector((state: RootState) => state.account.accountId);
  const accountCert = useSelector((state: RootState) => state.account.accountCert);
  const [isOpen, setIsOpen] = useState(true);

  const handleClose = (callback?: () => void) => {
    setIsOpen(false);
    setTimeout(() => {
      onClose?.();
      callback?.();
    }, 300);
  };

  useEffect(() => {
    setIsOpen(true);
  }, []);

  return {
    navigate,
    accountId,
    accountCert,
    isOpen,
    setIsOpen,
    handleClose,
  };
}
