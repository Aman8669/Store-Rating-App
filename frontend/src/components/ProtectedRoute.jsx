import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ allowedRoles }) => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Role matching according to user type
    if (user.role === 'SYSTEM_ADMIN') return <Navigate to="/admin-dashboard" replace />;
    if (user.role === 'STORE_OWNER') return <Navigate to="/owner-dashboard" replace />;
    return <Navigate to="/user-dashboard" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;