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
      className="flex justify-between items-center p-5 transition-all
                 hover:bg-[#20B2AA]/5 hover:translate-x-1 cursor-pointer w-full text-left
                 duration-300 ease-out group lg:p-6"
    >
      <div className="flex items-center space-x-4">
        <div
          className="w-12 h-12 bg-gradient-to-br from-[#20B2AA] to-[#1C8C8A]
                        rounded-xl flex items-center justify-center text-white
                        shadow-md group-hover:shadow-lg transition-shadow
                        sm:w-14 sm:h-14"
        >
          <Icon size={20} className="shrink-0 sm:w-5 sm:h-5" />
        </div>
        <div className="pr-2">
          <p className="font-semibold text-gray-800 text-lg sm:text-xl">
            {title}
          </p>
          <p className="text-sm text-gray-500 mt-1 sm:text-base">
            {description}
          </p>
        </div>
      </div>
      <div className="text-[#20B2AA] opacity-80 group-hover:opacity-100 transition-opacity">
        <FaChevronRight size={14} className="sm:w-4 sm:h-4" />
      </div>
    </button>
  );
};

const SettingsPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div
      className="bg-gradient-to-b from-white to-[#f3fdfc] min-h-screen py-8 px-4
                 sm:py-10 sm:px-6 lg:px-8"
      style={{ fontFamily: "Poppins, sans-serif" }}
    >
      <div className="max-w-2xl mx-auto">
        {/* Header with Back Button */}
        <div className="flex items-center mb-8 sm:mb-10">
          <button
            onClick={() => navigate(-1)}
            className="text-[#20B2AA] hover:text-[#1C8C8A] transition-colors
                       p-2 rounded-lg hover:bg-[#20B2AA]/10 mr-4"
          >
            <FaArrowLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-800 sm:text-4xl">
              Settings
            </h1>
            <p className="text-[#1C8C8A] font-medium mt-1 sm:text-lg">
              Manage your account preferences
            </p>
          </div>
        </div>

        {/* User Profile Section */}
        <div
          className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-[#e0f2f1]
                        sm:p-8 sm:mb-10"
        >
          <div className="flex items-center space-x-5 flex-col sm:flex-row">
            <div
              className="w-20 h-20 bg-gradient-to-br from-[#20B2AA] to-[#1C8C8A]
                        rounded-2xl flex items-center justify-center text-3xl text-white
                        font-bold shadow-md mb-4 sm:mb-0 sm:w-24 sm:h-24"
            >
              U
            </div>
            <div className="text-center sm:text-left">
              <h2 className="text-xl font-bold text-gray-800 mb-1 sm:text-2xl">
                @USER
              </h2>
              <div className="text-sm space-y-1">
                <p className="text-gray-600 flex items-center justify-center sm:justify-start gap-2">
                  <span className="w-2 h-2 bg-amber-400 rounded-full"></span>
                  <span>Email Not Verified</span>
                </p>
                <p className="text-gray-600">237---</p>
              </div>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <div className="bg-white rounded-2xl shadow-md divide-y divide-[#e0f2f1] overflow-hidden">
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
