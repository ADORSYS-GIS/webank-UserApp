// src/pages/PostRegistration.tsx
import { FC } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

interface LocationState {
  accountId: string;
  accountCert: string;
}

const PostRegistration: FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { accountId, accountCert } = (location.state || {}) as LocationState;

  const handleRecover = () => {
    navigate("/recover", { state: { accountId, accountCert } });
  };

  const handleSecure = () => {
    navigate("/kyc", { state: { accountId, accountCert } });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-white to-blue-50 px-6 py-12">
      <motion.div
        className="max-w-xl w-full bg-white rounded-2xl shadow-lg p-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-3xl sm:text-4xl font-extrabold text-center text-gray-800 mb-6">
          Welcome to WeBank!
        </h1>
        <p className="text-center text-gray-600 mb-10 leading-relaxed">
          Choose how you’d like to proceed:
        </p>

        <div className="flex flex-col sm:flex-row gap-6">
          <motion.button
            onClick={handleRecover}
            className="flex-1 py-4 rounded-xl shadow-md text-lg font-semibold border-2 border-blue-300 focus:outline-none focus:ring-4 focus:ring-blue-200"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            Recover My Account
          </motion.button>

          <motion.button
            onClick={handleSecure}
            className="flex-1 py-4 rounded-xl shadow-md text-lg font-semibold bg-gradient-to-r from-blue-500 to-indigo-600 text-white focus:outline-none focus:ring-4 focus:ring-indigo-200"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            Secure My Account
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default PostRegistration;
