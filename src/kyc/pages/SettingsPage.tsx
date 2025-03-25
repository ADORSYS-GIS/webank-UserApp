import React from "react";
import {
  FaLifeRing,
  FaMapMarkerAlt,
  FaEnvelope,
  FaIdCard,
  FaEdit,
  FaChevronRight,
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
      className="flex justify-between items-center p-5 bg-white rounded-lg shadow-md border border-gray-300
                 hover:bg-gray-50 transition-all duration-300 ease-in-out w-full text-left"
    >
      <div className="flex items-center space-x-4">
        <div
          className="w-12 h-12 bg-gradient-to-br from-[#20B2AA] to-[#1C8C8A] rounded-full
                        flex items-center justify-center text-white shadow-md"
        >
          <Icon size={20} />
        </div>
        <div className="pr-2">
          <p className="font-semibold text-gray-800 text-lg">{title}</p>
          <p className="text-sm text-gray-500 mt-1">{description}</p>
        </div>
      </div>
      <FaChevronRight className="text-gray-400" size={16} />
    </button>
  );
};

const SettingsPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center">
      <div className="max-w-3xl w-full mx-auto bg-white rounded-2xl shadow-lg p-8">
        <div className="flex items-center mb-8">
          <button
            onClick={() => navigate(-1)}
            className="text-[#20B2AA] hover:text-[#1C8C8A] transition-colors p-2"
          >
            <FaArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-3xl font-bold text-gray-800 ml-4">Settings</h1>
        </div>

        <div className="bg-[#E6F7F5] p-6 rounded-xl shadow-md mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-[#20B2AA] to-[#1C8C8A] rounded-full flex items-center justify-center text-white shadow-md">
              <span className="text-2xl font-bold">U</span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">@USER</h2>
              <p className="text-md font-medium">Webank Account</p>
              <p className="text-sm text-gray-600 mt-1">Email Not Verified</p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-300 my-6"></div>

        <div className="space-y-4">
          <MenuItem
            Icon={FaLifeRing}
            title="Help & Support"
            description="24/7 live chat assistance"
            onClick={() => console.log("Help & Support")}
          />
          <MenuItem
            Icon={FaEnvelope}
            title="Email Verification"
            description="Secure your account"
            onClick={() => navigate("/inputEmail")}
          />
          <MenuItem
            Icon={FaIdCard}
            title="Verify my ID (KYC)"
            description="Complete identity verification"
            onClick={() => navigate("/kyc")}
          />
          <MenuItem
            Icon={FaMapMarkerAlt}
            title="Add Residence"
            description="For personalized services"
            onClick={() => navigate("/verification/location")}
          />
          <MenuItem
            Icon={FaEdit}
            title="Modify Handle"
            description="Customize your profile"
            onClick={() => console.log("Modify Handle")}
          />
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
