import React from "react";
import {
  FaLifeRing,
  FaMapMarkerAlt,
  FaEnvelope,
  FaIdCard,
  FaEdit,
  FaChevronRight,
  FaUser,
  FaExclamationCircle,
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
      className="flex justify-between items-center py-4 px-4 w-full text-left border-b border-gray-100 last:border-b-0"
    >
      <div className="flex items-center">
        <div className="w-12 h-12 bg-[#20B2AA] rounded-lg flex items-center justify-center text-white mr-4">
          <Icon size={20} />
        </div>
        <div>
          <p className="font-medium text-gray-800">{title}</p>
          <p className="text-sm text-gray-500 mt-1">{description}</p>
        </div>
      </div>
      <div className="text-gray-300">
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

  return (
    <div
      className="bg-[#f8fcfc] min-h-screen"
      style={{ fontFamily: "'Poppins', sans-serif" }}
    >
      <div className="max-w-xl mx-auto pb-6">
        {/* Header */}
        <div className="pt-8 pb-4 px-4">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-1">
            <span className="border-b-2 border-[#20B2AA] pb-1">Settings</span>
          </h1>
          <p className="text-center text-[#20B2AA]">
            Manage your account preferences
          </p>
        </div>

        {/* User Profile Card */}
        <div className="mx-4 mb-6">
          <div className="bg-white rounded-xl shadow-sm p-4 flex items-center">
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
          <MenuItem
            Icon={FaLifeRing}
            title="Help & Support"
            description="Chat with our team for assistance"
            onClick={() => handleMenuClick("Help & Support")}
          />
          <MenuItem
            Icon={FaEnvelope}
            title="Email verification"
            description="Secure your account with email verification"
            onClick={() => navigate("/inputEmail")}
          />
          <MenuItem
            Icon={FaIdCard}
            title="Verify my ID (KYC)"
            description="Complete identity verification process"
            onClick={() => navigate("/kyc")}
          />
          <MenuItem
            Icon={FaMapMarkerAlt}
            title="Add your residence"
            description="Update your location information"
            onClick={() => navigate("/verification/location")}
          />
          <MenuItem
            Icon={FaEdit}
            title="Recover Account"
            description="Access account recovery options"
            onClick={() => navigate("/recoverAccount")}
          />
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
