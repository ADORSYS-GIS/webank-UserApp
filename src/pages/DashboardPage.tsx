import Logo from "../assets/Webank.png";
import { FaAdjust } from "react-icons/fa";
import { getAccountId } from "../services/keyManagement/apiService";

function CurrentAccount() {
  const accountId = getAccountId();
  return (
    <div className="container px-4 flex flex-col">
      <div className="flex flex-row justify-between items-center">
        <div className="logo">
          <img src={Logo} alt="Logo WeBank" className="w-20" />
        </div>
        <div className="theme-change">
          <FaAdjust />
        </div>
      </div>
      <div className="text-container bg-gradient-to-r from-[#6673A4] to-[#EAEBEEA0] rounded-lg h-70 w-100 px-6">
        <h2 className="text-2xl font-bold text-black mb-6">Current Account</h2>
        <p className="text-white">Account Number</p>
        <p className="text-black">
          {accountId ? `CM-${accountId}` : "Account not found"}
        </p>
        <p className="text-white">Available Balance</p>
        <p className="text-black">1,000 XAF</p>
      </div>
      <div className="h-5 w-5"></div>
      <div className="history  bg-gradient-to-r from-[#6673A4] to-[#EAEBEEA0] rounded-lg h-80 w-100 px-6">
        <h2 className="text-black font-bold ">History</h2>
      </div>
    </div>
  );
}

export default CurrentAccount;
