"use client";

import { useAuthStore } from "@/store/authStore";
import { authService } from "@/lib/services";
import { useRouter } from "next/navigation";

export function useAuth() {
  const router = useRouter();
  const { user, token, isAuthenticated, setAuth, clearAuth } = useAuthStore();

  const login = async (email: string, password: string) => {
    const data = await authService.login(email, password);
    setAuth(data.user, data.access_token);
    router.push("/dashboard");
    return data;
  };

  const register = async (formData: any) => {
    const data = await authService.register(formData);
    setAuth(data.user, data.access_token);
    router.push("/dashboard");
    return data;
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch {
    } finally {
      clearAuth();
      router.push("/auth/login");
    }
  };

  return { user, token, isAuthenticated, login, register, logout };
}
