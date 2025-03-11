import React from "react";
import { useNavigate } from "react-router-dom";

interface ActionButtonsProps {
  accountId: string | undefined;
  accountCert: string | undefined;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  accountId,
  accountCert,
}) => {
  const navigate = useNavigate();

  const actions = [
    {
      icon: "https://cdn-icons-png.flaticon.com/512/1041/1041888.png",
      label: "Top Up",
      onClick: () =>
        navigate("/top-up", {
          state: {
            show: "Top up",
            clientAccountId: accountId,
            clientAccountCert: accountCert,
          },
        }),
    },
    {
      icon: "https://cdn-icons-png.flaticon.com/512/4475/4475436.png",
      label: "Transfer",
      onClick: () =>
        navigate("/qr-scan", {
          state: {
            show: "Transfer",
            clientAccountId: accountId,
            clientAccountCert: accountCert,
          },
        }),
    },
    {
      icon: "https://cdn-icons-png.flaticon.com/512/736/736948.png",
      label: "Withdraw",
      onClick: () =>
        navigate("/qr-scan", {
          state: { clientAccountId: accountId, clientAccountCert: accountCert },
        }),
    },
    {
      icon: "https://cdn-icons-png.flaticon.com/512/1235/1235446.png",
      label: "Pay",
      onClick: () =>
        navigate("/qr-scan", {
          state: {
            show: "Payment",
            clientAccountId: accountId,
            clientAccountCert: accountCert,
          },
        }),
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
      {actions.map((action) => (
        <button
          key={action.label}
          onClick={action.onClick}
          className="flex flex-col items-center justify-center p-4 border-2 border-blue-300 rounded-xl shadow-sm hover:bg-blue-300 hover:text-white transition duration-300 ease-in-out"
        >
          <img
            src={action.icon}
            alt={action.label}
            className="h-10 w-10 opacity-80"
          />
          <span className="mt-2 text-blue-600 font-medium text-sm">
            {action.label}
          </span>
        </button>
      ))}
    </div>
  );
};

export default ActionButtons;
