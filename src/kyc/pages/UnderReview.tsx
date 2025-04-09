import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../store/Store";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { FaRegClock, FaCheckCircle } from "react-icons/fa";
import { TbProgressCheck } from "react-icons/tb";

const UnderReview = () => {
  const navigate = useNavigate();
  const kycCert = useSelector((state: RootState) => state.account.kycCert);
  const [currentQuote, setCurrentQuote] = useState(0);
  const [isAnimating, setIsAnimating] = useState(true);

  const quotes = [
    "Good things come to those who wait...",
    "Securing your financial future...",
    "Excellence is worth the patience...",
    "Crafting your secure identity...",
    "Final touches of perfection..."
  ];

  useEffect(() => {
    const quoteInterval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % quotes.length);
    }, 5000);

    const certCheckInterval = setInterval(() => {
      if (kycCert) {
        navigate("/dashboard"); // Replace with your success route
      }
    }, 3000);

    return () => {
      clearInterval(quoteInterval);
      clearInterval(certCheckInterval);
    };
  }, [kycCert, navigate, quotes.length]);

  const handleActionClick = (callback: () => void) => {
    if (kycCert === null) {
      toast.warning("Please complete the KYC process to proceed.");
      return;
    }
    callback();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center space-y-8">
        <motion.div 
          className="relative mx-auto w-64 h-64"
          animate={isAnimating ? "visible" : "hidden"}
          onHoverStart={() => setIsAnimating(false)}
          onHoverEnd={() => setIsAnimating(true)}
        >
          {/* Central Icon */}
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <motion.div
              className="w-20 h-20 bg-white rounded-full shadow-2xl flex items-center justify-center cursor-pointer"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleActionClick(() => navigate("/dashboard"))}
            >
              {kycCert ? (
                <FaCheckCircle className="w-12 h-12 text-emerald-500" />
              ) : (
                <TbProgressCheck className="w-12 h-12 text-indigo-600" />
              )}
            </motion.div>
          </div>

          {/* Orbital Animation */}
          <motion.div
            className="absolute w-full h-full border-2 border-indigo-100 rounded-full"
            animate={{
              rotate: 360,
              transition: { repeat: Infinity, duration: 12, ease: "linear" }
            }}
          />
          
          <motion.div
            className="absolute left-1/2 top-0 -ml-3 w-6 h-6 bg-indigo-500 rounded-full"
            animate={{
              rotate: -360,
              transition: { repeat: Infinity, duration: 8, ease: "linear" }
            }}
          />
          
          <motion.div
            className="absolute right-0 top-1/2 -mt-3 w-6 h-6 bg-blue-400 rounded-full"
            animate={{
              rotate: 360,
              transition: { repeat: Infinity, duration: 10, ease: "linear" }
            }}
          />
        </motion.div>

        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-gray-800">
            {kycCert ? "Verification Complete!" : "Application Under Review"}
          </h1>
          
          <p className="text-xl text-gray-600 transition-all duration-500">
            {quotes[currentQuote]}
          </p>

          <div className="inline-flex items-center text-gray-500 space-x-2">
            <FaRegClock className="animate-pulse" />
            <span className="font-medium">
              {kycCert ? "Redirecting..." : "Estimated time: 2-5 minutes"}
            </span>
          </div>
        </div>

        {!kycCert && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="pt-8 max-w-xs mx-auto"
          >
            <div className="relative pt-1">
              <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-100">
                <motion.div
                  className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-500"
                  initial={{ width: "0%" }}
                  animate={{ width: "60%" }}
                  transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                />
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default UnderReview;