import { createRoute } from '@tanstack/react-router';
import { rootRoute } from './routeTree';
import AppLayout from '../../layouts/AppLayout';
import React, { lazy } from 'react';

const NotFoundPage = lazy(() => import('@shared/pages/NotFoundPage'));

const errorParentRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'error',
  component: AppLayout,
});

const errorRoutes = [
  createRoute({
    path: '*',
    getParentRoute: () => errorParentRoute,
    component: NotFoundPage,
  }),
];

export const errorRoutesGroup = errorParentRoute.addChildren(errorRoutes); 