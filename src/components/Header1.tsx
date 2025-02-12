import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faCog } from "@fortawesome/free-solid-svg-icons";
import Logo from "../assets/Webank.png";

const Header1: React.FC = () => {
  return (
    <div className="flex justify-between items-center mb-6">
      <div className="logo">
        <img src={Logo} alt="Logo WeBank" className="w-20" />
        <h1 className="text-xl font-semibold">Hi, Welcome</h1>
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
