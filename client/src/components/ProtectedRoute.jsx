import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
/**
 * Protects pages that require authentication.
 * Displays a loading message while authentication is checked.
 * Renders protected child routes for logged-in users.
 * Redirects unauthenticated users to the login page.
 */
export default function ProtectedRoute() {
  const { user, loading } = useAuth();

  if (loading) return <div className="screen-center">Loading...</div>;

  return user ? <Outlet /> : <Navigate to="/login" replace />;
}
