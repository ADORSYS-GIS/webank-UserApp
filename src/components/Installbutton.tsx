import { motion } from 'framer-motion';
import React from 'react';
import { FiDownloadCloud } from 'react-icons/fi';

interface InstallButtonProps {
  deferredPrompt: {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: string }>;
  } | null;
}

const InstallButton: React.FC<InstallButtonProps> = ({ deferredPrompt }) => {
  const handleInstallClick = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice
        .then((choiceResult) => {
          if (choiceResult.outcome === 'accepted') {
            console.log('Installation accepted');
          } else {
            console.log('Installation dismissed');
          }
        })
        .catch((err) => console.log('Installation error', err));
    }
  };

  return (
    <motion.button
      onClick={handleInstallClick}
      disabled={!deferredPrompt}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`
        relative overflow-hidden
        bg-gradient-to-r from-blue-400 to-purple-500
        backdrop-blur-lg backdrop-brightness-110
        text-white font-medium
        px-6 py-3 rounded-xl
        shadow-lg hover:shadow-xl
        transition-all duration-300
        group
        ${!deferredPrompt ? 'opacity-50 cursor-not-allowed' : ''}
      `}>
      {/* Animated background */}
      <div className='absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-20 transition-opacity' />

      {/* Content */}
      <div className='flex items-center space-x-2'>
        <FiDownloadCloud className='w-5 h-5 transform group-hover:scale-110 transition-transform' />
        <span className='text-sm bg-gradient-to-r from-cyan-100 to-blue-50 bg-clip-text text-transparent'>
          Install Webank
        </span>
      </div>

      {/* Glow effect */}
      <div className='absolute inset-0 rounded-xl pointer-events-none border border-white/10' />
    </motion.button>
  );
};

export default InstallButton;
