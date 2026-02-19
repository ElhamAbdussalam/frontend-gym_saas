"use client";

import { useState } from "react";
import { useAuthStore } from "@/store/authStore";
import api from "@/lib/api";

export default function SettingsPage() {
  const { user, setAuth, token } = useAuthStore();
  const [activeTab, setActiveTab] = useState<"profile" | "gym" | "password">(
    "profile",
  );

  const [profileForm, setProfileForm] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
  });
  const [gymForm, setGymForm] = useState({
    name: user?.tenant?.name || "",
    email: user?.tenant?.email || "",
    phone: user?.tenant?.phone || "",
    address: user?.tenant?.address || "",
  });
  const [passwordForm, setPasswordForm] = useState({
    password: "",
    password_confirmation: "",
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const showMsg = (type: "success" | "error", text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await api.put(`/users/${user?.id}`, profileForm);
      setAuth({ ...user!, ...res.data.user }, token!);
      showMsg("success", "✅ Profile updated successfully!");
    } catch {
      showMsg("error", "❌ Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.password !== passwordForm.password_confirmation) {
      showMsg("error", "❌ Passwords do not match");
      return;
    }
    setSaving(true);
    try {
      await api.put(`/users/${user?.id}`, passwordForm);
      setPasswordForm({ password: "", password_confirmation: "" });
      showMsg("success", "✅ Password changed successfully!");
    } catch {
      showMsg("error", "❌ Failed to change password");
    } finally {
      setSaving(false);
    }
  };

  const isOwner = user?.role === "owner";
  const tenant = user?.tenant;
  const planBadge =
    tenant?.subscription_plan === "pro"
      ? "bg-purple-100 text-purple-700"
      : "bg-blue-100 text-blue-700";

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h2 className="text-3xl font-bold">⚙️ Settings</h2>
        <p className="text-gray-500">Manage your account and gym settings</p>
      </div>

      {/* Message */}
      {message && (
        <div
          className={`p-4 rounded-xl mb-4 font-medium ${message.type === "success" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}
        >
          {message.text}
        </div>
      )}

      {/* Subscription Card */}
      <div className="bg-white rounded-xl border shadow-sm p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-lg">Subscription</h3>
            <div className="flex items-center gap-2 mt-1">
              <span
                className={`text-xs px-2 py-1 rounded-full font-medium capitalize ${planBadge}`}
              >
                {tenant?.subscription_plan} plan
              </span>
              <span
                className={`text-xs px-2 py-1 rounded-full ${tenant?.subscription_status === "trial" ? "bg-yellow-100 text-yellow-700" : "bg-green-100 text-green-700"}`}
              >
                {tenant?.subscription_status}
              </span>
            </div>
          </div>
          {tenant?.subscription_status === "trial" && (
            <div className="text-right">
              <p className="text-sm text-gray-500">Trial ends</p>
              <p className="font-bold text-orange-600">
                {tenant?.trial_ends_at
                  ? new Date(tenant.trial_ends_at).toLocaleDateString("id-ID")
                  : "-"}
              </p>
            </div>
          )}
        </div>
        <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t text-center text-sm">
          <div>
            <p className="text-gray-400">Max Members</p>
            <p className="font-bold text-lg">{tenant?.max_members}</p>
          </div>
          <div>
            <p className="text-gray-400">Max Trainers</p>
            <p className="font-bold text-lg">{tenant?.max_trainers}</p>
          </div>
          <div>
            <p className="text-gray-400">Max Classes</p>
            <p className="font-bold text-lg">{tenant?.max_classes}</p>
          </div>
        </div>
        {tenant?.subscription_plan !== "pro" && (
          <button className="mt-4 w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2.5 rounded-lg font-medium hover:opacity-90">
            🚀 Upgrade to Pro
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl border shadow-sm">
        <div className="flex border-b">
          {[
            { key: "profile", label: "👤 My Profile" },
            { key: "password", label: "🔐 Password" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex-1 py-3 text-sm font-medium transition-colors ${activeTab === tab.key ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-500 hover:text-gray-700"}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-6">
          {/* Profile Tab */}
          {activeTab === "profile" && (
            <form onSubmit={handleProfileSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Full Name
                </label>
                <input
                  className="w-full border rounded-lg px-3 py-2"
                  value={profileForm.name}
                  onChange={(e) =>
                    setProfileForm({ ...profileForm, name: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  className="w-full border rounded-lg px-3 py-2 bg-gray-50 text-gray-500"
                  value={user?.email}
                  disabled
                />
                <p className="text-xs text-gray-400 mt-1">
                  Email cannot be changed
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Phone</label>
                <input
                  className="w-full border rounded-lg px-3 py-2"
                  value={profileForm.phone}
                  onChange={(e) =>
                    setProfileForm({ ...profileForm, phone: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Role</label>
                <input
                  className="w-full border rounded-lg px-3 py-2 bg-gray-50 text-gray-500 capitalize"
                  value={user?.role}
                  disabled
                />
              </div>
              <button
                type="submit"
                disabled={saving}
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium"
              >
                {saving ? "Saving..." : "Save Profile"}
              </button>
            </form>
          )}

          {/* Password Tab */}
          {activeTab === "password" && (
            <form onSubmit={handlePasswordSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  className="w-full border rounded-lg px-3 py-2"
                  placeholder="Min. 8 characters"
                  value={passwordForm.password}
                  onChange={(e) =>
                    setPasswordForm({
                      ...passwordForm,
                      password: e.target.value,
                    })
                  }
                  required
                  minLength={8}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  className="w-full border rounded-lg px-3 py-2"
                  value={passwordForm.password_confirmation}
                  onChange={(e) =>
                    setPasswordForm({
                      ...passwordForm,
                      password_confirmation: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <button
                type="submit"
                disabled={saving}
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium"
              >
                {saving ? "Saving..." : "Change Password"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
