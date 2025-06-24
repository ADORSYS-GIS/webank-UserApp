import React from "react";
import { useNavigate } from "react-router-dom";
import { CreditCard, Shield, Home } from "react-feather";
import { motion } from "framer-motion";
import { useEffect } from "react";

export default function KYCSubmissionCompleted() {
  const navigate = useNavigate();

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  const handleReturnToDashboard = () => {
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-blue-50 flex flex-col items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-2xl shadow-lg w-full max-w-lg overflow-hidden"
      >
        {/* Success banner */}
        <div className="bg-blue-500 py-6 px-6 flex items-center justify-center">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center">
            <CreditCard className="text-blue-500" size={32} />
          </div>
        </div>

        <div className="p-8">
          <h1 className="text-2xl font-bold text-center text-gray-800 mb-4">
            KYC Documents Already Submitted
          </h1>

          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CreditCard className="text-green-500" size={32} />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              KYC Submission Completed
            </h2>
            <p className="text-gray-600">
              Your identity verification has been submitted successfully. We'll
              review your documents and get back to you within 24-48 hours.
            </p>
          </div>

          <div className="space-y-4 mb-6">
            <div className="flex items-center space-x-3">
              <Shield className="text-blue-500" size={20} />
              <span className="text-gray-700">Enhanced security features</span>
            </div>
            <div className="flex items-center space-x-3">
              <Home className="mr-2" size={20} />
              <span className="text-gray-700">Access to all services</span>
            </div>
          </div>

          <div className="flex flex-col space-y-4">
            <button
              onClick={handleReturnToDashboard}
              className="py-4 px-6 rounded-xl bg-blue-500 text-white font-medium hover:bg-blue-600 transition-all focus:outline-none focus:ring-2 focus:ring-blue-300 shadow-sm flex items-center justify-center"
            >
              <Home className="mr-2" size={20} />
              Return to Dashboard
            </button>
          </div>
        </div>
      </motion.div>

      <div className="mt-8 text-center">
        <p className="text-sm text-gray-500">
          Need help? Contact our{" "}
          <span className="text-blue-500 font-medium">Support Team</span>
        </p>
      </div>
    </div>
  );
}
