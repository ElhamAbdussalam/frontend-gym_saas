"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/api";
import { useAuthStore } from "@/store/authStore";

export default function LoginPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("🔐 Login attempt started");
    console.log("📧 Form data:", { email: form.email, password: "***" });

    setLoading(true);
    setError("");

    try {
      console.log(
        "📡 Sending login request to:",
        `${process.env.NEXT_PUBLIC_API_URL}/login`,
      );
      const res = await api.post("/login", form);

      console.log("✅ Login response received:", {
        status: res.status,
        hasUser: !!res.data.user,
        hasToken: !!res.data.access_token,
        user: res.data.user,
      });

      setAuth(res.data.user, res.data.access_token);
      console.log("💾 Auth data saved to store");

      console.log(
        "🔑 Token saved to localStorage:",
        localStorage.getItem("token"),
      );

      console.log("🚀 Attempting redirect to dashboard...");

      // Try Next.js router first
      try {
        await router.push("/dashboard");
        console.log("✅ Router.push executed");
      } catch (routerError) {
        console.error("❌ Router.push failed:", routerError);
        // Fallback to window.location
        console.log("🔄 Falling back to window.location.href");
        window.location.href = "/dashboard";
      }
    } catch (err: any) {
      console.error("❌ Login error:", err);
      console.error("📋 Error details:", {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
      });
      setError(
        err.response?.data?.message ||
          "Login failed. Please check your credentials.",
      );
    } finally {
      setLoading(false);
      console.log("🏁 Login process completed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white rounded-xl shadow-md p-8 w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold">🏋️ GymFlow</h1>
          <h2 className="text-xl font-semibold mt-2">Welcome back</h2>
          <p className="text-gray-500 text-sm">Sign in to your account</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-lg mb-4 text-sm">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="john@gym.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? "⏳ Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <Link
            href="/auth/register"
            className="text-blue-600 hover:underline font-medium"
          >
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}
