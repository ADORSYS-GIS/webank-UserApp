import React from "react";
import {
  FaLifeRing,
  FaEnvelope,
  FaChevronRight,
  FaUser,
  FaExclamationCircle,
  FaArrowLeft,
} from "react-icons/fa";
import { IconType } from "react-icons";
import { useNavigate } from "react-router-dom";

interface MenuItemProps {
  title: string;
  description: string;
  Icon: IconType;
  onClick: () => void;
}

const MenuItem: React.FC<MenuItemProps> = ({
  title,
  description,
  Icon,
  onClick,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex justify-between items-center py-4 px-4 w-full text-left 
                border-b border-gray-100 last:border-b-0 transition-all duration-200
                hover:bg-gray-50 active:bg-gray-100 focus:outline-none"
    >
      <div className="flex items-center">
        <div
          className="w-12 h-12 bg-[#20B2AA] rounded-lg flex items-center justify-center 
                      text-white mr-4 transition-all duration-200
                      hover:shadow-md group-hover:bg-[#1a9e98]"
        >
          <Icon size={20} />
        </div>
        <div>
          <p className="font-medium text-gray-800">{title}</p>
          <p className="text-sm text-gray-500 mt-1">{description}</p>
        </div>
      </div>
      <div
        className="text-gray-300 transition-transform duration-200 
                    group-hover:translate-x-1"
      >
        <FaChevronRight />
      </div>
    </button>
  );
};

const SettingsPage: React.FC = () => {
  const handleMenuClick = (option: string) => {
    console.log(`Clicked on: ${option}`);
  };

  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/dashboard"); // Navigate back to previous page
  };

  return (
    <div
      className="bg-[#f8fcfc] min-h-screen"
      style={{ fontFamily: "'Poppins', sans-serif" }}
    >
      <div className="max-w-xl mx-auto pb-6">
        {/* Header with Back Button */}
        <div className="pt-6 px-4 flex items-center">
          <button
            onClick={handleBack}
            className="p-2 rounded-full hover:bg-gray-200 active:bg-gray-300 transition-colors duration-200"
            aria-label="Go back"
          >
            <FaArrowLeft className="text-gray-700" />
          </button>
          <div className="flex-1 ml-2">
            <h1 className="text-2xl font-bold text-center text-gray-800 mb-1">
              <span className="border-b-2 border-[#20B2AA] pb-1">Settings</span>
            </h1>
            <p className="text-center text-[#20B2AA]">
              Manage your account preferences
            </p>
          </div>
          <div className="w-8"></div> {/* Spacer for balance */}
        </div>

        {/* User Profile Card */}
        <div className="mx-4 my-6">
          <div
            className="bg-white rounded-xl shadow-sm p-4 flex items-center 
                        hover:shadow-md transition-shadow duration-200"
          >
            <div className="w-16 h-16 bg-[#20B2AA] rounded-lg flex items-center justify-center text-white mr-4">
              <FaUser size={24} />
            </div>
            <div>
              <p className="text-xl font-semibold text-gray-800">@USER</p>
              <div className="flex items-center mt-1">
                <FaExclamationCircle
                  className="text-amber-500 mr-2"
                  size={14}
                />
                <p className="text-sm text-gray-600">Email Not Verified</p>
              </div>
              <p className="text-sm text-gray-600">237---------</p>
            </div>
          </div>
        </div>

        {/* Menu Items */}

        <div className="mx-4 bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="group">
            <MenuItem
              Icon={FaLifeRing}
              title="Help & Support"
              description="Chat with our team for assistance"
              onClick={() => handleMenuClick("Help & Support")}
            />
          </div>
          <div className="group">
            <MenuItem
              Icon={FaEnvelope}
              title="Email verification"
              description="Secure your account with email verification"
              onClick={() => navigate("/inputEmail")}
            />
          </div>

        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
