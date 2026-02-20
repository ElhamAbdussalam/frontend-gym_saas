"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function RouteDebugger() {
  const pathname = usePathname();

  useEffect(() => {
    console.log("📍 Current Route:", pathname);
    console.log("🗂️ Available Routes:");
    console.log("  - / (Landing)");
    console.log("  - /auth/login");
    console.log("  - /auth/register");
    console.log("  - /dashboard");
    console.log("  - /dashboard/members");
    console.log("  - /dashboard/attendance");
    console.log("  - /dashboard/classes");
    console.log("  - /dashboard/users");
    console.log("  - /dashboard/settings");

    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    console.log("🔑 Auth Status:", {
      hasToken: !!token,
      hasUser: !!user,
      tokenLength: token?.length,
    });
  }, [pathname]);

  // Only show in development
  if (process.env.NODE_ENV !== "development") return null;

  return (
    <div className="fixed bottom-4 right-4 bg-black/80 text-white text-xs p-3 rounded-lg shadow-lg z-50 max-w-xs">
      <div className="font-bold mb-1">🐛 Debug Info</div>
      <div>Route: {pathname}</div>
      <div>Env: {process.env.NODE_ENV}</div>
      <div>API: {process.env.NEXT_PUBLIC_API_URL}</div>
    </div>
  );
}
