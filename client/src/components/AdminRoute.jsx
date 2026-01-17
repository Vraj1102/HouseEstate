import React from "react";
import { useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router-dom";

export default function AdminRoute() {
  const { currentUser } = useSelector((state) => state.user);
  
  if (!currentUser) {
    return <Navigate to="/signin" />;
  }
  
  if (currentUser.role !== "admin") {
    return <Navigate to="/" />;
  }
  
  return <Outlet />;
}