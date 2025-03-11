import React from 'react';
import {
  FaLifeRing,   // Help & Support
  FaUsers,      // Next of kin
  FaLock,       // Security PIN
  FaEnvelope,   // Email verification
  FaIdCard,     // Verify my ID
  FaWallet,     // Add a wallet
  FaEdit        // Modify handle
} from 'react-icons/fa';

const SettingsPage: React.FC = () => {
  return (
    <div className="bg-gray-50 min-h-screen py-6 px-4">
      {/* Centered container with max-width */}
      <div className="max-w-xl mx-auto">
        <h1 className="text-3xl font-bold text-center">Settings</h1>
        <p className="text-center text-green-500">All your account settings here</p>

        {/* Profile Card */}
        <div className="mt-6 mb-8 bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 bg-green-300 rounded-full flex items-center justify-center text-2xl text-white">
              U
            </div>
            <div>
              <p className="text-lg font-semibold">@USER</p>
              <p className="text-sm text-gray-500">Email Not Verified</p>
              <p className="text-sm text-gray-500">237---------</p>
            </div>
          </div>
        </div>

        {/* Settings List */}
        <div className="bg-white rounded-lg shadow-md divide-y divide-gray-200">
          <MenuItem
            Icon={FaLifeRing}
            title="Help & Support"
            description="Chat with our team"
          />
          <MenuItem
            Icon={FaUsers}
            title="Next of kin"
            description="Who is seated at your right hand?"
          />
          <MenuItem
            Icon={FaLock}
            title="Security PIN"
            description="Four digits security pin"
          />
          <MenuItem
            Icon={FaEnvelope}
            title="Email verification"
            description="Email not added"
          />
          <MenuItem
            Icon={FaIdCard}
            title="Verify my ID (KYC)"
            description="Show proof of ID"
          />
          <MenuItem
            Icon={FaWallet}
            title="Add a wallet"
            description="Add a wallet, get paid!"
          />
          <MenuItem
            Icon={FaEdit}
            title="Modify your handle"
            description="Change your profile handle"
          />
        </div>
      </div>
    </div>
  );
};

// Adjust the MenuItem component to accept an Icon prop
import { IconType } from 'react-icons';

interface MenuItemProps {
  title: string;
  description: string;
  Icon: IconType;
}

const MenuItem: React.FC<MenuItemProps> = ({ title, description, Icon }) => {
  return (
    <div className="flex justify-between items-center p-4 hover:bg-gray-100 cursor-pointer">
      <div className="flex items-center space-x-2">
        {/* Use the Icon prop instead of a static emoji */}
        <div className="w-8 h-8 bg-green-200 rounded-full flex items-center justify-center text-green-700">
          <Icon size={16} />
        </div>
        <div>
          <p className="font-medium">{title}</p>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
      </div>
      <div className="text-gray-500">➔</div>
    </div>
  );
};

export default SettingsPage;
