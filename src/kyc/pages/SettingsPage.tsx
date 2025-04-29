import React from "react";
import { FaArrowLeft, FaUser } from "react-icons/fa";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLifeRing,
  faEnvelope,
  faChevronRight,
  faExclamationCircle,
  faCheckCircle,
  faShieldAlt,
  faKey,
  faPhone,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../store/Store";

interface MenuItemProps {
  title: string;
  description: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon: any;
  onClick: () => void;
  disabled?: boolean;
  iconType?: "fa" | "react"; // To determine icon type
}

const MenuItem: React.FC<MenuItemProps> = ({
  title,
  description,
  icon,
  onClick,
  disabled = false,
  iconType = "fa",
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`flex justify-between items-center py-4 px-4 w-full text-left 
                border-b border-black-100 last:border-b-0 transition-all duration-200
                ${disabled ? "opacity-50 cursor-not-allowed" : "hover:bg-black-50 active:bg-black-100"}
                focus:outline-none`}
    >
      <div className="flex items-center">
        <div
          className={`w-12 h-12 rounded-lg flex items-center justify-center 
                    mr-4 transition-all duration-200
                    ${disabled ? "bg-blue-200 text-blue-500" : "bg-blue-100 text-blue-500"}
                    `}
        >
          {iconType === "fa" ? (
            <FontAwesomeIcon icon={icon} size="lg" />
          ) : (
            icon({ size: 20 })
          )}
        </div>
        <div>
          <p className="font-medium text-black-800">{title}</p>
          <p className="text-sm text-black-500 mt-1">{description}</p>
        </div>
      </div>
      {!disabled && (
        <div className="text-black-400">
          <FontAwesomeIcon icon={faChevronRight} />
        </div>
      )}
    </button>
  );
};

const SettingsPage: React.FC = () => {
  const emailStatus = useSelector(
    (state: RootState) => state.account.emailStatus,
  );
  const phoneStatus = useSelector(
    (state: RootState) => state.account.phoneStatus,
  );
  const navigate = useNavigate();

  const supportPhoneNumber = "+237674388690";

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

  const handleSecureAccount = () => {
    navigate("/kyc");
  };

  const handleRecoverAccount = () => {
    navigate("/recoverAccount");
  };

  return (
    <div className="bg-black-50 min-h-screen">
      <div className="max-w-xl mx-auto pb-6">
        <div className="pt-6 px-4 flex items-center mb-4">
          <button
            onClick={handleBack}
            className="p-2 rounded-full hover:bg-black-200 active:bg-black-300 transition-colors duration-200"
            aria-label="Go back"
          >
            <FaArrowLeft className="text-black-700" />
          </button>
          <div className="flex-1 ml-2">
            <h1 className="text-xl font-semibold text-center text-black-800">
              Settings
            </h1>
            <p className="text-center text-sm text-black-500">
              Manage your account preferences
            </p>
          </div>
          <div className="w-8"></div>
        </div>

        <div className="mx-4 my-6">
          <div className="bg-white rounded-lg shadow-sm p-4 flex items-center">
            <div className="w-16 h-16 bg-blue-100 text-blue-500 rounded-lg flex items-center justify-center mr-4">
              <FaUser size={24} />
            </div>
            <div>
              <h2 className="font-medium text-black-800">Your Account</h2>
              <div className="flex flex-col gap-2 mt-1">
                <div className="flex items-center">
                  {emailStatus === "APPROVED" ? (
                    <FontAwesomeIcon
                      icon={faCheckCircle}
                      className="text-blue-500 mr-2"
                      size="sm"
                    />
                  ) : (
                    <FontAwesomeIcon
                      icon={faExclamationCircle}
                      className="text-amber-500 mr-2"
                      size="sm"
                    />
                  )}
                  <p
                    className={`text-sm ${
                      emailStatus === "APPROVED"
                        ? "text-blue-500"
                        : "text-gray-600"
                    }`}
                  >
                    {emailStatus === "APPROVED"
                      ? "Email Verified"
                      : "Email Not Verified"}
                  </p>
                </div>
                <div className="flex items-center">
                  {phoneStatus === "APPROVED" ? (
                    <FontAwesomeIcon
                      icon={faCheckCircle}
                      className="text-blue-500 mr-2"
                      size="sm"
                    />
                  ) : (
                    <FontAwesomeIcon
                      icon={faExclamationCircle}
                      className="text-amber-500 mr-2"
                      size="sm"
                    />
                  )}
                  <p
                    className={`text-sm ${
                      phoneStatus === "APPROVED"
                        ? "text-blue-500"
                        : "text-gray-600"
                    }`}
                  >
                    {phoneStatus === "APPROVED"
                      ? "Phone Number Verified"
                      : "Phone Number Not Verified"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mx-4 bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="group">
            <MenuItem
              icon={faShieldAlt}
              title="Secure your account"
              description="Complete your account verification"
              onClick={handleSecureAccount}
              iconType="fa"
            />
          </div>

          <div className="group">
            <MenuItem
              icon={faLifeRing}
              title="Help & Support"
              description="Chat with our team for assistance"
              onClick={handleSupportClick}
              iconType="fa"
            />
          </div>

          <div className="group">
            <MenuItem
              icon={faEnvelope}
              title="Email verification"
              description={
                emailStatus === "APPROVED"
                  ? "Email successfully verified"
                  : "Secure your account with email verification"
              }
              onClick={() => navigate("/inputEmail")}
              disabled={emailStatus === "APPROVED"}
              iconType="fa"
            />
          </div>
          <div className="group">
            <MenuItem
              icon={faPhone}
              title="Phone number verification"
              description={
                phoneStatus === "APPROVED"
                  ? "Phone number successfully verified"
                  : "Secure your account with phone verification"
              }
              onClick={() => navigate("/register")}
              disabled={phoneStatus === "APPROVED"}
              iconType="fa"
            />
          </div>

          <div className="group">
            <MenuItem
              icon={faKey}
              title="Recover your account"
              description="Restore access to your account"
              onClick={handleRecoverAccount}
              iconType="fa"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
