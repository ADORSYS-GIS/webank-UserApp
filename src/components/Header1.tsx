// src/components/Header1.tsx
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faCog, faBars, faQrcode } from "@fortawesome/free-solid-svg-icons";
import Logo from "../assets/Webank.png";

interface Header1Props {
  onHamburgerClick: () => void;
}

const Header1: React.FC<Header1Props> = ({ onHamburgerClick }) => {
  return (
    <header className="flex flex-wrap items-center justify-between p-4 bg-white shadow mb-6">
      {/* Left side: hamburger (on small screens) + logo + greeting */}
      <div className="flex items-center w-full mb-4 md:mb-0 md:w-auto">
        {/* Hamburger icon for small screens */}
        <button
          onClick={onHamburgerClick}
          className="text-gray-700 focus:outline-none md:hidden mr-4"
          aria-label="Open sidebar"
        >
          <FontAwesomeIcon icon={faBars} size="lg" />
        </button>
        {/* Logo and greeting */}
        <div className="flex items-center">
          <img src={Logo} alt="Logo WeBank" className="w-20" />
        </div>
      </div>

      {/* Right side: (conditional) QR code + notification + settings */}
      <div className="flex items-center space-x-4">
        {/* Text button on medium and larger screens */}
        <button
          className="hidden md:inline-flex bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded focus:outline-none"
          onClick={() => alert("Show QR Code modal here!")}
          aria-label="My QR Code (desktop)"
        >
          My QR code
        </button>

        {/* Icon button on small screens */}
        <button
          className="inline-flex md:hidden p-2 rounded-full hover:bg-gray-200"
          onClick={() => alert("Show QR Code modal here!")}
          aria-label="My QR Code (mobile)"
        >
          <FontAwesomeIcon icon={faQrcode} className="text-lg" />
        </button>

        <button
          className="p-2 rounded-full hover:bg-gray-200"
          aria-label="Notifications"
        >
          <FontAwesomeIcon icon={faBell} className="text-lg" />
        </button>
        <button
          className="p-2 rounded-full hover:bg-gray-200"
          aria-label="Settings"
        >
          <FontAwesomeIcon icon={faCog} className="text-lg" />
        </button>
      </div>
    </header>
  );
};

export default Header1;
