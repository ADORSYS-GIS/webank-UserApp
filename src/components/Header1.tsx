import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBell,
  faInfoCircle,
  faUserTie,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
  onNotificationClick?: () => void;
  onAboutClick?: () => void;
  onServiceMenuClick?: () => void; // Added new prop for service menu
}

const Header1: React.FC<HeaderProps> = ({
  onNotificationClick,
  onAboutClick,
  onServiceMenuClick, // New prop for toggling the bottom sheet
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

  const handleServiceMenuClick = () => {
    if (onServiceMenuClick) {
      onServiceMenuClick();
    }
  };

  return (
    <div className="flex justify-between items-center bg-white shadow-sm">
      {/* Left: Logo and Username */}
      <div className="flex items-center space-x-4">
        <img src="/Webank.png" alt="WeBank Logo" className="w-16 h-auto" />
      </div>

      {/* Right: Icons */}
      <div className="flex items-center space-x-4">
        <button
          onClick={handleServiceMenuClick}
          className="p-2 rounded-full hover:bg-blue-50 text-blue-500"
          aria-label="Service Menu"
        >
          <FontAwesomeIcon icon={faUserTie} className="text-blue-500" />
        </button>

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
