import React from "react";
import { useNavigate, useRouterState } from "@tanstack/react-router";
import { User, Code } from "react-feather";

const PaymentSelectionPage: React.FC = () => {
  const location = useRouterState().location;
  const { show } = location.state as { show?: string };
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-8">
          Choose Payment Method
        </h1>

        <div className="space-y-4">
          <button
            onClick={() =>
              navigate({ to: "/contacts", state: { show: "Payment" } as never })
            }
            className="w-full flex items-center justify-center space-x-3 bg-blue-500 text-white py-4 px-6 rounded-lg hover:bg-blue-600 transition-colors"
          >
            <User size={20} color="#2563EB" style={{ marginRight: 8 }} />
            <span>Select from Contacts</span>
          </button>

          <button
            onClick={() =>
              navigate({
                to: show === "Top Up" ? "/qr-scan/top-up" : "/qr-scan",
                state: { show } as never,
              })
            }
            className="w-full flex items-center justify-center space-x-3 bg-green-500 text-white py-4 px-6 rounded-lg hover:bg-green-600 transition-colors"
          >
            <Code size={20} color="#2563EB" style={{ marginRight: 8 }} />
            <span>Scan QR Code</span>
          </button>

          <button
            onClick={() => navigate({ to: "/" })}
            className="w-full flex items-center justify-center space-x-3 bg-gray-200 text-gray-700 py-4 px-6 rounded-lg hover:bg-gray-300 transition-colors mt-4"
          >
            <span>Cancel</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSelectionPage;
