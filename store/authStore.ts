"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "@/types";

interface AuthState {
  user: User | null;
  token: string | null;
  setAuth: (user: User, token: string) => void;
  clearAuth: () => void;
  isAuthenticated: boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      setAuth: (user, token) => {
        console.log("🔐 AuthStore: setAuth called");
        console.log("👤 User:", user);
        console.log("🎫 Token:", token?.substring(0, 20) + "...");

        if (typeof window !== "undefined") {
          localStorage.setItem("token", token);
          console.log("💾 Token saved to localStorage");
        }

        set({ user, token, isAuthenticated: true });
        console.log("✅ AuthStore: State updated", {
          hasUser: !!user,
          hasToken: !!token,
          isAuthenticated: true,
        });
      },

      clearAuth: () => {
        console.log("🚪 AuthStore: clearAuth called");
        if (typeof window !== "undefined") {
          localStorage.removeItem("token");
          console.log("🗑️ Token removed from localStorage");
        }
        set({ user: null, token: null, isAuthenticated: false });
        console.log("✅ AuthStore: State cleared");
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
