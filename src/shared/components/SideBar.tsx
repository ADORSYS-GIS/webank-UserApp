import React from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMoneyCheckAlt,
  faShieldAlt,
  faIdCard,
  faTimes,
  faExclamationTriangle,
  faMoneyBillWave,
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
  const [acknowledgedAdmin, setAcknowledgedAdmin] = React.useState(false);

  if (!isOpen) return null;

  const menuItems = [
    {
      id: "teller services",
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
      id: "kyc verification",
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
      id: "account recovery",
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
    {
      id: "topup",
      icon: faMoneyBillWave,
      label: "Top Up Account",
      onClick: () =>
        navigate("/login", {
          state: {
            tellerAccountId: accountId,
            tellerAccountCert: accountCert,
            redirectTo: "/agent-topup",
          },
        }),
    },
  ];

  const handleContinue = () => {
    setAcknowledgedAdmin(true);
  };

  return (
    <>
      {/* Backdrop */}
      <button
        className="fixed inset-0 bg-black bg-opacity-50 z-40 cursor-default"
        onClick={onClose}
        style={{ border: "none", padding: 0 }}
      />

      {/* Sidebar Content */}
      <div className="fixed bottom-0 left-0 right-0 md:left-auto md:right-auto md:w-[750px] md:mx-auto bg-white rounded-t-2xl shadow-lg z-50 transition-transform duration-300 ease-in-out transform">
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold">Services</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100"
          >
            <FontAwesomeIcon icon={faTimes} className="text-gray-600" />
          </button>
        </div>
        {!acknowledgedAdmin ? (
          <div className="p-4">
            <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 mb-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <FontAwesomeIcon
                    icon={faExclamationTriangle}
                    className="text-yellow-500"
                  />
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-medium text-yellow-800">
                    Administrator Notice
                  </h3>
                  <p className="text-yellow-700 mt-2">
                    This section is not for normal users. It is for
                    administration services only. If you are not authorized to
                    access these features, please close this panel.
                  </p>
                  <div className="mt-4">
                    <button
                      onClick={handleContinue}
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mr-2"
                    >
                      I am an administrator
                    </button>
                    <button
                      onClick={onClose}
                      className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-4">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  item.onClick();
                  onClose();
                }}
                className="flex items-center w-full p-4 text-left hover:bg-gray-100 rounded-lg transition-colors mb-2"
              >
                <FontAwesomeIcon
                  icon={item.icon}
                  className="text-blue-500 mr-3"
                />
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        )}
        <div className="h-16"></div>
      </div>
    </>
  );
};

export default BottomSheet;
