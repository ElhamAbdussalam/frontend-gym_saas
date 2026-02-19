"use client";

import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "@/lib/services";
import { useAuthStore } from "@/store/authStore";

const StatCard = ({ title, value, sub, icon, color }: any) => (
  <div className="bg-white rounded-xl p-6 shadow-sm border">
    <div className="flex items-center justify-between mb-4">
      <p className="text-sm font-medium text-gray-500">{title}</p>
      <span className="text-2xl">{icon}</span>
    </div>
    <p className={`text-3xl font-bold ${color || "text-gray-900"}`}>{value}</p>
    {sub && <p className="text-sm text-gray-400 mt-1">{sub}</p>}
  </div>
);

export default function DashboardPage() {
  const { user } = useAuthStore();
  const {
    data: stats,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: dashboardService.getStats,
  });

  const formatCurrency = (n: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(n);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-4xl animate-spin">⏳</div>
          <p className="text-gray-500 mt-2">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900">
          Welcome back, {user?.name?.split(" ")[0]}! 👋
        </h2>
        <p className="text-gray-500 mt-1">
          Here's what's happening at {user?.tenant?.name} today
        </p>
      </div>

      {/* Trial Banner */}
      {user?.tenant?.subscription_status === "trial" && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 flex items-center justify-between">
          <div>
            <p className="font-medium text-blue-800">
              🎉 You're on a free trial!
            </p>
            <p className="text-sm text-blue-600">
              Trial ends on{" "}
              {user?.tenant?.trial_ends_at
                ? new Date(user.tenant.trial_ends_at).toLocaleDateString(
                    "id-ID",
                  )
                : "N/A"}
            </p>
          </div>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700">
            Upgrade Plan
          </button>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Members"
          value={stats?.members?.total ?? 0}
          sub={`${stats?.members?.new_this_month ?? 0} new this month`}
          icon="👥"
          color="text-blue-600"
        />
        <StatCard
          title="Active Members"
          value={stats?.members?.active ?? 0}
          sub={`${stats?.members?.expired ?? 0} expired`}
          icon="✅"
          color="text-green-600"
        />
        <StatCard
          title="Today's Attendance"
          value={stats?.attendance?.today ?? 0}
          sub={`${stats?.attendance?.this_month ?? 0} this month`}
          icon="🚪"
          color="text-purple-600"
        />
        <StatCard
          title="Monthly Revenue"
          value={formatCurrency(stats?.revenue?.this_month ?? 0)}
          sub={`Today: ${formatCurrency(stats?.revenue?.today ?? 0)}`}
          icon="💰"
          color="text-yellow-600"
        />
      </div>

      {/* Second Row */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="Classes Today"
          value={stats?.classes?.today ?? 0}
          sub={`${stats?.classes?.upcoming ?? 0} upcoming`}
          icon="📅"
        />
        <StatCard
          title="This Week Attendance"
          value={stats?.attendance?.this_week ?? 0}
          icon="📈"
        />
        <StatCard
          title="Annual Revenue"
          value={formatCurrency(stats?.revenue?.this_year ?? 0)}
          icon="📊"
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl p-6 shadow-sm border">
        <h3 className="text-lg font-bold mb-4">⚡ Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {
              label: "Check-in Member",
              icon: "🚪",
              href: "/dashboard/attendance",
            },
            { label: "Add Member", icon: "➕", href: "/dashboard/members" },
            { label: "Schedule Class", icon: "📅", href: "/dashboard/classes" },
            { label: "View Reports", icon: "📊", href: "/dashboard/settings" },
          ].map((action) => (
            <a
              key={action.label}
              href={action.href}
              className="flex flex-col items-center p-4 bg-gray-50 rounded-lg hover:bg-blue-50 hover:border-blue-200 border border-transparent transition-all cursor-pointer"
            >
              <span className="text-3xl mb-2">{action.icon}</span>
              <span className="text-sm font-medium text-center">
                {action.label}
              </span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
