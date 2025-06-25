import { createRootRoute, Outlet } from '@tanstack/react-router';
import { coreRoutesGroup } from './coreRoutes';
import { authRoutesGroup } from './authRoutes';
import { kycRoutesGroup } from './kycRoutes';
import { qrRoutesGroup } from './qrRoutes';
import { errorRoutesGroup } from './errorRoutes';
// import { authRoutesGroup } from './authRoutes';
// import { kycRoutesGroup } from './kycRoutes';
// import { qrRoutesGroup } from './qrRoutes';
// import { errorRoutesGroup } from './errorRoutes';

export const rootRoute = createRootRoute({
  component: Outlet,
});

export const routeTree = rootRoute.addChildren([
  coreRoutesGroup,
  authRoutesGroup,
  kycRoutesGroup,
  qrRoutesGroup,
  errorRoutesGroup,
  // authRoutesGroup,
  // kycRoutesGroup,
  // qrRoutesGroup,
  // errorRoutesGroup,
]); 