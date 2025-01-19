import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const isAuthenticated = !!token;

  // Debugging: Check if the token exists
  console.log('Token exists:', isAuthenticated);

  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default PrivateRoute;