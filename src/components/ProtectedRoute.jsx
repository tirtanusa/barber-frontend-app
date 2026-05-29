import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const ProtectedRoute = ({ allowedRoles }) => {
  const { isLoggedIn, isLoading, user } = useContext(AuthContext);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin h-8 w-8 border-4 border-black border-t-transparent"></div>
        <span className="ml-3 font-mono text-sm text-black">Loading session...</span>
      </div>
    );
  }

  // Check if logged in
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  // Check authorization roles if specified
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
