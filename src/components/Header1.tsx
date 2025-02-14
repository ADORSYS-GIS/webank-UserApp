// src/components/Header1.tsx
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faCog, faBars } from "@fortawesome/free-solid-svg-icons";
import Logo from "../assets/Webank.png";

interface Header1Props {
  onHamburgerClick: () => void;
}

const Header1: React.FC<Header1Props> = ({ onHamburgerClick }) => {
  return (
    <div className="flex justify-between items-center mb-6 p-4 bg-white shadow">
      <div className="flex items-center">
        {/* Hamburger icon visible on small screens */}
        <button
          onClick={onHamburgerClick}
          className="text-gray-700 focus:outline-none md:hidden mr-4"
        >
          <FontAwesomeIcon icon={faBars} size="lg" />
        </button>
        <div className="flex items-center">
          <img src={Logo} alt="Logo WeBank" className="w-20" />
          <h1 className="text-xl font-semibold ml-2">Hi, Welcome</h1>
        </div>
      </div>
      <div className="flex space-x-4">
        <button className="p-2 rounded-full hover:bg-gray-200">
          <FontAwesomeIcon icon={faBell} className="text-lg" />
        </button>
        <button className="p-2 rounded-full hover:bg-gray-200">
          <FontAwesomeIcon icon={faCog} className="text-lg" />
        </button>
      </div>
    </div>
  );
};

export default Header1;
