import React from "react";
import {
  FaShieldAlt,
  FaMobileAlt,
  FaQrcode,
  FaUserCheck,
  FaLock,
} from "react-icons/fa";

const AboutPage: React.FC = () => {
  const features = [
    {
      id: "feature-1",
      icon: <FaShieldAlt className="w-8 h-8 text-blue-600" />,
      title: "Secure Identity Verification",
      description:
        "Advanced KYC process ensuring your identity is verified with the highest security standards.",
    },
    {
      id: "feature-2",
      icon: <FaMobileAlt className="w-8 h-8 text-blue-600" />,
      title: "Mobile-First Experience",
      description:
        "Seamless mobile experience with easy document upload and verification process.",
    },
    {
      id: "feature-3",
      icon: <FaQrcode className="w-8 h-8 text-blue-600" />,
      title: "QR Code Integration",
      description:
        "Quick and secure transactions using our integrated QR code system.",
    },
    {
      id: "feature-4",
      icon: <FaUserCheck className="w-8 h-8 text-blue-600" />,
      title: "Agent Support",
      description:
        "Dedicated agent support for personalized assistance throughout your verification process.",
    },
    {
      id: "feature-5",
      icon: <FaLock className="w-8 h-8 text-blue-600" />,
      title: "End-to-End Encryption",
      description:
        "Your data is protected with industry-standard encryption protocols.",
    },
  ];

  const stats = [
    { id: "stat-1", number: "99.9%", label: "Verification Success Rate" },
    { id: "stat-2", number: "24/7", label: "Customer Support" },
    { id: "stat-3", number: "5M+", label: "Verified Users" },
    { id: "stat-4", number: "100+", label: "Security Measures" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 py-24 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
              About Us
            </h1>
            <p className="mt-6 text-xl max-w-3xl mx-auto">
              Revolutionizing digital banking with secure, user-friendly
              solutions for modern financial needs.
            </p>
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Our Mission
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
            At Webank, we're committed to providing secure, accessible, and
            innovative banking solutions. Our platform combines cutting-edge
            technology with user-centric design to deliver a seamless banking
            experience for everyone.
          </p>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.id}
                className="bg-gray-50 rounded-lg p-6 hover:shadow-lg transition-shadow duration-300"
              >
                <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mx-auto mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-center mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-center">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.id} className="text-center">
                <div className="text-4xl font-bold mb-2">{stat.number}</div>
                <div className="text-sm font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
