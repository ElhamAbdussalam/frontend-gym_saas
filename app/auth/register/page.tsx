"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/api";
import { useAuthStore } from "@/store/authStore";

export default function RegisterPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const [form, setForm] = useState({
    gym_name: "",
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    phone: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    try {
      const res = await api.post("/register", form);
      setAuth(res.data.user, res.data.access_token);
      router.push("/dashboard");
    } catch (err: any) {
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const fields = [
    {
      name: "gym_name",
      label: "Gym Name",
      placeholder: "FitLife Gym",
      type: "text",
    },
    { name: "name", label: "Your Name", placeholder: "John Doe", type: "text" },
    {
      name: "email",
      label: "Email",
      placeholder: "john@gym.com",
      type: "email",
    },
    {
      name: "phone",
      label: "Phone (Optional)",
      placeholder: "+628123456789",
      type: "text",
    },
    {
      name: "password",
      label: "Password",
      placeholder: "••••••••",
      type: "password",
    },
    {
      name: "password_confirmation",
      label: "Confirm Password",
      placeholder: "••••••••",
      type: "password",
    },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12">
      <div className="bg-white rounded-xl shadow-md p-8 w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold">🏋️ GymFlow</h1>
          <h2 className="text-xl font-semibold mt-2">
            Create Your Gym Account
          </h2>
          <p className="text-gray-500 text-sm">
            Start your 14-day free trial today
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {fields.map(({ name, label, placeholder, type }) => (
            <div key={name}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {label}
              </label>
              <input
                name={name}
                type={type}
                className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors[name] ? "border-red-400" : "border-gray-300"
                }`}
                placeholder={placeholder}
                value={form[name as keyof typeof form]}
                onChange={handleChange}
                required={name !== "phone"}
                minLength={name === "password" ? 8 : undefined}
              />
              {errors[name] && (
                <p className="text-red-500 text-xs mt-1">{errors[name][0]}</p>
              )}
            </div>
          ))}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? "⏳ Creating account..." : "🚀 Start Free Trial"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            href="/auth/login"
            className="text-blue-600 hover:underline font-medium"
          >
            Login here
          </Link>
        </p>

        <p className="mt-2 text-center text-xs text-gray-400">
          No credit card required • 14-day free trial
        </p>
      </div>
    </div>
  );
}
