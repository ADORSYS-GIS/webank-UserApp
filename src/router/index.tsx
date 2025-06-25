import { RouterProvider, createRouter } from '@tanstack/react-router';
import { routeTree } from './routes/routeTree.ts';

const router = createRouter({
  routeTree,
});

export default function AppRouterProvider() {
  return <RouterProvider router={router} />;
} 