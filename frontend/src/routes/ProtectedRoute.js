/**
 * ProtectedRoute.jsx
 * Wrapper for authenticated routes
 * - Loading spinner during auth check
 * - Redirect to login if unauthenticated
 * - Render children if authenticated
 */

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { PageLoader } from '../components/Loader';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  // Show loader during auth check
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-50">
        <PageLoader />
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Role-based protection: Redirect to dashboard if trying to access admin route as non-admin
  if (adminOnly && user?.role !== "ADMIN") {
    return <Navigate to="/dashboard" replace />;
  }

  // Render children if authenticated and authorized
  return children;
};

export default ProtectedRoute;

