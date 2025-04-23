import React from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserTie,
  faMoneyCheckAlt,
  faShieldAlt,
  faIdCard,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  accountId: string | undefined;
  accountCert: string | undefined;
}

const BottomSheet: React.FC<BottomSheetProps> = ({
  isOpen,
  onClose,
  accountId,
  accountCert,
}) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const menuItems = [
    {
      icon: faUserTie,
      label: "Agent Services",
      onClick: () =>
        navigate("/agent", {
          state: {
            agentAccountId: accountId,
            agentAccountCert: accountCert,
          },
        }),
    },
    {
      icon: faMoneyCheckAlt,
      label: "Teller Services",
      onClick: () =>
        navigate("/login", {
          state: {
            tellerAccountId: accountId,
            tellerAccountCert: accountCert,
            redirectTo: "/teller",
          },
        }),
    },
    {
      icon: faShieldAlt,
      label: "KYC Verification",
      onClick: () =>
        navigate("/login", {
          state: {
            tellerAccountId: accountId,
            tellerAccountCert: accountCert,
            redirectTo: "/agency",
          },
        }),
    },
    {
      icon: faIdCard,
      label: "KYC Recovery Agency",
      onClick: () =>
        navigate("/login", {
          state: {
            tellerAccountId: accountId,
            tellerAccountCert: accountCert,
            redirectTo: "/account-recovery",
          },
        }),
    },
  ];

  return (
    <>
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />
      <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-lg z-50 transition-transform duration-300 ease-in-out transform">
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold">Services</h3>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
        <div className="p-4 max-h-96 overflow-y-auto">
          {menuItems.map((item, index) => (
            <button
              key={index}
              onClick={() => {
                item.onClick();
                onClose();
              }}
              className="flex items-center w-full p-4 text-left hover:bg-gray-100 rounded-lg transition-colors mb-2"
            >
              <div className="w-10 h-10 flex items-center justify-center bg-blue-100 text-blue-500 rounded-full mr-4">
                <FontAwesomeIcon icon={item.icon} />
              </div>
              <span className="text-gray-800">{item.label}</span>
            </button>
          ))}
        </div>
        <div className="h-16"></div> {/* Spacer for bottom navigation */}
      </div>
    </>
  );
};

export default BottomSheet;