import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const EmailCode: React.FC = () => {
    const [otp, setOtp] = useState<string[]>(new Array(6).fill(""));
    const [showSuccess, setShowSuccess] = useState(false);
    const navigate = useNavigate();

    const handleChange = (element: HTMLInputElement, index: number) => {
        if (isNaN(Number(element.value))) return;
        setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);
        if (element.nextSibling) {
            (element.nextSibling as HTMLInputElement).focus();
        }
    };

    const handleVerify = () => {
        const enteredCode = otp.join("");
        if (enteredCode === "123456") { // Replace with backend response check
            setShowSuccess(true);
        } else {
            alert("Invalid OTP. Please try again.");
        }
    };

    return (
        <div className="flex items-center justify-center h-screen w-screen bg-white overflow-hidden relative">
            <div className="w-full max-w-md p-6 bg-gray-100 shadow-lg rounded-2xl text-center">
                <div className="flex items-center mb-6">
                    <i className="fas fa-arrow-left text-xl cursor-pointer" onClick={() => navigate('/inputEmail')}></i>
                </div>
                <h1 className="text-3xl font-bold mb-3">Verify OTP Code</h1>
                <p className="text-gray-600 mb-6">Please enter the OTP code we sent to your email address.</p>
                <div className="flex justify-center space-x-2 mb-6">
                    {otp.map((data, index) => (
                        <input
                            key={index}
                            type="text"
                            className="w-12 h-12 border border-gray-300 rounded-xl text-center text-2xl focus:ring-2 focus:ring-green-400 focus:outline-none"
                            maxLength={1}
                            value={data}
                            onChange={e => handleChange(e.target, index)}
                            onFocus={e => e.target.select()}
                        />
                    ))}
                </div>
                <p className="text-gray-600 mb-2">Didn't receive the code? Click below to resend.</p>
                <button className="text-green-500 font-semibold hover:underline mb-6" onClick={() => console.log('Resend OTP clicked')}>
                    Resend Code
                </button>
                <div className="flex justify-between">
                    <button 
                        className="w-1/3 py-3 bg-gray-300 text-black font-semibold rounded-full shadow-md hover:bg-gray-400 transition"
                        onClick={() => navigate('/inputEmail')}
                    >
                        Back
                    </button>
                    <button 
                        className="w-1/3 py-3 bg-green-500 text-white font-semibold rounded-full shadow-md hover:bg-green-600 transition"
                        onClick={handleVerify}
                    >
                        Verify
                    </button>
                </div>
            </div>
            {showSuccess && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-xl shadow-lg text-center">
                        <h2 className="text-2xl font-bold mb-3">Successful Email Verification</h2>
                        <p className="text-gray-600 mb-4">Your email has been successfully verified!</p>
                        <button 
                            className="py-2 px-6 bg-green-500 text-white font-semibold rounded-full shadow-md hover:bg-green-600 transition"
                            onClick={() => navigate('/')}
                        >
                            OK
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EmailCode;
