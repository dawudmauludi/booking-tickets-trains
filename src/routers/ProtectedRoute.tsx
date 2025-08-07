import { Navigate } from "react-router";
import { useAuthStore } from "../store/UseAuthStore";

export default function ProtectedRoute({
  children,
  allowedRoles,
}: {
  children: React.ReactNode;
  allowedRoles?: string[];
}) {
  const user = useAuthStore((state) => state.user);

  // Jika belum login
  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }

  // Jika role tidak sesuai
  if (allowedRoles && !allowedRoles.includes(user.role ?? "")) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
}
