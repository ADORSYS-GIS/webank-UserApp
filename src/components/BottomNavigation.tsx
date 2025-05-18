//NO
import {
  faAddressBook,
  faCog,
  faHome,
  faQrcode,
  faUserTie,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import AccountQRModal from '../pages/AccountQr';
import { Component as AgentPage } from '../pages/AgentPage';

interface BottomNavigationProps {
  accountId: string | undefined;
  accountCert: string | undefined;
  toggleMenu: () => void; // NOSONAR
}

const BottomNavigation: React.FC<BottomNavigationProps> = ({
  accountId,
  accountCert,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [isAgentModalOpen, setIsAgentModalOpen] = useState(false);

  const openQRModal = () => {
    setIsQRModalOpen(true);
  };

  const closeQRModal = () => {
    setIsQRModalOpen(false);
  };

  const openAgentModal = () => {
    setIsAgentModalOpen(true);
  };

  const closeAgentModal = () => {
    setIsAgentModalOpen(false);
  };

  return (
    <>
      <div className='fixed bottom-0 left-0 right-0 md:left-auto md:right-auto md:w-[750px] md:mx-auto bg-white shadow-lg border-t border-gray-200 z-10'>
        <div className='flex justify-around items-center h-16'>
          <button
            onClick={() => navigate('/', { state: { accountId, accountCert } })}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                navigate('/', { state: { accountId, accountCert } });
              }
            }}
            className='flex flex-col items-center justify-center w-1/4 h-full text-center'
            role='tab'
            aria-selected={location.pathname === '/'}
            tabIndex={0}>
            <FontAwesomeIcon
              icon={faHome}
              className={`text-lg ${
                location.pathname === '/' ? 'text-blue-500' : 'text-gray-500'
              }`}
            />
            <span
              className={`text-xs mt-1 ${
                location.pathname === '/' ? 'text-blue-500' : 'text-gray-500'
              }`}>
              Home
            </span>
          </button>

          <button
            onClick={openQRModal}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                openQRModal();
              }
            }}
            className='flex flex-col items-center justify-center w-1/4 h-full text-center'
            role='tab'
            aria-selected={isQRModalOpen}
            tabIndex={0}>
            <FontAwesomeIcon
              icon={faQrcode}
              className={`text-lg ${
                isQRModalOpen ? 'text-blue-500' : 'text-gray-500'
              }`}
            />
            <span
              className={`text-xs mt-1 ${
                isQRModalOpen ? 'text-blue-500' : 'text-gray-500'
              }`}>
              My Code
            </span>
          </button>

          <button
            onClick={() =>
              navigate('/settings', { state: { accountId, accountCert } })
            }
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                navigate('/settings', { state: { accountId, accountCert } });
              }
            }}
            className='flex flex-col items-center justify-center w-1/4 h-full text-center'
            role='tab'
            aria-selected={location.pathname === '/settings'}
            tabIndex={0}>
            <FontAwesomeIcon
              icon={faCog}
              className={`text-lg ${
                location.pathname === '/settings'
                  ? 'text-blue-500'
                  : 'text-gray-500'
              }`}
            />
            <span
              className={`text-xs mt-1 ${
                location.pathname === '/settings'
                  ? 'text-blue-500'
                  : 'text-gray-500'
              }`}>
              Settings
            </span>
          </button>

          <button
            onClick={() =>
              navigate('/contacts', { state: { accountId, accountCert } })
            }
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                navigate('/contacts', { state: { accountId, accountCert } });
              }
            }}
            className='flex flex-col items-center justify-center w-1/4 h-full text-center'
            role='tab'
            aria-selected={location.pathname === '/contacts'}
            tabIndex={0}>
            <FontAwesomeIcon
              icon={faAddressBook}
              className={`text-lg ${
                location.pathname === '/contacts'
                  ? 'text-blue-500'
                  : 'text-gray-500'
              }`}
            />
            <span
              className={`text-xs mt-1 ${
                location.pathname === '/contacts'
                  ? 'text-blue-500'
                  : 'text-gray-500'
              }`}>
              Contacts
            </span>
          </button>

          <button
            onClick={openAgentModal}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                openAgentModal();
              }
            }}
            className='flex flex-col items-center justify-center w-1/4 h-full text-center'
            role='tab'
            aria-selected={isAgentModalOpen}
            tabIndex={0}>
            <FontAwesomeIcon
              icon={faUserTie}
              className={`text-lg ${
                isAgentModalOpen ? 'text-blue-500' : 'text-gray-500'
              }`}
            />
            <span
              className={`text-xs mt-1 ${
                isAgentModalOpen ? 'text-blue-500' : 'text-gray-500'
              }`}>
              Agent
            </span>
          </button>
        </div>
      </div>

      {/* QR Code Modal */}
      <AccountQRModal isOpen={isQRModalOpen} onClose={closeQRModal} />

      {/* Agent Modal - Pass the onClose prop */}
      {isAgentModalOpen && <AgentPage onClose={closeAgentModal} />}
    </>
  );
};

export default BottomNavigation;
