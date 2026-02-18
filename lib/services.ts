import api from "./api";
import type {
  AuthResponse,
  User,
  Member,
  DashboardStats,
  MembershipPlan,
} from "@/types";

// Authentication Services
export const authService = {
  register: async (data: {
    gym_name: string;
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
    phone?: string;
  }) => {
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

// Member Services
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

  getStats: async () => {
    const response = await api.get("/members/stats");
    return response.data;
  },
};

// Dashboard Services
export const dashboardService = {
  getStats: async () => {
    const response = await api.get<DashboardStats>("/dashboard/stats");
    return response.data;
  },

  getRevenue: async (period?: string) => {
    const response = await api.get("/dashboard/revenue", {
      params: { period },
    });
    return response.data;
  },

  getAttendanceTrends: async (days?: number) => {
    const response = await api.get("/dashboard/attendance-trends", {
      params: { days },
    });
    return response.data;
  },
};

// Membership Plan Services
export const membershipPlanService = {
  getAll: async (activeOnly?: boolean) => {
    const response = await api.get("/membership-plans", {
      params: { active_only: activeOnly },
    });
    return response.data;
  },

  create: async (data: Partial<MembershipPlan>) => {
    const response = await api.post("/membership-plans", data);
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get(`/membership-plans/${id}`);
    return response.data;
  },

  update: async (id: string, data: Partial<MembershipPlan>) => {
    const response = await api.put(`/membership-plans/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    await api.delete(`/membership-plans/${id}`);
  },
};

// Attendance Services
export const attendanceService = {
  checkIn: async (memberId: string, notes?: string) => {
    const response = await api.post("/attendance/check-in", {
      member_id: memberId,
      notes,
    });
    return response.data;
  },

  checkInByQr: async (qrCode: string) => {
    const response = await api.post("/attendance/check-in-qr", {
      qr_code: qrCode,
    });
    return response.data;
  },

  checkOut: async (memberId: string) => {
    const response = await api.post("/attendance/check-out", {
      member_id: memberId,
    });
    return response.data;
  },

  getDailyStats: async (date?: string) => {
    const response = await api.get("/attendance/daily-stats", {
      params: { date },
    });
    return response.data;
  },

  getMemberStats: async (memberId: string) => {
    const response = await api.get(`/attendance/member/${memberId}/stats`);
    return response.data;
  },
};

// Class Services
export const classService = {
  getAll: async (params?: any) => {
    const response = await api.get("/classes", { params });
    return response.data;
  },

  create: async (data: any) => {
    const response = await api.post("/classes", data);
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get(`/classes/${id}`);
    return response.data;
  },

  update: async (id: string, data: any) => {
    const response = await api.put(`/classes/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    await api.delete(`/classes/${id}`);
  },

  bookClass: async (classId: string, memberId: string) => {
    const response = await api.post(`/classes/${classId}/book`, {
      member_id: memberId,
    });
    return response.data;
  },
};
