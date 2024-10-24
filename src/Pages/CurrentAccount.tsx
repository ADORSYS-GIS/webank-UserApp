import React from 'react';
import Logo from '../assets/Webank.png';
import { faAdjust } from 'react-icons/fa'; // Import the specific icon

function CurrentAccount() {
    return (
        <div className="container flex flex-col">
            <div className="logo-container">
                <div className="logo">
                    <img src={Logo} alt="Logo WeBank" className="w-50 h-20"/>
                </div>
                <div className="icon">
                    <faAdjust/>
                </div>
            </div>
            <div className="text-container bg-gradient-to-r from-[#6673A4] to-[#EAEBEEA0] rounded-lg h-70 w-100">
                <h2 className="text-2xl font-bold text-black">Current Account</h2>
                <p className="text-white">Account Number</p><br/>
                <p className="text-black">CM-******1215</p>
                <p className="text-white">Available Balance</p><br/>
                <p className="text-black">1,000 XAF</p>
            </div>
            <div className="h-5 w-5 "></div>
            <div className="history  bg-gradient-to-r from-[#6673A4] to-[#EAEBEEA0] rounded-lg h-80 w-100">
                <h2 className="text-black font-bold ">
                    History
                </h2>
            </div>
        </div>
    );
}

export default CurrentAccount;