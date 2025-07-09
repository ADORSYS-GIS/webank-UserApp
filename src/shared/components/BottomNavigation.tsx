//NO
import React, { useState } from "react";
import { useNavigate, useRouterState } from "@tanstack/react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faQrcode,
  faCog,
  faUserTie,
  faAddressBook,
} from "@fortawesome/free-solid-svg-icons";
import AccountQRModal from "@features/qr/pages/AccountQr";

interface BottomNavigationProps {
  toggleMenu: () => void;
}

const BottomNavigation: React.FC<BottomNavigationProps> = ({ toggleMenu }) => {
  const location = useRouterState().location;
  const navigate = useNavigate();
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);

  const openQRModal = () => {
    setIsQRModalOpen(true);
  };

  const closeQRModal = () => {
    setIsQRModalOpen(false);
  };

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 md:left-auto md:right-auto md:w-[750px] md:mx-auto bg-white shadow-lg border-t border-gray-200 z-10">
        <div className="flex justify-around items-center h-16">
          <button
            onClick={() =>
              navigate({
                to: "/dashboard",
              })
            }
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                navigate({
                  to: "/dashboard",
                });
              }
            }}
            className="flex flex-col items-center justify-center w-1/4 h-full text-center"
            role="tab"
            aria-selected={location.pathname === "/dashboard"}
            tabIndex={0}
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
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                openQRModal();
              }
            }}
            className="flex flex-col items-center justify-center w-1/4 h-full text-center"
            role="tab"
            aria-selected={isQRModalOpen}
            tabIndex={0}
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
              navigate({
                to: "/settings",
              })
            }
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                navigate({
                  to: "/settings",
                });
              }
            }}
            className="flex flex-col items-center justify-center w-1/4 h-full text-center"
            role="tab"
            aria-selected={location.pathname === "/settings"}
            tabIndex={0}
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
            onClick={() =>
              navigate({
                to: "/contacts",
              })
            }
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                navigate({
                  to: "/contacts",
                });
              }
            }}
            className="flex flex-col items-center justify-center w-1/4 h-full text-center"
            role="tab"
            aria-selected={location.pathname === "/contacts"}
            tabIndex={0}
          >
            <FontAwesomeIcon
              icon={faAddressBook}
              className={`text-lg ${
                location.pathname === "/contacts"
                  ? "text-blue-500"
                  : "text-gray-500"
              }`}
            />
            <span
              className={`text-xs mt-1 ${
                location.pathname === "/contacts"
                  ? "text-blue-500"
                  : "text-gray-500"
              }`}
            >
              Contacts
            </span>
          </button>

          <button
            onClick={toggleMenu}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                toggleMenu();
              }
            }}
            className="flex flex-col items-center justify-center w-1/4 h-full text-center"
            role="tab"
            aria-selected={location.pathname === "/agent"}
            tabIndex={0}
          >
            <FontAwesomeIcon
              icon={faUserTie}
              className={`text-lg ${
                location.pathname === "/agent"
                  ? "text-blue-500"
                  : "text-gray-500"
              }`}
            />
            <span
              className={`text-xs mt-1 ${
                location.pathname === "/agent"
                  ? "text-blue-500"
                   : "text-gray-500"
              }`}
            >
              Agent
            </span>
          </button>
        </div>
      </div>

      {/* QR Code Modal */}
      <AccountQRModal isOpen={isQRModalOpen} onClose={closeQRModal} />
    </>
  );
};

export default BottomNavigation;
