import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LucideProps } from 'lucide-react';
import {
  Shield,
  Zap,
  Handshake,
  LineChart,
  Wallet,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Slide {
  icon: React.ComponentType<LucideProps>;
  topic: string;
  description: string;
}

const slides: Slide[] = [
  {
    icon: Wallet,
    topic: 'Your <span class="text-blue-600 font-semibold">Digital</span> Wallet',
    description: 'Access your secure banking wallet anytime, anywhere with just a few taps.'
  },
  {
    icon: Shield,
    topic: 'Bank-Grade <span class="text-blue-600 font-semibold">Security</span>',
    description: 'Your funds and transactions are protected with advanced encryption and security measures.'
  },
  {
    icon: Zap,
    topic: 'Instant <span class="text-blue-600 font-semibold">Access</span>',
    description: 'Send, receive, and manage your money instantly, 24/7 from anywhere in the world.'
  },
  {
    icon: Handshake,
    topic: 'Trusted by <span class="text-blue-600 font-semibold">Millions</span>',
    description: 'Join our global community of users who trust Webank for their daily banking needs.'
  },
  {
    icon: LineChart,
    topic: 'Smart <span class="text-blue-600 font-semibold">Financial</span> Growth',
    description: 'Track your spending, manage savings, and grow your wealth with intelligent features.'
  }
];

const OnboardingFlow: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(0);
  const navigate = useNavigate();

  const handleNext = () => {
    setDirection(1);
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      navigate('/dashboard');
    }
  };

  const handlePrevious = () => {
    setDirection(-1);
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const Icon = slides[currentSlide].icon;

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
      position: 'absolute' as const,
      top: 0,
      left: 0,
      right: 0
    }),
    center: {
      x: 0,
      opacity: 1,
      position: 'relative' as const
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
      position: 'absolute' as const,
      top: 0,
      left: 0,
      right: 0
    })
  };

  return (
    <div className="h-screen overflow-hidden bg-gradient-to-b from-blue-50 to-white flex flex-col font-['Inter']">
      {/* Progress Dots */}
      <div className="flex justify-center mt-8 space-x-3">
        {slides.map((_, index) => (
          <div
            key={index}
            className={`h-3 rounded-full transition-all duration-300 ${
              index === currentSlide ? 'bg-blue-600 w-8' : 'bg-blue-200 w-3'
            }`}
          />
        ))}
      </div>

      {/* Slide Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 relative">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={currentSlide}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "tween", duration: 0.1 },
              opacity: { duration: 0.1 }
            }}
            className="flex flex-col items-center justify-center w-full"
          >
            <div className="mb-12">
              <Icon 
                size={100}
                className="text-blue-600"
                strokeWidth={1.5}
              />
            </div>
            <h2 
              className="text-3xl font-bold text-center mb-3 text-gray-800 tracking-tight"
              dangerouslySetInnerHTML={{ __html: slides[currentSlide].topic }}
            />
            <p className="text-gray-600 text-center mb-8 max-w-md text-lg leading-relaxed">
              {slides[currentSlide].description}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Buttons */}
      <div className="p-6 flex justify-between items-center">
        <button
          onClick={handlePrevious}
          className={`px-8 py-3 bg-gray-600 rounded-xl font-semibold flex items-center space-x-3 transition-all duration-300 ${
            currentSlide === 0 
              ? 'invisible' 
              : 'text-white'
          }`}
        >
          <ArrowLeft size={20} />
          <span>Previous</span>
        </button>

        <button
          onClick={handleNext}
          className="px-8 py-3 bg-blue-600 text-white rounded-xl font-semibold flex items-center space-x-3 transition-all duration-300 shadow-lg hover:shadow-xl"
        >
          <span>{currentSlide === slides.length - 1 ? 'Finish' : 'Next'}</span>
          <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
};

export default OnboardingFlow; 