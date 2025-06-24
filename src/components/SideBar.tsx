import React from "react";
import { useNavigate } from "react-router-dom";
import { X, Home, CreditCard, User, Settings } from "react-feather";

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

const SideBar: React.FC<BottomSheetProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end justify-center">
      <div className="bg-white rounded-t-2xl w-full max-w-md transform transition-transform duration-300 ease-in-out">
        <div className="relative p-6">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100"
            aria-label="Close menu"
          >
            <X className="text-gray-600" size={20} />
          </button>
        </div>

        <div className="p-4">
          <nav className="mt-16">
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => {
                    onClose();
                    navigate("/dashboard");
                  }}
                  className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <Home className="text-gray-600" size={20} />
                  <span className="text-gray-800">Dashboard</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onClose();
                    navigate("/transactions");
                  }}
                  className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <CreditCard className="text-gray-600" size={20} />
                  <span className="text-gray-800">Transactions</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onClose();
                    navigate("/kyc");
                  }}
                  className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <User className="text-gray-600" size={20} />
                  <span className="text-gray-800">KYC</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onClose();
                    navigate("/settings");
                  }}
                  className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <Settings className="text-gray-600" size={20} />
                  <span className="text-gray-800">Settings</span>
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default SideBar;
