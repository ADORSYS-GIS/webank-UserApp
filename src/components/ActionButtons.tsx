import React from "react";
import { useNavigate } from "react-router-dom";

interface ActionButtonsProps {
  accountId: string | undefined; // Ensure it's correctly typed
  accountCert: string | undefined;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  accountId,
  accountCert,
}) => {
  const navigate = useNavigate();

  // Function to handle the "Top Up" button click
  const handleTopUpClick = () => {
    navigate("/top-up", {
      state: { clientAccountId: accountId, clientAccountCert: accountCert },
    });
    console.log("Top Up button clicked", accountId);
  };

  const handlePayoutClick = () => {
    navigate("/qr-scan", {
      state: { clientAccountId: accountId, clientAccountCert: accountCert },
    });
    console.log("Top Up button clicked", accountId);
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {[
        {
          icon: "https://cdn-icons-png.flaticon.com/512/1041/1041888.png",
          label: "Top Up",
          onClick: handleTopUpClick,
        },
        {
          icon: "https://cdn-icons-png.flaticon.com/512/4475/4475436.png",
          label: "Transfer",
          onClick: () => {}, // Placeholder for other actions
        },
        {
          icon: "https://cdn-icons-png.flaticon.com/512/736/736948.png",
          label: "Withdraw",
          onClick: handlePayoutClick, // Placeholder for other actions
        },
        {
          icon: "https://cdn-icons-png.flaticon.com/512/1235/1235446.png",
          label: "Pay",
          onClick: () => {}, // Placeholder for other actions
        },
      ].map((action) => (
        <button
          key={action.label}
          className="flex flex-col items-center bg-blue-500 hover:bg-blue-600 text-white py-4 rounded-lg shadow-md transition duration-300"
          onClick={action.onClick}
        >
          <img src={action.icon} alt={action.label} className="h-10 w-10" />
          <span className="mt-2 text-sm">{action.label}</span>
        </button>
      ))}
    </div>
  );
};

export default ActionButtons;
