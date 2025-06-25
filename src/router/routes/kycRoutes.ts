import { createRoute } from '@tanstack/react-router';
import { rootRoute } from './routeTree';
import AppLayout from '../../layouts/AppLayout';
import React, { lazy } from 'react';

const SettingsPage = lazy(() => import('@features/kyc/pages/SettingsPage'));
const EmailVerification = lazy(() => import('@features/kyc/pages/emailVerification'));
const EmailCode = lazy(() => import('@features/kyc/pages/emailCode'));
const IdentityVerificationPage = lazy(() => import('@features/kyc/pages/IdentityVerificationPage'));
const IDCardForm = lazy(() => import('@features/kyc/pages/IDCardForm'));
const DriverLicenseForm = lazy(() => import('@features/kyc/pages/DriverLicenseForm'));
const PassportForm = lazy(() => import('@features/kyc/pages/PassportForm'));
const LocationComponent = lazy(() => import('@features/kyc/components/LocationComponent'));
const KYCPage = lazy(() => import('@features/kyc/pages/KycVerificationPage'));
const KycCertChecker = lazy(() => import('@features/kyc/pages/KycCertChecker'));
const RecoverAccountPage = lazy(() => import('@features/kyc/pages/RecoverAccountPage'));
const RecoveryDashboard = lazy(() => import('@features/kyc/pages/KycRecoveryPage'));
const AccountRecoveryScannerPage = lazy(() => import('@features/kyc/pages/AccountRecoveryScannerPage'));
const RecoveryToken = lazy(() => import('@features/kyc/pages/RecoveryToken'));
const AccountConfirmation = lazy(() => import('@features/kyc/pages/AccountConfirmation'));
const MapConfirmation = lazy(() => import('@features/kyc/components/MapConfirmation'));
const DocumentImages = lazy(() => import('@features/kyc/pages/DocumentImages'));
const GuidelinesPage = lazy(() => import('@features/kyc/guidelines/GuidelinesPage'));

const kycParentRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'kyc',
  component: AppLayout,
});

const kycRoutes = [
  createRoute({ path: '/settings', getParentRoute: () => kycParentRoute, component: SettingsPage }),
  createRoute({ path: '/inputEmail', getParentRoute: () => kycParentRoute, component: EmailVerification }),
  createRoute({ path: '/emailCode', getParentRoute: () => kycParentRoute, component: EmailCode }),
  createRoute({ path: '/kyc', getParentRoute: () => kycParentRoute, component: IdentityVerificationPage }),
  createRoute({ path: '/verification/id-card', getParentRoute: () => kycParentRoute, component: IDCardForm }),
  createRoute({ path: '/verification/location', getParentRoute: () => kycParentRoute, component: LocationComponent }),
  createRoute({ path: '/verification/passport', getParentRoute: () => kycParentRoute, component: PassportForm }),
  createRoute({ path: '/recoverAccount', getParentRoute: () => kycParentRoute, component: RecoverAccountPage }),
  createRoute({ path: '/guidelines', getParentRoute: () => kycParentRoute, component: GuidelinesPage }),
  createRoute({ path: '/verification/driving-license', getParentRoute: () => kycParentRoute, component: DriverLicenseForm }),
  createRoute({ path: '/recovery/recoverytoken', getParentRoute: () => kycParentRoute, component: RecoveryToken }),
  createRoute({ path: '/map-confirmation', getParentRoute: () => kycParentRoute, component: MapConfirmation }),
  createRoute({ path: '/kyc/imgs', getParentRoute: () => kycParentRoute, component: DocumentImages }),
  createRoute({ path: '/agency', getParentRoute: () => kycParentRoute, component: KYCPage }),
  createRoute({ path: '/account-recovery', getParentRoute: () => kycParentRoute, component: RecoveryDashboard }),
  createRoute({ path: '/recovery/recovery-scanner', getParentRoute: () => kycParentRoute, component: AccountRecoveryScannerPage }),
  createRoute({ path: '/recovery/account-confirmation', getParentRoute: () => kycParentRoute, component: AccountConfirmation }),
];

export const kycRoutesGroup = kycParentRoute.addChildren(kycRoutes); 