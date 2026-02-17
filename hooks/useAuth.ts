"use client";

import { useAuthStore } from "@/store/authStore";
import { authService } from "@/lib/services";
import { useRouter } from "next/navigation";

export function useAuth() {
  const router = useRouter();
  const { user, token, setAuth, clearAuth, isAuthenticated } = useAuthStore();

  const login = async (email: string, password: string) => {
    try {
      const data = await authService.login(email, password);
      setAuth(data.user, data.access_token);
      router.push("/dashboard");
      return data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Login failed");
    }
  };

  const register = async (formData: any) => {
    try {
      const data = await authService.register(formData);
      setAuth(data.user, data.access_token);
      router.push("/dashboard");
      return data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Registration failed");
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      // Ignore errors
    } finally {
      clearAuth();
      router.push("/auth/login");
    }
  };

  return {
    user,
    token,
    isAuthenticated: isAuthenticated(),
    login,
    register,
    logout,
  };
}
