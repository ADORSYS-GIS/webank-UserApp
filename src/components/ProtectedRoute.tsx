import { Navigate, Outlet } from 'react-router';

const ProtectedRoute = () => {
  // TODO: Replace with actual authentication logic
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';

  return isAuthenticated ? <Outlet /> : <Navigate to='/login' replace />;
};

export { ProtectedRoute as Component };
