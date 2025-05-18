import React from 'react';
import { Link } from 'react-router';
import { Button } from '@wua/components/button.tsx';

const OnboardingPage: React.FC = () => {
  return (
    <div className="flex-grow flex md:items-center justify-between md:justify-center">
      <div className="w-full md:max-w-4xl md:mx-auto sm:px-6 lg:px-8 md:py-16">
        <div className="md:bg-white md:shadow-xl md:rounded-2xl overflow-hidden">
          <div className="md:flex">
            {/* Left illustration column */}
            <div className="md:w-1/2 bg-indigo-600 p-8 text-white flex flex-col justify-center">
              <div className="relative h-48 md:h-auto">
                <div className="relative z-10 text-center md:text-left">
                  <h2 className="text-2xl font-bold mb-4">
                    Banking Made Simple
                  </h2>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <svg
                        className="h-6 w-6 mr-2 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span>Open account in minutes</span>
                    </li>
                    <li className="flex items-start">
                      <svg
                        className="h-6 w-6 mr-2 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span>No paperwork or branch visits</span>
                    </li>
                    <li className="flex items-start">
                      <svg
                        className="h-6 w-6 mr-2 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span>Instant digital banking access</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Right content column */}
            <div className="md:w-1/2 p-8">
              <div className="text-center md:text-left">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
                  Ready to Begin?
                </h1>
                <p className="text-gray-600 mb-8">
                  Start your banking journey with us and enjoy a seamless
                  digital experience.
                </p>

                <div className="space-y-6">
                  <div className="bg-indigo-50 p-4 rounded-lg">
                    <h3 className="text-lg font-medium text-indigo-800 mb-2">
                      Account Opening Process
                    </h3>
                    <div className="flex items-center space-x-4">
                      <div
                        className="flex-shrink-0 h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold">
                        1
                      </div>
                      <div className="text-sm text-gray-700">
                        Create your account
                      </div>
                    </div>
                    <div className="h-6 border-l border-indigo-200 ml-4"></div>
                    <div className="flex items-center space-x-4">
                      <div
                        className="flex-shrink-0 h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold">
                        2
                      </div>
                      <div className="text-sm text-gray-700">
                        Verify your identity
                      </div>
                    </div>
                    <div className="h-6 border-l border-indigo-200 ml-4"></div>
                    <div className="flex items-center space-x-4">
                      <div
                        className="flex-shrink-0 h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold">
                        3
                      </div>
                      <div className="text-sm text-gray-700">
                        Access your new account
                      </div>
                    </div>
                  </div>

                  <Button
                    as={Link}
                    block
                    color='primary'
                    variant='filled'
                    to="/auth/loading"
                  >
                    Start Account Creation
                  </Button>

                  <p className="text-xs text-gray-500 text-center">
                    By continuing, you agree to our Terms of Service and
                    Privacy Policy.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { OnboardingPage as Component };
