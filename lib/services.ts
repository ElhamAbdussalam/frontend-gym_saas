import api from "./api";
import type { AuthResponse, User, Member, DashboardStats } from "@/types";

export const authService = {
  register: async (data: any) => {
    const response = await api.post<AuthResponse>("/register", data);
    return response.data;
  },

  login: async (email: string, password: string) => {
    const response = await api.post<AuthResponse>("/login", {
      email,
      password,
    });
    return response.data;
  },

  logout: async () => {
    await api.post("/logout");
  },

  getCurrentUser: async () => {
    const response = await api.get<User>("/me");
    return response.data;
  },
};

export const memberService = {
  getAll: async (params?: any) => {
    const response = await api.get("/members", { params });
    return response.data;
  },

  create: async (data: Partial<Member>) => {
    const response = await api.post("/members", data);
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get(`/members/${id}`);
    return response.data;
  },

  update: async (id: string, data: Partial<Member>) => {
    const response = await api.put(`/members/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    await api.delete(`/members/${id}`);
  },
};

export const dashboardService = {
  getStats: async () => {
    const response = await api.get<DashboardStats>("/dashboard/stats");
    return response.data;
  },
};
