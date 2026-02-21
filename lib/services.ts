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
    console.log("👥 Creating member with data:", data);
    try {
      const response = await api.post("/members", data);
      console.log("✅ Member created successfully:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("❌ Member creation failed:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        config: error.config,
      });
      throw error;
    }
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
    console.log("🚪 Check-in member:", memberId);
    try {
      const response = await api.post("/attendance/check-in", {
        member_id: memberId,
        notes,
      });
      console.log("✅ Check-in successful:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("❌ Check-in failed:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      throw error;
    }
  },

  checkInByQr: async (qrCode: string) => {
    console.log("📱 Check-in by QR:", qrCode);
    try {
      const response = await api.post("/attendance/check-in-qr", {
        qr_code: qrCode,
      });
      console.log("✅ QR check-in successful:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("❌ QR check-in failed:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      throw error;
    }
  },

  checkOut: async (memberId: string) => {
    console.log("🚶 Check-out member:", memberId);
    try {
      const response = await api.post("/attendance/check-out", {
        member_id: memberId,
      });
      console.log("✅ Check-out successful:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("❌ Check-out failed:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      throw error;
    }
  },

  getDailyStats: async (date?: string) => {
    console.log("📊 Fetching daily stats for:", date || "today");
    try {
      const response = await api.get("/attendance/daily-stats", {
        params: { date },
      });
      console.log("✅ Daily stats received:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("❌ Daily stats fetch failed:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        url: "/attendance/daily-stats",
        params: { date },
      });
      // Return empty stats on error
      return {
        total_checkins: 0,
        still_inside: 0,
        checked_out: 0,
      };
    }
  },

  getMemberStats: async (memberId: string) => {
    console.log("📈 Fetching member stats:", memberId);
    try {
      const response = await api.get(`/attendance/member/${memberId}/stats`);
      console.log("✅ Member stats received:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("❌ Member stats fetch failed:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      throw error;
    }
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
