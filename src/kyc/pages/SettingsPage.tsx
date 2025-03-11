import React from "react";
import {
  FaLifeRing,
  FaMapMarkerAlt,
  FaEnvelope,
  FaIdCard,
  FaEdit,
  FaChevronRight,
} from "react-icons/fa";
import { IconType } from "react-icons";
import { useNavigate } from "react-router-dom";

interface MenuItemProps {
  title: string;
  description: string;
  Icon: IconType;
  onClick: () => void;
}


const MenuItem: React.FC<MenuItemProps> = ({ title, description, Icon, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="flex justify-between items-center p-4 transition-transform 
                 hover:bg-green-50 hover:scale-[1.01] cursor-pointer"
    >
      <div className="flex items-center space-x-3">
        <div
          className="w-10 h-10 bg-gradient-to-br from-green-300 to-green-400 
                        rounded-full flex items-center justify-center text-white"
        >
          <Icon size={16} />
        </div>
        <div>
          <p className="font-medium text-gray-800">{title}</p>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
      </div>
      <div className="text-gray-400">
        <FaChevronRight />
      </div>
    </div>
  );
};

const SettingsPage: React.FC = () => {
  const handleMenuClick = (option: string) => {
    console.log(`Clicked on: ${option}`);
    alert(`Navigating to: ${option}`); // Replace with actual navigation logic
  };
    
  const navigate = useNavigate();

  return (
    <div className="bg-gradient-to-b from-white to-gray-50 min-h-screen py-6 px-4">
      <div className="max-w-xl mx-auto">
        <h1 className="text-4xl font-extrabold text-center text-gray-800">Settings</h1>
        <p className="mt-2 text-center text-green-600">All your account settings here</p>

        {/* Profile Card */}
        <div className="mt-6 mb-8 bg-gradient-to-br from-white to-green-50 rounded-xl shadow-lg p-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-500 
                            rounded-full flex items-center justify-center text-2xl text-white font-bold">
              U
            </div>
            <div>
              <p className="text-xl font-semibold text-gray-800">@USER</p>
              <p className="text-sm text-gray-600">Email Not Verified</p>
              <p className="text-sm text-gray-600">237---------</p>
            </div>
          </div>
        </div>

        {/* Settings List */}
        <div className="bg-white rounded-xl shadow-md divide-y divide-gray-200">
          <MenuItem
            Icon={FaLifeRing}
            title="Help & Support"
            description="Chat with our team"
            onClick={() => handleMenuClick("Help & Support")}
          />
          <MenuItem
            Icon={FaEnvelope}
            title="Email verification"
            description="Email not added"
            onClick={() => navigate("/inputEmail")}
          />
          <MenuItem
            Icon={FaIdCard}
            title="Verify my ID (KYC)"
            description="Show proof of ID"
            onClick={() => navigate("/kyc")}
          />
          <MenuItem
            Icon={FaMapMarkerAlt}
            title="Add your residence"
            description="Help us locate you"
            onClick={() => handleMenuClick("Add your residence")}
          />
          <MenuItem
            Icon={FaEdit}
            title="Modify your handle"
            description="Change your profile handle"
            onClick={() => handleMenuClick("Modify your handle")}
          />
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
