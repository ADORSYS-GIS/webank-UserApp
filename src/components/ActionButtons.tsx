import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState } from "../store/Store";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faExchangeAlt,
  faDownload,
  faWallet,
  faArrowUp,
} from "@fortawesome/free-solid-svg-icons";

interface ActionButtonsProps {
  accountId: string | undefined;
  accountCert: string | undefined;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  accountId,
  accountCert,
}) => {
  const navigate = useNavigate();
  const kycCert = useSelector((state: RootState) => state.account.kycCert);

  const handleActionClick = (callback: () => void) => {
    // if (kycCert === null) {
    //   toast.warning("Please complete the KYC process to proceed.");
    //   return;
    // }
    callback();
  };

  const handleTopUpClick = () =>
    handleActionClick(() => {
      navigate("/top-up", {
        state: {
          show: "Top up",
          clientAccountId: accountId,
          clientAccountCert: accountCert,
          isClientOnline: true,
        },
      });
      console.log("Top Up button clicked", accountId);
    });

  const handleWithdrawClick = () =>
    handleActionClick(() => {
      navigate("/qr-scan", {
        state: { clientAccountId: accountId, clientAccountCert: accountCert },
      });
      console.log("Withdrawal", accountId);
    });

  const handleTransferClick = () =>
    handleActionClick(() => {
      navigate("/qr-scan", {
        state: {
          clientAccountId: accountId,
          clientAccountCert: accountCert,
          show: "Transfer",
        },
      });
      console.log("Transfer", accountId);
    });

  const handlePayClick = () =>
    handleActionClick(() => {
      navigate("/qr-scan", {
        state: {
          clientAccountId: accountId,
          clientAccountCert: accountCert,
          show: "Payment",
        },
      });
      console.log("Payment", accountId);
    });

  const actions = [
    {
      icon: faArrowUp,
      label: "Top Up",
      color: "bg-blue-100",
      textColor: "text-blue-500",
      onClick: handleTopUpClick,
    },
    {
      icon: faExchangeAlt,
      label: "Transfer",
      color: "bg-blue-100",
      textColor: "text-blue-500",
      onClick: handleTransferClick,
    },
    {
      icon: faDownload,
      label: "Withdraw",
      color: "bg-blue-100",
      textColor: "text-blue-500",
      onClick: handleWithdrawClick,
    },
    {
      icon: faWallet,
      label: "Pay",
      color: "bg-blue-100",
      textColor: "text-blue-500",
      onClick: handlePayClick,
    },
  ];

  return (
    <div className="mb-6">
      <div className="grid grid-cols-4 gap-2">
        {actions.map((action) => (
          <button
            key={action.label}
            className="flex flex-col items-center justify-center"
            onClick={action.onClick}
          >
            <div className={`w-12 h-12 rounded-lg ${action.color} ${action.textColor} flex items-center justify-center mb-2`}>
              <FontAwesomeIcon icon={action.icon} />
            </div>
            <span className="text-xs text-gray-600">{action.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ActionButtons;