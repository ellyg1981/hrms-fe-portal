import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LoadingScreen from '../common/LoadingScreen/LoadingScreen';
import UnauthorizedPage from '../../pages/Unauthorized/UnauthorizedPage';

/**
 * Route guard for protected pages.
 *
 * - Shows the loading screen while the auth provider verifies an existing
 *   session on startup.
 * - Redirects unauthenticated users to /login, preserving the intended
 *   destination so it can be restored after login.
 * - Renders an Access Denied page for users who are authenticated but do not
 *   have the required permission.
 */
function ProtectedRoute({ children, requirePermission }) {
  const { isInitializing, isAuthenticated, can } = useAuth();
  const location = useLocation();

  if (isInitializing) {
    return <LoadingScreen message="Checking your session..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (requirePermission && !can(requirePermission.module, requirePermission.action)) {
    return <UnauthorizedPage />;
  }

  return children;
}

export default ProtectedRoute;
