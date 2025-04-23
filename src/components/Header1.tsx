// src/components/Header.tsx
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
  username?: string;
  onNotificationClick?: () => void;
  onAboutClick?: () => void;
}

const Header1: React.FC<HeaderProps> = ({
  onNotificationClick,
  onAboutClick,
}) => {
  const navigate = useNavigate();

  const handleNotificationClick = () => {
    if (onNotificationClick) {
      onNotificationClick();
    } else {
      navigate("/notifications");
    }
  };

  const handleAboutClick = () => {
    if (onAboutClick) {
      onAboutClick();
    } else {
      navigate("/about");
    }
  };

  return (
    <div className="flex justify-between items-center p-4 bg-white shadow-sm">
      {/* Left: Logo and Username */}
      <div className="flex items-center space-x-4">
        <img 
          src="/src/assets/Webank.png" 
          alt="WeBank Logo" 
          className="w-16 h-auto" 
        />

      </div>
      
      {/* Right: Icons */}
      <div className="flex items-center space-x-4">
        <button
          onClick={handleNotificationClick}
          className="p-2 rounded-full hover:bg-gray-100"
          aria-label="Notifications"
        >
          <FontAwesomeIcon icon={faBell} className="text-gray-600" />
        </button>
        
        <button
          onClick={handleAboutClick}
          className="p-2 rounded-full hover:bg-gray-100"
          aria-label="About"
        >
          <FontAwesomeIcon icon={faInfoCircle} className="text-gray-600" />
        </button>
      </div>
    </div>
  );
};

export default Header1;