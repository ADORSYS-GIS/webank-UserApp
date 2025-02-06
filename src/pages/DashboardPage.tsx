import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faEyeSlash,
  faBell,
  faCog,
  faShoppingCart,
  faMoneyBillWave,
  faTaxi,
  faVideo,
} from "@fortawesome/free-solid-svg-icons";
import { useLocation } from "react-router-dom";
import Logo from "../assets/Webank.png";
import { toast } from "react-toastify";
import { RequestToGetBalance } from "../services/keyManagement/requestService.ts";

const Dashboard: React.FC = () => {
  const [balanceVisible, setBalanceVisible] = useState(false);
  const [balance, setBalance] = useState<string | null>(null);
  const viewBalance = async () => {
    if (balanceVisible) {
      setBalanceVisible(false);
      return;
    }
    try {
      const fetchedBalance = await RequestToGetBalance(accountId, accountCert);
      console.log("Balance fetched successfully:", fetchedBalance);
      setBalance(fetchedBalance);
      setBalanceVisible(true);
    } catch (error) {
      console.error("Error fetching balance:", error);
      toast.error("Failed to retrieve balance. Please try again.");
    }
  };

  const actions = [
    {
      icon: "https://cdn-icons-png.flaticon.com/512/1041/1041888.png",
      label: "Top Up",
    },
    {
      icon: "https://cdn-icons-png.flaticon.com/512/4475/4475436.png",
      label: "Transfer",
    },
    {
      icon: "https://cdn-icons-png.flaticon.com/512/736/736948.png",
      label: "Withdraw",
    },
    {
      icon: "https://cdn-icons-png.flaticon.com/512/1235/1235446.png",
      label: "Pay",
    },
  ];

  const transactions = [
    {
      title: "Apple",
      amount: "-$429.00",
      date: "23 Feb, 2022",
      icon: faShoppingCart,
    },
    {
      title: "Fiverr",
      amount: "+$5,379.63",
      date: "23 Feb, 2022",
      icon: faMoneyBillWave,
    },
    { title: "Uber", amount: "-$120.53", date: "23 Feb, 2022", icon: faTaxi },
    {
      title: "Netflix",
      amount: "-$94.75",
      date: "23 Feb, 2022",
      icon: faVideo,
    },
  ];
  const location = useLocation();
  const accountId = location.state?.accountId;
  const accountCert = location.state?.accountCert;

  return (
    <div className="flex flex-col h-screen bg-gray-50 text-gray-800 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="logo">
          <img src={Logo} alt="Logo WeBank" className="w-20" />
          <h1 className="text-xl font-semibold">Hi, Welcome</h1>
        </div>
        <div className="flex space-x-4">
          <button className="p-2 rounded-full hover:bg-gray-200">
            <FontAwesomeIcon icon={faBell} className="text-lg" />
          </button>
          <button className="p-2 rounded-full hover:bg-gray-200">
            <img
              src="https://www.flaticon.com/free-icon/profile_3135715"
              alt="Profile"
              className="rounded-full h-10 w-10"
            />
          </button>
          <button className="p-2 rounded-full hover:bg-gray-200">
            <FontAwesomeIcon icon={faCog} className="text-lg" />
          </button>
        </div>
      </div>

      {/* Balance Card */}
      <div className="bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg p-6 shadow-lg mb-6">
        <h2 className="text-3xl font-bold text-white">Webank</h2>
        <h3 className="text-sm mt-2 text-white">Current Balance</h3>
        <div className="flex items-center mt-1">
          <p className="text-4xl font-bold text-white">
            {balanceVisible ? `$${balance}` : "****"}
          </p>
          <button onClick={viewBalance} className="ml-2 text-white">
            <FontAwesomeIcon icon={balanceVisible ? faEyeSlash : faEye} />
          </button>
        </div>
        <div className=" justify-between items-center mt-4">
          <h3 className="text-white">Available Balance</h3>

          <p className="text-white">
            {accountId ? `CM-${accountId}` : "Account not found"}
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {actions.map((action) => (
          <button
            key={action.label} //{/* Use label as unique key */}
            className="flex flex-col items-center bg-blue-500 hover:bg-blue-600 text-white py-4 rounded-lg shadow-md transition duration-300"
          >
            <img src={action.icon} alt={action.label} className="h-10 w-10" />
            <span className="mt-2 text-sm">{action.label}</span>
          </button>
        ))}
      </div>

      {/* Transactions Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mt-6">
        <h3 className="text-lg font-semibold">Last Transactions</h3>
        <div className="mt-4 space-y-4">
          {transactions.map((transaction) => (
            <div
              key={transaction.title} //{/* Use title as unique key */}
              className="flex items-center justify-between py-2 border-b border-gray-300"
            >
              <div className="flex items-center">
                <div className="bg-blue-500 rounded-full h-10 w-10 flex items-center justify-center mr-3">
                  <FontAwesomeIcon
                    icon={transaction.icon}
                    className="text-white"
                  />
                </div>
                <div>
                  <span className="text-gray-800">{transaction.title}</span>
                  <span className="text-gray-500 text-sm block">
                    {transaction.date}
                  </span>
                </div>
              </div>
              <span
                className={`text-lg ${transaction.amount.startsWith("-") ? "text-red-500" : "text-green-500"}`}
              >
                {transaction.amount}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-4">
          <button className="text-blue-500 hover:underline bg-transparent border-none p-0 cursor-pointer">
            See all
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
