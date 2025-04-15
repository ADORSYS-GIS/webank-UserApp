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
    navigate("/recoverAccount", { state: { accountId, accountCert } });
  };

  const handleSecure = () => {
    navigate("/kyc", { state: { accountId, accountCert } });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-white to-blue-50 px-4 ">
      <motion.div
        className="max-w-4xl w-full bg-white rounded-2xl shadow-lg p-6 md:p-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-center text-gray-800 mb-1 md:mb-6">
          Welcome to WeBank!
        </h1>
        <p className="text-center text-gray-600 mb-8 md:mb-10 leading-relaxed">
          Choose how you'd like to proceed:
        </p>

        <div className="flex flex-row flex-wrap justify-center gap-4 md:gap-8">
          <motion.div
            className="w-full sm:w-[48%] md:w-[45%] flex flex-col items-center"
            whileHover={{ scale: 1.02 }}
          >
            <img
              src="/recover.jpg"
              alt="Recover Account"
              className="w-full h-auto max-h-40 md:max-h-48 object-contain mb-3 md:mb-4"
            />
            <motion.button
              onClick={handleRecover}
              className="w-full py-3 md:py-4 rounded-xl shadow-md text-base md:text-lg font-semibold border-2 border-blue-300 focus:outline-none focus:ring-4 focus:ring-blue-200"
              whileTap={{ scale: 0.97 }}
            >
              Recover My Account
            </motion.button>
            <p className="mt-2 md:mt-3 text-center text-gray-500 text-xs md:text-sm px-2">
              Restore access to your existing account using your recovery
              credentials
            </p>
          </motion.div>

          <motion.div
            className="w-full sm:w-[48%] md:w-[45%] flex flex-col items-center"
            whileHover={{ scale: 1.02 }}
          >
            <img
              src="/secure.jpg"
              alt="Secure Account"
              className="w-full h-auto max-h-40 md:max-h-48 object-contain mb-3 md:mb-4"
            />
            <motion.button
              onClick={handleSecure}
              className="w-full py-3 md:py-4 rounded-xl shadow-md text-base md:text-lg font-semibold bg-gradient-to-r from-blue-500 to-indigo-600 text-white focus:outline-none focus:ring-4 focus:ring-indigo-200"
              whileTap={{ scale: 0.97 }}
            >
              Secure My Account
            </motion.button>
            <p className="mt-2 md:mt-3 text-center text-gray-500 text-xs md:text-sm px-2">
              Complete verification to enhance your account security and access
              all features
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default PostRegistration;
