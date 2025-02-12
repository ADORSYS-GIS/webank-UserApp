import React from "react";

const ActionButtons: React.FC = () => (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
    {[
      {
        icon: "https://cdn-icons-png.flaticon.com/512/1041/1041888.png",
        label: "Top Up",
      },
      {
        icon: "https://cdn-icons-png.flaticon.com/512/4475/4475436.png",
        label: "Transfer",
      },
      {
        icon: "https://cdn-icons-png.flaticon.com/512/736/736948.png",
        label: "Withdraw",
      },
      {
        icon: "https://cdn-icons-png.flaticon.com/512/1235/1235446.png",
        label: "Pay",
      },
    ].map((action) => (
      <button
        key={action.label}
        className="flex flex-col items-center bg-blue-500 hover:bg-blue-600 text-white py-4 rounded-lg shadow-md transition duration-300"
      >
        <img src={action.icon} alt={action.label} className="h-10 w-10" />
        <span className="mt-2 text-sm">{action.label}</span>
      </button>
    ))}
  </div>
);

export default ActionButtons;
