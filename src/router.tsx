import { AppInit } from '@wua/components/app-init';
import { createBrowserRouter, Navigate } from 'react-router';

const router = createBrowserRouter([
  {
    path: '',
    element: <AppInit />,
    children: [
      {
        path: 'auth',
        async lazy() {
          return await import('./pages/guard.non-registered');
        },
        children: [
          {
            index: true,
            async lazy() {
              return await import('./pages/OnboardingPage');
            },
          },
          {
            path: 'loading',
            async lazy() {
              return await import('./pages/AccountLoadingPage');
            },
          },
        ],
      },
      {
        path: '',
        async lazy() {
          return await import('./pages/guard.registered');
        },
        children: [
          {
            index: true,
            async lazy() {
              return await import('./pages/DashboardPage');
            },
          },
          {
            path: 'map-confirmation',
            async lazy() {
              return await import('./kyc/components/MapConfirmation');
            },
          },
        ],
      },
      {
        path: 'onboarding-flow',
        async lazy() {
          return await import('./pages/OnboardingFlow');
        },
      },
      {
        path: 'about',
        async lazy() {
          return await import('./pages/AboutPage');
        },
      },
      {
        path: 'phone/verification',
        async lazy() {
          return await import('./pages/PhoneVerification');
        },
      },
      {
        path: 'phone',
        async lazy() {
          return await import('./pages/PhoneInput');
        },
      },
      {
        path: 'qr-scan',
        async lazy() {
          return await import('./pages/GeneralQRScannerPage');
        },
      },
      {
        path: 'qr-scan/top-up',
        async lazy() {
          return await import('./pages/TopUpQRScannerPage');
        },
      },
      {
        path: 'qr-scan/offline',
        async lazy() {
          return await import('./pages/OfflineQRScannerPage');
        },
      },
      {
        path: 'agent',
        async lazy() {
          return await import('./pages/AgentPage');
        },
      },
      {
        path: 'share-handler',
        async lazy() {
          return await import('./pages/ShareHandlerPage');
        },
      },
      {
        path: 'qrcode',
        async lazy() {
          return await import('./pages/Qrcode');
        },
      },
      {
        path: 'top-up',
        async lazy() {
          return await import('./pages/TopUpPage');
        },
      },
      {
        path: 'success',
        async lazy() {
          return await import('./pages/SuccessPage');
        },
      },
      {
        path: 'contacts',
        async lazy() {
          return await import('./pages/ContactsPage');
        },
      },
      {
        path: 'payment-selection',
        async lazy() {
          return await import('./pages/PaymentSelectionPage');
        },
      },
      {
        path: 'settings',
        async lazy() {
          return await import('./kyc/pages/SettingsPage');
        },
      },
      {
        path: 'inputEmail',
        async lazy() {
          return await import('./kyc/pages/emailVerification');
        },
      },
      {
        path: 'emailCode',
        async lazy() {
          return await import('./kyc/pages/emailCode');
        },
      },
      {
        path: 'kyc',
        async lazy() {
          return await import('./kyc/pages/IdentityVerificationPage');
        },
      },
      {
        path: 'verification/id-card',
        async lazy() {
          return await import('./kyc/pages/IDCardForm');
        },
      },
      {
        path: 'verification/location',
        async lazy() {
          return await import('./kyc/components/LocationComponent');
        },
      },
      {
        path: 'verification/passport',
        async lazy() {
          return await import('./kyc/pages/PassportForm');
        },
      },
      {
        path: 'recoverAccount',
        async lazy() {
          return await import('./kyc/pages/RecoverAccountPage');
        },
      },
      {
        path: 'guidelines',
        async lazy() {
          return await import('./kyc/guidelines/GuidelinesPage');
        },
      },
      {
        path: 'verification/driving-license',
        async lazy() {
          return await import('./kyc/pages/DriverLicenseForm');
        },
      },
      {
        path: 'recovery/recoverytoken',
        async lazy() {
          return await import('./kyc/pages/RecoveryToken');
        },
      },
      {
        path: 'map-confirmation',
        async lazy() {
          return await import('./kyc/components/MapConfirmation');
        },
      },
      {
        path: 'kyc/imgs',
        async lazy() {
          return await import('./kyc/pages/DocumentImages');
        },
      },
      {
        path: 'login',
        async lazy() {
          return await import('./pages/Login');
        },
      },
      {
        path: 'agent-topup',
        async lazy() {
          return await import('./pages/AgentTopUpPage');
        },
      },
      {
        path: 'teller',
        async lazy() {
          return await import('./pages/TellerPage');
        },
      },
      {
        path: 'agency',
        async lazy() {
          return await import('./components/ProtectedRoute');
        },
        children: [
          {
            index: true,
            async lazy() {
              return await import('./kyc/pages/KycVerificationPage');
            },
          },
          {
            path: 'account-recovery',
            async lazy() {
              return await import('./kyc/pages/KycRecoveryPage');
            },
          },
          {
            path: 'recovery',
            children: [
              {
                path: 'recovery-scanner',
                async lazy() {
                  return await import('./kyc/pages/AccountRecoveryScannerPage');
                },
              },
              {
                path: 'account-confirmation',
                async lazy() {
                  return await import('./kyc/pages/AccountConfirmation');
                },
              },
              {
                path: 'recoverytoken',
                async lazy() {
                  return await import('./kyc/pages/RecoveryToken');
                },
              },
            ],
          },
        ],
      },
      {
        path: '*',
        element: <Navigate to='/' replace />,
      },
    ],
  },
]);

export { router };
