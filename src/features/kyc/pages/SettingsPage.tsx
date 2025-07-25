import React from "react";
import {
  ChevronRight,
  User,
  Shield,
  HelpCircle,
  Mail,
  Phone,
  Repeat,
  ChevronLeft,
} from "react-feather";
import { useNavigate } from "@tanstack/react-router";
import { useAccountStore } from "@state/accountStore";

interface MenuItemProps {
  title: string;
  description: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon: any;
  onClick: () => void;
  disabled?: boolean;
}

const MenuItem: React.FC<MenuItemProps> = ({
  title,
  description,
  icon,
  onClick,
  disabled = false,
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-full p-4 flex items-center justify-between transition-all duration-200
                ${disabled ? "opacity-50 cursor-not-allowed" : "hover:bg-black-50 active:bg-black-100"}
                focus:outline-none`}
    >
      <div className="flex items-center w-full">
        {" "}
        {/* Added w-full here */}
        <div
          className={`w-12 h-12 rounded-lg flex items-center justify-center 
                    mr-4 transition-all duration-200
                    ${disabled ? "bg-blue-200 text-blue-500" : "bg-blue-100 text-blue-500"}
                    `}
        >
          {React.createElement(icon, { size: 20 })}
        </div>
        <div className="flex-1 text-left">
          {" "}
          {/* Added flex-1 and text-left */}
          <p className="font-medium text-black-800">{title}</p>
          <p className="text-sm text-black-500 mt-1">{description}</p>
        </div>
      </div>
      {!disabled && (
        <div className="text-black-400">
          <ChevronRight className="text-gray-400" size={20} />
        </div>
      )}
    </button>
  );
};

const SettingsPage: React.FC = () => {
  const { emailStatus, phoneStatus } = useAccountStore();
  const navigate = useNavigate();

  const supportPhoneNumber = "+237674388690";

  const handleSupportClick = () => {
    const customMessage = encodeURIComponent(
      "Hello Webank Support, I would like your help concerning..."
    );
    const whatsappLink = `https://api.whatsapp.com/send?phone=${supportPhoneNumber}&text=${customMessage}`;
    window.open(whatsappLink, "_blank");
  };

  const handleBack = () => {
    navigate({ to: "/" });
  };

  const handleSecureAccount = () => {
    navigate({ to: "/kyc" });
  };

  const handleRecoverAccount = () => {
    navigate({ to: "/recoverAccount" });
  };

  return (
    <div className="bg-black-50 min-h-screen">
      <div className="max-w-xl mx-auto pb-6">
        <div className="pt-6 px-4 flex items-center mb-4">
          {/* Back Button */}
          <button
            onClick={handleBack}
            className="flex items-center space-x-2 p-2 rounded-full transition-colors duration-200 hover:bg-gray-100 active:bg-gray-200 hover:text-blue-500 text-gray-600"
            aria-label="Go back"
          >
            <ChevronLeft className="w-6 h-6 transition-colors" />
            <span className="text-sm font-medium transition-colors">Back</span>
          </button>

          {/* Title + Description */}
          <div className="flex-1 ml-2">
            <h1 className="text-xl font-semibold text-center text-gray-800">
              Settings
            </h1>
            <p className="text-center text-sm text-gray-500">
              Manage your account preferences
            </p>
          </div>

          {/* Placeholder for spacing */}
          <div className="w-8" />
        </div>

        <div className="mx-4 my-6">
          <div className="bg-white rounded-lg shadow-sm p-4 flex items-center">
            <div className="w-16 h-16 bg-blue-100 text-blue-500 rounded-lg flex items-center justify-center mr-4">
              <User size={24} />
            </div>
            <div>
              <h2 className="font-medium text-black-800">Your Account</h2>
              <div className="flex flex-col gap-2 mt-1">
                <div className="flex items-center">
                  {emailStatus === "APPROVED" ? (
                    <Shield className="text-blue-500 mr-2" size={16} />
                  ) : (
                    <Shield className="text-amber-500 mr-2" size={16} />
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
                    <Shield className="text-blue-500 mr-2" size={16} />
                  ) : (
                    <Shield className="text-amber-500 mr-2" size={16} />
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
              icon={Shield}
              title="Secure your account"
              description="Complete your account verification"
              onClick={handleSecureAccount}
            />
          </div>

          <div className="group">
            <MenuItem
              icon={Mail}
              title="Email verification"
              description={
                emailStatus === "APPROVED"
                  ? "Email successfully verified"
                  : "Secure your account with email verification"
              }
              onClick={() => navigate({ to: "/inputEmail" })}
              disabled={emailStatus === "APPROVED"}
            />
          </div>

          <div className="group">
            <MenuItem
              icon={Phone}
              title="Phone number verification"
              description={
                phoneStatus === "APPROVED"
                  ? "Phone number successfully verified"
                  : "Secure your account with phone verification"
              }
              onClick={() => navigate({ to: "/phone" })}
              disabled={phoneStatus === "APPROVED"}
            />
          </div>

          <div className="group">
            <MenuItem
              icon={Repeat}
              title="Recover your account"
              description="Restore access to your account"
              onClick={handleRecoverAccount}
            />
          </div>

          <div className="group">
            <MenuItem
              icon={HelpCircle}
              title="Help & Support"
              description="Chat with our team for assistance"
              onClick={handleSupportClick}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
