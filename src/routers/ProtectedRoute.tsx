import { Navigate } from "react-router";
import { useAuthStore } from "../store/UseAuthStore";

export default function ProtectedRoute({
  children,
  allowedRoles,
}: {
  children: React.ReactNode;
  allowedRoles?: string[];
}) {
  const { user } = useAuthStore();

  if (!user) return <Navigate to="/auth/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/unauthorized" replace />;

  return <>{children}</>;
}
