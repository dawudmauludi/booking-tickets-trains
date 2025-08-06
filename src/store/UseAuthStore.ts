// src/store/useAuthStore.ts
import { create } from "zustand";

type User = {
  id: string;
  name: string;
  email: string;
  password: string;
  role: string;
};

type AuthStore = {
  user: User | null;
  token: string | null;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
};

// ✅ Ambil dari localStorage saat store dibuat
const storedUser = localStorage.getItem("user");
const storedToken = localStorage.getItem("token");

export const useAuthStore = create<AuthStore>((set) => ({
  user: storedUser ? JSON.parse(storedUser) : null,
  token: storedToken ?? null,

  setAuth: (user, token) => {
    localStorage.setItem("token", token);
    localStorage.setItem("role", user.role);
    localStorage.setItem("user", JSON.stringify(user));
    set({ user, token });
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user");
    set({ user: null, token: null });
  },
}));
