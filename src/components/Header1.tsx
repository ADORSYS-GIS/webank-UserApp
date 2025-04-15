// src/components/Header1.tsx
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBell,
  faCog,
  faBars,
  faQrcode,
} from "@fortawesome/free-solid-svg-icons";
import Logo from "../assets/Webank.png";
import { useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";

interface Header1Props {
  onHamburgerClick: () => void;
}

const Header1: React.FC<Header1Props> = ({ onHamburgerClick }) => {
  const navigate = useNavigate();

  return (
    <header className="w-full bg-white shadow">
      <div className="max-w-8xl flex items-center justify-between">
        {/* ← Left: hamburger + logo */}
        <div className="flex items-center">
          <button
            onClick={onHamburgerClick}
            className="text-gray-700 focus:outline-none md:hidden pl-4 pr-3"
            aria-label="Open sidebar"
          >
            <FontAwesomeIcon icon={faBars} size="lg" />
          </button>
          <img
            src={Logo}
            alt="Logo WeBank"
            className="w-24 object-contain mx-4"
          />
        </div>

        {/* → Right: barcode / bell / settings */}
        <div className="flex items-center space-x-3 pr-4">
          {/* Barcode Icon - Desktop */}
          <button
            className="hidden md:inline-flex p-2 rounded-full hover:bg-gray-100 focus:outline-none transition"
            onClick={() => navigate("/account-qr")}
            aria-label="Scan Barcode"
          >
            <FontAwesomeIcon icon={faQrcode} className="text-lg" />
          </button>

          {/* Barcode Icon - Mobile */}
          <button
            className="inline-flex md:hidden p-2 rounded-full hover:bg-gray-100 focus:outline-none transition"
            onClick={() => navigate("/account-qr")}
            aria-label="Scan Barcode"
          >
            <FontAwesomeIcon icon={faQrcode} className="text-lg" />
          </button>

          <button
            className="p-2 rounded-full hover:bg-gray-100 focus:outline-none transition"
            aria-label="Notifications"
          >
            <FontAwesomeIcon icon={faBell} className="text-lg" />
          </button>

          <button
            className="p-2 rounded-full hover:bg-gray-100 focus:outline-none transition"
            aria-label="Settings"
            onClick={() => navigate("/settings")}
          >
            <FontAwesomeIcon icon={faCog} className="text-lg" />
          </button>
        </div>
      </div>

      <ToastContainer position="top-right" autoClose={3000} />
    </header>
  );
};

export default Header1;
