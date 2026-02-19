"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/store/authStore";
import api from "@/lib/api";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: "📊" },
  { href: "/dashboard/members", label: "Members", icon: "👥" },
  {
    href: "/dashboard/membership-plans",
    label: "Membership Plans",
    icon: "💳",
  },
  { href: "/dashboard/attendance", label: "Attendance", icon: "✅" },
  { href: "/dashboard/classes", label: "Classes", icon: "🏋️" },
  { href: "/dashboard/users", label: "Staff & Trainers", icon: "👨‍💼" },
  { href: "/dashboard/settings", label: "Settings", icon: "⚙️" },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, token, clearAuth } = useAuthStore();

  useEffect(() => {
    if (!token) {
      router.push("/auth/login");
    }
  }, [token, router]);

  const handleLogout = async () => {
    try {
      await api.post("/logout");
    } catch {}
    clearAuth();
    router.push("/auth/login");
  };

  if (!token) return null;

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-gray-700">
          <h1 className="text-2xl font-bold">🏋️ GymFlow</h1>
          <p className="text-xs text-gray-400 mt-1 truncate">
            {user?.tenant?.name || "Your Gym"}
          </p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-sm font-medium ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "text-gray-300 hover:bg-gray-800 hover:text-white"
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* User & Logout */}
        <div className="p-4 border-t border-gray-700">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-sm font-bold">
              {user?.name?.charAt(0) || "U"}
            </div>
            <div>
              <p className="text-sm font-medium truncate">{user?.name}</p>
              <p className="text-xs text-gray-400 capitalize">{user?.role}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
          >
            🚪 Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
