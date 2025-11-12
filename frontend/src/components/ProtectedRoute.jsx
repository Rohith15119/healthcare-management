import { Navigate } from "react-router-dom";
import useAuthStore from "../store/auth.js";
export default function ProtectedRoute({ children, role }) {
  const { token, user } = useAuthStore();
  if (!token) return <Navigate to="/login" replace />;
  if (role && user?.role !== role)
    return <Navigate to={`/${user?.role || "login"}`} replace />;
  return children;
}
