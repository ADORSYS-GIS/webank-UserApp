import React from 'react';

const SettingsPage: React.FC = () => {
    return (
        <div className="bg-gray-50 min-h-screen py-6 px-4">
            <h1 className="text-3xl font-bold text-center">Settings</h1>
            <p className="text-center text-green-500">All your account settings here</p>

            <div className="mt-6 mb-8 flex flex-col items-center bg-white rounded-lg shadow-md p-4">
                <div className="flex items-center space-x-4">
                    <div className="w-14 h-14 bg-green-300 rounded-full flex items-center justify-center text-2xl text-white">
                        HH
                    </div>
                    <div>
                        <p className="text-lg font-semibold">@havien</p>
                        <p className="text-sm text-gray-500">Email not added</p>
                        <p className="text-sm text-gray-500">237653493804</p>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-md divide-y divide-gray-200">
                <MenuItem title="Help & Support" description="Chat with our team" />
                <MenuItem title="Next of kin" description="Who is seated at your right hand?" />
                <MenuItem title="Security PIN" description="Four digits security pin" />
                <MenuItem title="Email verification" description="Email not added" />
                <MenuItem title="Verify my ID (KYC)" description="Show proof of ID" />
                <MenuItem title="Add a wallet" description="Add a wallet, get paid!" />
                <MenuItem title="Modify your handle" description="Change your profile handle" />
            </div>
        </div>
    );
};

const MenuItem: React.FC<{ title: string; description: string }> = ({ title, description }) => {
    return (
        <div className="flex justify-between items-center p-4 hover:bg-gray-100 cursor-pointer">
            <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-green-200 rounded-full flex items-center justify-center">
                    <span className="text-lg">⚙️</span>
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