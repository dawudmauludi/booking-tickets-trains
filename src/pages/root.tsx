// src/layouts/AppLayouts.tsx
import { Outlet, useNavigate } from "react-router";
import { useAuthStore } from "../store/UseAuthStore";

export default function AppLayouts() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/auth/login");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="p-4 bg-blue-600 text-white flex justify-between">
        <span>Booking Kereta</span>
        {user && (
          <button onClick={handleLogout} className="text-dark underline">
            Logout ({user.role})
          </button>
        )}
      </header>
      <main className="p-4">
        <Outlet />
      </main>
    </div>
  );
}
