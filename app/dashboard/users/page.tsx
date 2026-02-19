"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { useAuthStore } from "@/store/authStore";

const roleColors: Record<string, string> = {
  owner: "bg-purple-100 text-purple-700",
  staff: "bg-blue-100 text-blue-700",
  trainer: "bg-green-100 text-green-700",
};

export default function UsersPage() {
  const queryClient = useQueryClient();
  const { user: currentUser } = useAuthStore();
  const [showModal, setShowModal] = useState(false);
  const [roleFilter, setRoleFilter] = useState("");
  const [inviteForm, setInviteForm] = useState({
    name: "",
    email: "",
    phone: "",
    role: "staff",
  });
  const [tempPassword, setTempPassword] = useState("");

  const isOwner = currentUser?.role === "owner";

  const { data, isLoading } = useQuery({
    queryKey: ["users", roleFilter],
    queryFn: () =>
      api
        .get("/users", { params: { role: roleFilter || undefined } })
        .then((r) => r.data),
  });

  const inviteMutation = useMutation({
    mutationFn: (data: any) =>
      api.post("/users/invite", data).then((r) => r.data),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setTempPassword(res.temporary_password || "");
      setInviteForm({ name: "", email: "", phone: "", role: "staff" });
    },
  });

  const toggleActiveMutation = useMutation({
    mutationFn: ({ id, active }: { id: string; active: boolean }) =>
      api
        .post(`/users/${id}/${active ? "activate" : "deactivate"}`)
        .then((r) => r.data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["users"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/users/${id}`).then((r) => r.data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["users"] }),
  });

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    inviteMutation.mutate(inviteForm);
  };

  const users = data?.data || [];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold">👨‍💼 Staff & Trainers</h2>
          <p className="text-gray-500">Manage your team members</p>
        </div>
        {isOwner && (
          <button
            onClick={() => {
              setTempPassword("");
              setShowModal(true);
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700"
          >
            + Invite User
          </button>
        )}
      </div>

      {/* Filter */}
      <div className="bg-white rounded-xl p-4 shadow-sm border mb-6">
        <select
          className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
        >
          <option value="">All Roles</option>
          <option value="owner">Owner</option>
          <option value="staff">Staff</option>
          <option value="trainer">Trainer</option>
        </select>
      </div>

      {/* Users Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center h-48 text-gray-400">
          ⏳ Loading...
        </div>
      ) : users.length === 0 ? (
        <div className="bg-white rounded-xl border shadow-sm flex flex-col items-center justify-center h-48 text-gray-400">
          <span className="text-5xl mb-3">👥</span>
          <p>No users found</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {users.map((user: any) => (
            <div
              key={user.id}
              className={`bg-white rounded-xl border shadow-sm p-5 ${!user.is_active ? "opacity-60" : ""}`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                    {user.name?.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold">{user.name}</p>
                    <p className="text-xs text-gray-400">{user.email}</p>
                  </div>
                </div>
                <span
                  className={`text-xs px-2 py-1 rounded-full font-medium capitalize ${roleColors[user.role]}`}
                >
                  {user.role}
                </span>
              </div>

              {user.phone && (
                <p className="text-sm text-gray-500 mb-3">📞 {user.phone}</p>
              )}

              <div className="flex items-center justify-between">
                <span
                  className={`text-xs px-2 py-1 rounded-full ${user.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}
                >
                  {user.is_active ? "● Active" : "● Inactive"}
                </span>

                {isOwner && user.id !== currentUser?.id && (
                  <div className="flex gap-1">
                    <button
                      onClick={() =>
                        toggleActiveMutation.mutate({
                          id: user.id,
                          active: !user.is_active,
                        })
                      }
                      className={`text-xs px-2 py-1 rounded ${user.is_active ? "bg-orange-50 text-orange-600 hover:bg-orange-100" : "bg-green-50 text-green-600 hover:bg-green-100"}`}
                    >
                      {user.is_active ? "Deactivate" : "Activate"}
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Delete ${user.name}?`))
                          deleteMutation.mutate(user.id);
                      }}
                      className="text-xs bg-red-50 text-red-600 px-2 py-1 rounded hover:bg-red-100"
                    >
                      🗑️
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Invite Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-xl font-bold">Invite Team Member</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 text-xl"
              >
                ✕
              </button>
            </div>

            {tempPassword ? (
              <div className="text-center">
                <div className="text-5xl mb-3">🎉</div>
                <h4 className="text-lg font-bold mb-2">Invitation Sent!</h4>
                <p className="text-gray-500 text-sm mb-4">
                  Share this temporary password with the new user:
                </p>
                <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-4 mb-4">
                  <p className="font-mono text-xl font-bold text-blue-600 select-all">
                    {tempPassword}
                  </p>
                </div>
                <p className="text-xs text-orange-600 mb-4">
                  ⚠️ Save this password! It won't be shown again.
                </p>
                <button
                  onClick={() => setShowModal(false)}
                  className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleInvite} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Full Name *
                  </label>
                  <input
                    className="w-full border rounded-lg px-3 py-2"
                    placeholder="Jane Smith"
                    value={inviteForm.name}
                    onChange={(e) =>
                      setInviteForm({ ...inviteForm, name: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    className="w-full border rounded-lg px-3 py-2"
                    placeholder="jane@gym.com"
                    value={inviteForm.email}
                    onChange={(e) =>
                      setInviteForm({ ...inviteForm, email: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Phone
                  </label>
                  <input
                    className="w-full border rounded-lg px-3 py-2"
                    placeholder="+628123456789"
                    value={inviteForm.phone}
                    onChange={(e) =>
                      setInviteForm({ ...inviteForm, phone: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Role *
                  </label>
                  <select
                    className="w-full border rounded-lg px-3 py-2"
                    value={inviteForm.role}
                    onChange={(e) =>
                      setInviteForm({ ...inviteForm, role: e.target.value })
                    }
                  >
                    <option value="staff">Staff</option>
                    <option value="trainer">Trainer</option>
                  </select>
                </div>
                {inviteMutation.isError && (
                  <p className="text-red-500 text-sm">
                    {(inviteMutation.error as any)?.response?.data?.message ||
                      "Invitation failed"}
                  </p>
                )}
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 border border-gray-300 py-2 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={inviteMutation.isPending}
                    className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  >
                    {inviteMutation.isPending
                      ? "Sending..."
                      : "Send Invitation"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
