// src/components/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";

export default function ProtectedRoute({ children, allowedRoles }) {
  const token = Cookies.get("authToken");
  const userCookie = Cookies.get("user");

  // transforma a string em objeto
  const user = userCookie ? JSON.parse(userCookie) : null;

  console.log(user?.roles, "roles do usuário");

  if (!token) {
    return <Navigate to="/" replace />;
  }

  if (allowedRoles && allowedRoles.length > 0) {
    const hasPermission = user?.roles?.some((role) =>
      allowedRoles.includes(role)
    );

    if (!hasPermission) {
      return <Navigate to="/view/unauthorized" replace />;
    }
  }

  return children;
}
