import React from "react";
import { useNavigate } from "react-router-dom";

const ActionButtons: React.FC = () => {
  const navigate = useNavigate();

  // Function to handle the "Top Up" button click
  const handleTopUpClick = () => {
    navigate("/top-up"); // Navigate to the top-up page
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {[
        {
          icon: "https://cdn-icons-png.flaticon.com/512/1041/1041888.png",
          label: "Top Up",
          onClick: handleTopUpClick, // Assign the click handler for "Top Up"
        },
        {
          icon: "https://cdn-icons-png.flaticon.com/512/4475/4475436.png",
          label: "Transfer",
          onClick: () => {}, // Placeholder for other actions
        },
        {
          icon: "https://cdn-icons-png.flaticon.com/512/736/736948.png",
          label: "Withdraw",
          onClick: () => {}, // Placeholder for other actions
        },
        {
          icon: "https://cdn-icons-png.flaticon.com/512/1235/1235446.png",
          label: "Pay",
          onClick: () => {}, // Placeholder for other actions
        },
      ].map((action) => (
        <button
          key={action.label} // Unique key for each button
          className="flex flex-col items-center bg-blue-500 hover:bg-blue-600 text-white py-4 rounded-lg shadow-md transition duration-300"
          onClick={action.onClick} // Assign the click handler for each button
        >
          {/* Display the icon */}
          <img src={action.icon} alt={action.label} className="h-10 w-10" />
          {/* Display the label */}
          <span className="mt-2 text-sm">{action.label}</span>
        </button>
      ))}
    </div>
  );
};

export default ActionButtons;
