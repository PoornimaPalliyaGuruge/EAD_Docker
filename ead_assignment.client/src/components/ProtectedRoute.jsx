import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";

const ProtectedRoute = ({ children, role }) => {
  const { userData } = useContext(UserContext);

  console.log("User Data:", userData);
  console.log(
    "Role Check:",
    userData.role,
    userData?.role.some((r) => r.toLowerCase() === role.toLowerCase())
  );

  if (
    !userData ||
    !userData.role.some((r) => r.toLowerCase() === role.toLowerCase())
  ) {
    console.log("Redirecting to /login");
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;
