import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from "../context/AuthContext";

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth(); // Access the current user from AuthContext

  return user ? <>{children}</> : <Navigate to="/signin" />;
};

export default ProtectedRoute;
