import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faQrcode,
  faCog,
  faUserTie,
} from "@fortawesome/free-solid-svg-icons";
import AccountQRModal from "../pages/AccountQr";
import AgentPage from "../pages/AgentPage";

interface BottomNavigationProps {
  accountId: string | undefined;
  accountCert: string | undefined;
  toggleMenu: () => void;
}

const BottomNavigation: React.FC<BottomNavigationProps> = ({
  accountId,
  accountCert,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [isAgentModalOpen, setIsAgentModalOpen] = useState(false);

  const openQRModal = () => {
    setIsQRModalOpen(true);
  };

  const closeQRModal = () => {
    setIsQRModalOpen(false);
  };

  const openAgentModal = () => {
    setIsAgentModalOpen(true);
  };

  const closeAgentModal = () => {
    setIsAgentModalOpen(false);
  };

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t border-gray-200 z-10">
        <div className="flex justify-around items-center h-16">
          <button
            onClick={() =>
              navigate("/dashboard", { state: { accountId, accountCert } })
            }
            className="flex flex-col items-center justify-center w-1/4 h-full text-center"
          >
            <FontAwesomeIcon
              icon={faHome}
              className={`text-lg ${
                location.pathname === "/dashboard"
                  ? "text-blue-500"
                  : "text-gray-500"
              }`}
            />
            <span
              className={`text-xs mt-1 ${
                location.pathname === "/dashboard"
                  ? "text-blue-500"
                  : "text-gray-500"
              }`}
            >
              Home
            </span>
          </button>

          <button
            onClick={openQRModal}
            className="flex flex-col items-center justify-center w-1/4 h-full text-center"
          >
            <FontAwesomeIcon
              icon={faQrcode}
              className={`text-lg ${
                isQRModalOpen ? "text-blue-500" : "text-gray-500"
              }`}
            />
            <span
              className={`text-xs mt-1 ${
                isQRModalOpen ? "text-blue-500" : "text-gray-500"
              }`}
            >
              My Code
            </span>
          </button>

          <button
            onClick={() =>
              navigate("/settings", { state: { accountId, accountCert } })
            }
            className="flex flex-col items-center justify-center w-1/4 h-full text-center"
          >
            <FontAwesomeIcon
              icon={faCog}
              className={`text-lg ${
                location.pathname === "/settings"
                  ? "text-blue-500"
                  : "text-gray-500"
              }`}
            />
            <span
              className={`text-xs mt-1 ${
                location.pathname === "/settings"
                  ? "text-blue-500"
                  : "text-gray-500"
              }`}
            >
              Settings
            </span>
          </button>

          <button
            onClick={openAgentModal} // Changed from toggle to open
            className="flex flex-col items-center justify-center w-1/4 h-full text-center"
          >
            <FontAwesomeIcon
              icon={faUserTie}
              className={`text-lg ${
                isAgentModalOpen ? "text-blue-500" : "text-gray-500"
              }`}
            />
            <span
              className={`text-xs mt-1 ${
                isAgentModalOpen ? "text-blue-500" : "text-gray-500"
              }`}
            >
              Agent
            </span>
          </button>
        </div>
      </div>

      {/* QR Code Modal */}
      <AccountQRModal isOpen={isQRModalOpen} onClose={closeQRModal} />

      {/* Agent Modal - Pass the onClose prop */}
      {isAgentModalOpen && <AgentPage onClose={closeAgentModal} />}
    </>
  );
};

export default BottomNavigation;
