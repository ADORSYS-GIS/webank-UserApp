import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faQrcode,
  faCog,
  faEllipsisVertical,
} from "@fortawesome/free-solid-svg-icons";

interface BottomNavigationProps {
  accountId: string | undefined;
  accountCert: string | undefined;
  toggleMenu: () => void;
}

const BottomNavigation: React.FC<BottomNavigationProps> = ({
  accountId,
  accountCert,
  toggleMenu,
}) => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t border-gray-200">
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
              location.pathname === "/dashboard" ? "text-blue-500" : "text-gray-500"
            }`}
          />
          <span
            className={`text-xs mt-1 ${
              location.pathname === "/dashboard" ? "text-blue-500" : "text-gray-500"
            }`}
          >
            Home
          </span>
        </button>

        <button
          onClick={() =>
            navigate("/account-qr", {
              state: { clientAccountId: accountId, clientAccountCert: accountCert },
            })
          }
          className="flex flex-col items-center justify-center w-1/4 h-full text-center"
        >
          <FontAwesomeIcon
            icon={faQrcode}
            className={`text-lg ${
              location.pathname === "/account-qr" ? "text-blue-500" : "text-gray-500"
            }`}
          />
          <span
            className={`text-xs mt-1 ${
              location.pathname === "/account-qr" ? "text-blue-500" : "text-gray-500"
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
              location.pathname === "/settings" ? "text-blue-500" : "text-gray-500"
            }`}
          />
          <span
            className={`text-xs mt-1 ${
              location.pathname === "/settings" ? "text-blue-500" : "text-gray-500"
            }`}
          >
            Settings
          </span>
        </button>

        <button
          onClick={toggleMenu}
          className="flex flex-col items-center justify-center w-1/4 h-full text-center"
        >
          <FontAwesomeIcon icon={faEllipsisVertical} className="text-lg text-gray-500" />
          <span className="text-xs mt-1 text-gray-500">Menu</span>
        </button>
      </div>
    </div>
  );
};

export default BottomNavigation;