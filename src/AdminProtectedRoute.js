import React from "react";
import { useAuth } from "./contexts/AuthContext";
import { Navigate } from "react-router-dom";

export const AdminProtectedRoute = ({ children }) => {
  const { isUserAdmin } = useAuth();

  if (!isUserAdmin) return <Navigate to="/" />;
  return children;
};
