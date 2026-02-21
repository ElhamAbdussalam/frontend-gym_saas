"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { memberService, membershipPlanService } from "@/lib/services";
import type { Member, MembershipPlan } from "@/types";

const statusColors: Record<string, string> = {
  active: "bg-green-100 text-green-700",
  expired: "bg-red-100 text-red-700",
  frozen: "bg-blue-100 text-blue-700",
  suspended: "bg-gray-100 text-gray-700",
};

export default function MembersPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    date_of_birth: "",
    gender: "male",
    address: "",
    emergency_contact: "",
    medical_notes: "",
  });
  const [purchaseForm, setPurchaseForm] = useState({
    membership_plan_id: "",
    payment_method: "cash",
    notes: "",
  });

  // Queries
  const { data: membersData, isLoading } = useQuery({
    queryKey: ["members", search, statusFilter],
    queryFn: () =>
      memberService.getAll({ search, status: statusFilter || undefined }),
  });

  const { data: plansData } = useQuery({
    queryKey: ["membership-plans"],
    queryFn: () => membershipPlanService.getAll(true),
  });

  // Mutations
  const createMutation = useMutation({
    mutationFn: memberService.create,
    onSuccess: () => {
      console.log("✅ Member created, invalidating queries");
      queryClient.invalidateQueries({ queryKey: ["members"] });
      setShowModal(false);
      resetForm();
    },
    onError: (error: any) => {
      console.error("❌ Create member mutation error:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });

      // Show error to user
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.errors ||
        "Failed to create member. Please try again.";

      alert(`Error: ${JSON.stringify(errorMessage)}`);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: memberService.delete,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["members"] }),
  });

  const purchaseMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      memberService.getAll({ id }).then(() =>
        fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/members/${id}/purchase-membership`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify(data),
          },
        ).then((r) => r.json()),
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["members"] });
      setShowPurchaseModal(false);
    },
  });

  const resetForm = () => {
    setForm({
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      date_of_birth: "",
      gender: "male",
      address: "",
      emergency_contact: "",
      medical_notes: "",
    });
  };

  const members: Member[] = membersData?.data || [];
  const plans: MembershipPlan[] = plansData?.data || [];

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold">👥 Members</h2>
          <p className="text-gray-500">Manage all gym members</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          + Add Member
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 shadow-sm border mb-6 flex gap-4">
        <input
          type="text"
          placeholder="🔍 Search by name, email, phone..."
          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="expired">Expired</option>
          <option value="frozen">Frozen</option>
          <option value="suspended">Suspended</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center h-48 text-gray-500">
            ⏳ Loading members...
          </div>
        ) : members.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-gray-400">
            <span className="text-5xl mb-3">👥</span>
            <p>No members found</p>
            <button
              onClick={() => setShowModal(true)}
              className="mt-2 text-blue-600 hover:underline text-sm"
            >
              Add your first member
            </button>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">
                  Member
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">
                  Contact
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">
                  Membership
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {members.map((member) => (
                <tr key={member.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {member.first_name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {member.full_name}
                        </p>
                        <p className="text-xs text-gray-400">
                          {member.member_number}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-900">{member.phone}</p>
                    <p className="text-xs text-gray-400">
                      {member.email || "-"}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm">
                      {member.membership_plan?.name || "No Plan"}
                    </p>
                    {member.membership_end_date && (
                      <p className="text-xs text-gray-400">
                        Expires:{" "}
                        {new Date(
                          member.membership_end_date,
                        ).toLocaleDateString("id-ID")}
                      </p>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium capitalize ${statusColors[member.status]}`}
                    >
                      {member.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setSelectedMember(member);
                          setShowPurchaseModal(true);
                        }}
                        className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded hover:bg-green-100"
                      >
                        💳 Purchase
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Delete ${member.full_name}?`)) {
                            deleteMutation.mutate(member.id);
                          }
                        }}
                        className="text-xs bg-red-50 text-red-600 px-2 py-1 rounded hover:bg-red-100"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Add Member Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Add New Member</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 text-xl"
              >
                ✕
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                console.log("📝 Submitting member form with data:", form);
                console.log("🔍 Form validation check:", {
                  hasFirstName: !!form.first_name,
                  hasLastName: !!form.last_name,
                  hasPhone: !!form.phone,
                });
                createMutation.mutate(form);
              }}
              className="space-y-3"
            >
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    First Name *
                  </label>
                  <input
                    className="w-full border rounded-lg px-3 py-2"
                    value={form.first_name}
                    onChange={(e) =>
                      setForm({ ...form, first_name: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Last Name *
                  </label>
                  <input
                    className="w-full border rounded-lg px-3 py-2"
                    value={form.last_name}
                    onChange={(e) =>
                      setForm({ ...form, last_name: e.target.value })
                    }
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Phone *
                </label>
                <input
                  className="w-full border rounded-lg px-3 py-2"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  className="w-full border rounded-lg px-3 py-2"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    className="w-full border rounded-lg px-3 py-2"
                    value={form.date_of_birth}
                    onChange={(e) =>
                      setForm({ ...form, date_of_birth: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Gender
                  </label>
                  <select
                    className="w-full border rounded-lg px-3 py-2"
                    value={form.gender}
                    onChange={(e) =>
                      setForm({ ...form, gender: e.target.value })
                    }
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Address
                </label>
                <input
                  className="w-full border rounded-lg px-3 py-2"
                  value={form.address}
                  onChange={(e) =>
                    setForm({ ...form, address: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Emergency Contact
                </label>
                <input
                  className="w-full border rounded-lg px-3 py-2"
                  value={form.emergency_contact}
                  onChange={(e) =>
                    setForm({ ...form, emergency_contact: e.target.value })
                  }
                />
              </div>
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
                  disabled={createMutation.isPending}
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {createMutation.isPending ? "Saving..." : "Add Member"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Purchase Membership Modal */}
      {showPurchaseModal && selectedMember && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Purchase Membership</h3>
              <button
                onClick={() => setShowPurchaseModal(false)}
                className="text-gray-400 hover:text-gray-600 text-xl"
              >
                ✕
              </button>
            </div>
            <p className="text-gray-500 text-sm mb-4">
              Member: <strong>{selectedMember.full_name}</strong>
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                purchaseMutation.mutate({
                  id: selectedMember.id,
                  data: purchaseForm,
                });
              }}
              className="space-y-3"
            >
              <div>
                <label className="block text-sm font-medium mb-1">
                  Membership Plan *
                </label>
                <select
                  className="w-full border rounded-lg px-3 py-2"
                  value={purchaseForm.membership_plan_id}
                  onChange={(e) =>
                    setPurchaseForm({
                      ...purchaseForm,
                      membership_plan_id: e.target.value,
                    })
                  }
                  required
                >
                  <option value="">Select Plan</option>
                  {plans.map((plan) => (
                    <option key={plan.id} value={plan.id}>
                      {plan.name} - Rp{" "}
                      {Number(plan.price).toLocaleString("id-ID")} /{" "}
                      {plan.billing_period}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Payment Method *
                </label>
                <select
                  className="w-full border rounded-lg px-3 py-2"
                  value={purchaseForm.payment_method}
                  onChange={(e) =>
                    setPurchaseForm({
                      ...purchaseForm,
                      payment_method: e.target.value,
                    })
                  }
                >
                  <option value="cash">Cash</option>
                  <option value="card">Card</option>
                  <option value="transfer">Bank Transfer</option>
                  <option value="online">Online Payment</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Notes</label>
                <input
                  className="w-full border rounded-lg px-3 py-2"
                  value={purchaseForm.notes}
                  onChange={(e) =>
                    setPurchaseForm({ ...purchaseForm, notes: e.target.value })
                  }
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPurchaseModal(false)}
                  className="flex-1 border border-gray-300 py-2 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={purchaseMutation.isPending}
                  className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
                >
                  {purchaseMutation.isPending
                    ? "Processing..."
                    : "Confirm Purchase"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
