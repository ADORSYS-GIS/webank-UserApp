import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../store/Store";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import { FaRegClock, FaCheckCircle } from "react-icons/fa";
import { TbProgressCheck } from "react-icons/tb";

const UnderReview = () => {
  const navigate = useNavigate();
  const kycCert = useSelector((state: RootState) => state.account.kycCert);
  const [currentQuote, setCurrentQuote] = useState(0);
  const [currentImage, setCurrentImage] = useState(0);

  const illustrations = [
    "https://img.freepik.com/free-vector/work-time-concept-illustration_114360-1271.jpg",
    "https://img.freepik.com/free-vector/lateness-concept-illustration_114360-6170.jpg",
    "https://img.freepik.com/free-vector/reminders-concept-illustration_114360-4278.jpg",
    "https://img.freepik.com/free-vector/waiting-room-with-sofa-concept-illustration_114360-17587.jpg"
  ];

  const quotes = [
    "Securing your financial future...",
    "Precision requires careful time...",
    "Crafting your unique safety blueprint...",
    "Excellence is worth the patience...",
    "Building your financial fortress...",
    "Quality assurance in progress...",
    "Finalizing your secure access...",
    "Optimizing your digital vault..."
  ];

  useEffect(() => {
    const quoteInterval = setInterval(() => {
      setCurrentQuote(prev => (prev + 1) % quotes.length);
      setCurrentImage(prev => (prev + 1) % illustrations.length);
    }, 5000);

    const certCheckInterval = setInterval(() => {
      if (kycCert) navigate("/dashboard");
    }, 3000);

    return () => {
      clearInterval(quoteInterval);
      clearInterval(certCheckInterval);
    };
  }, [kycCert, navigate, quotes.length, illustrations.length]);

  const handleActionClick = (callback: () => void) => {
    if (kycCert === null) {
      toast.warning("Please complete the KYC process to proceed.");
      return;
    }
    callback();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full text-center space-y-8">
        <div className="relative h-96 mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentImage}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              transition={{ duration: 0.8 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <img
                src={illustrations[currentImage]}
                alt="Verification progress"
                className="h-96 object-contain rounded-xl shadow-lg"
              />
            </motion.div>
          </AnimatePresence>

          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-8">
            <motion.div
              className="w-20 h-20 bg-white rounded-full shadow-2xl flex items-center justify-center cursor-pointer border-4 border-indigo-100"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleActionClick(() => navigate("/dashboard"))}
            >
              {kycCert ? (
                <FaCheckCircle className="w-12 h-12 text-emerald-500" />
              ) : (
                <TbProgressCheck className="w-12 h-12 text-indigo-600" />
              )}
            </motion.div>
          </div>
        </div>

        <div className="space-y-6">
          <motion.h1 
            className="text-4xl font-bold text-slate-800"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {kycCert ? "Verification Complete" : "Application Under Review"}
          </motion.h1>

          <AnimatePresence mode="wait">
            <motion.p
              key={currentQuote}
              className="text-xl text-slate-600 italic min-h-[60px]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              "{quotes[currentQuote]}"
            </motion.p>
          </AnimatePresence>

          <div className="inline-flex items-center text-slate-500 space-x-3">
            <FaRegClock className="animate-pulse w-5 h-5" />
            <span className="font-medium">
              {kycCert ? "Redirecting..." : "Estimated completion: 2-5 minutes"}
            </span>
          </div>
        </div>

        {!kycCert && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="pt-8 max-w-md mx-auto"
          >
            <div className="relative h-2 bg-slate-100 rounded-full overflow-hidden">
              <motion.div
                className="absolute h-full bg-gradient-to-r from-indigo-400 to-blue-400"
                initial={{ width: "0%" }}
                animate={{ width: "65%" }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "mirror",
                  ease: "easeInOut"
                }}
              />
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default UnderReview;