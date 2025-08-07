// src/store/AuthStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

type User = {
  id: string;
  name: string;
  email: string;
  created_at: string;
};

interface AuthState {
  user: User | null;
  token: string | null;
  expires_at: string | null;

  login: (user: User, token: string, expires_at: string) => void;
  logout: () => void;
  isLoggedIn: () => boolean;
  isTokenExpired: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      expires_at: null,

      login: (user, token, expires_at) => {
        set({ user, token, expires_at });
      },

      logout: () => {
        set({ user: null, token: null, expires_at: null });
      },

      isLoggedIn: () => {
        const { token, expires_at } = get();
        if (!token || !expires_at) return false;
        return new Date(expires_at) > new Date();
      },

      isTokenExpired: () => {
        const { expires_at } = get();
        if (!expires_at) return true;
        return new Date(expires_at) < new Date();
      },
    }),
    {
      name: "auth-storage", 
    }
  )
);
