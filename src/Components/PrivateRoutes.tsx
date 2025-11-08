import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute: React.FC = () => {
  const token = localStorage.getItem('adminToken'); // same key as login
  return token ? <Outlet /> : <Navigate to="/" replace />;
};

export default PrivateRoute;
