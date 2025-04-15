import React from "react";
import {
  FaLifeRing,
  FaEnvelope,
  FaChevronRight,
  FaUser,
  FaExclamationCircle,
  FaCheckCircle,
  FaArrowLeft,
} from "react-icons/fa";
import { IconType } from "react-icons";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../store/Store";

interface MenuItemProps {
  title: string;
  description: string;
  Icon: IconType;
  onClick: () => void;
  disabled?: boolean;
}

const MenuItem: React.FC<MenuItemProps> = ({
  title,
  description,
  Icon,
  onClick,
  disabled = false,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`flex justify-between items-center py-4 px-4 w-full text-left 
                border-b border-gray-100 last:border-b-0 transition-all duration-200
                ${disabled ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-50 active:bg-gray-100"}
                focus:outline-none`}
    >
      <div className="flex items-center">
        <div
          className={`w-12 h-12 rounded-lg flex items-center justify-center 
                      mr-4 transition-all duration-200
                      ${disabled ? "bg-gray-300" : "bg-[#20B2AA] hover:shadow-md group-hover:bg-[#1a9e98]"}
                      text-white`}
        >
          <Icon size={20} />
        </div>
        <div>
          <p className="font-medium text-gray-800">{title}</p>
          <p className="text-sm text-gray-500 mt-1">{description}</p>
        </div>
      </div>
      {!disabled && (
        <div
          className="text-gray-300 transition-transform duration-200 
                    group-hover:translate-x-1"
        >
          <FaChevronRight />
        </div>
      )}
    </button>
  );
};

const SettingsPage: React.FC = () => {
  const emailStatus = useSelector(
    (state: RootState) => state.account.emailStatus,
  );
  const navigate = useNavigate();

  const supportPhoneNumber = "+237654066316";

  const handleSupportClick = () => {
    const customMessage = encodeURIComponent(
      "Hello Webank Support, I would like your help concerning...",
    );
    const whatsappLink = `https://api.whatsapp.com/send?phone=${supportPhoneNumber}&text=${customMessage}`;
    window.open(whatsappLink, "_blank");
  };

  const handleBack = () => {
    navigate("/dashboard");
  };

  return (
    <div
      className="bg-[#f8fcfc] min-h-screen"
      style={{ fontFamily: "'Poppins', sans-serif" }}
    >
      <div className="max-w-xl mx-auto pb-6">
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
          <div className="w-8"></div>
        </div>

        <div className="mx-4 my-6">
          <div
            className="bg-white rounded-xl shadow-sm p-4 flex items-center 
                        hover:shadow-md transition-shadow duration-200"
          >
            <div className="w-16 h-16 bg-[#20B2AA] rounded-lg flex items-center justify-center text-white mr-4">
              <FaUser size={24} />
            </div>
            <div>
              <div className="flex items-center mt-1">
                {emailStatus === "APPROVED" ? (
                  <FaCheckCircle className="text-green-500 mr-2" size={14} />
                ) : (
                  <FaExclamationCircle
                    className="text-amber-500 mr-2"
                    size={14}
                  />
                )}
                <p className="text-sm text-gray-600">
                  {emailStatus === "APPROVED"
                    ? "Email Verified"
                    : "Email Not Verified"}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mx-4 bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="group">
            <MenuItem
              Icon={FaLifeRing}
              title="Help & Support"
              description="Chat with our team for assistance"
              onClick={handleSupportClick}
            />
          </div>
          <div className="group">
            <MenuItem
              Icon={FaEnvelope}
              title="Email verification"
              description={
                emailStatus === "APPROVED"
                  ? "Email successfully verified"
                  : "Secure your account with email verification"
              }
              onClick={() => navigate("/inputEmail")}
              disabled={emailStatus === "APPROVED"}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
