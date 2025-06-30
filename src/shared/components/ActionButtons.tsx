import React from "react";
import { useNavigate } from "@tanstack/react-router";

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

  const handleActionClick = (callback: () => void) => {
    callback();
  };

  const handleTopUpClick = () =>
    handleActionClick(() => {
      navigate({
        to: "/top-up",
        state: {
          show: "Top up",
          clientAccountId: accountId,
          clientAccountCert: accountCert,
          isClientOnline: true,
        } as any,
      });
      console.log("Top Up button clicked", accountId);
    });

  const handleWithdrawClick = () =>
    handleActionClick(() => {
      navigate({
        to: "/payment-selection",
        state: {
          show: "Withdraw",
          clientAccountId: accountId,
          clientAccountCert: accountCert,
        } as any,
      });
      console.log("Withdrawal", accountId);
    });

  const handleTransferClick = () =>
    handleActionClick(() => {
      navigate({
        to: "/payment-selection",
        state: {
          clientAccountId: accountId,
          clientAccountCert: accountCert,
          show: "Transfer",
        } as any,
      });
      console.log("Transfer", accountId);
    });

  const handlePayClick = () =>
    handleActionClick(() => {
      navigate({
        to: "/payment-selection",
        state: {
          clientAccountId: accountId,
          clientAccountCert: accountCert,
          show: "Payment",
        } as any,
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
            <div
              className={`w-12 h-12 rounded-lg ${action.color} ${action.textColor} flex items-center justify-center mb-2`}
            >
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
