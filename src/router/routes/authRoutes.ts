import { createRoute } from '@tanstack/react-router';
import { rootRoute } from './routeTree';
import AppLayout from '../../layouts/AppLayout';
import React, { lazy } from 'react';

const Login = lazy(() => import('@features/auth/pages/Login'));
const PhoneInput = lazy(() => import('@features/auth/pages/PhoneInput'));
const PhoneVerification = lazy(() => import('@features/auth/pages/PhoneVerification'));

const authParentRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'auth',
  component: AppLayout,
});

const authRoutes = [
  createRoute({
    path: '/login',
    getParentRoute: () => authParentRoute,
    component: Login,
  }),
  createRoute({
    path: '/phone',
    getParentRoute: () => authParentRoute,
    component: PhoneInput,
  }),
  createRoute({
    path: '/phone/verification',
    getParentRoute: () => authParentRoute,
    component: PhoneVerification,
  }),
];

export const authRoutesGroup = authParentRoute.addChildren(authRoutes); 