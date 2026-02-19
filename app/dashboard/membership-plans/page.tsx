"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { membershipPlanService } from "@/lib/services";
import type { MembershipPlan } from "@/types";

const billingLabels: Record<string, string> = {
  monthly: "Monthly",
  quarterly: "3 Months",
  yearly: "Yearly",
};

export default function MembershipPlansPage() {
  const queryClient = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState<MembershipPlan | null>(null);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    billing_period: "monthly",
    duration_days: "30",
    includes_classes: true,
    class_credits: "",
    includes_personal_training: false,
    is_active: true,
  });

  const { data, isLoading } = useQuery({
    queryKey: ["membership-plans-all"],
    queryFn: () => membershipPlanService.getAll(),
  });

  const saveMutation = useMutation({
    mutationFn: (data: any) =>
      editingPlan
        ? membershipPlanService.update(editingPlan.id, data)
        : membershipPlanService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["membership-plans-all"] });
      queryClient.invalidateQueries({ queryKey: ["membership-plans"] });
      setShowModal(false);
      resetForm();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: membershipPlanService.delete,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["membership-plans-all"] }),
  });

  const resetForm = () => {
    setEditingPlan(null);
    setForm({
      name: "",
      description: "",
      price: "",
      billing_period: "monthly",
      duration_days: "30",
      includes_classes: true,
      class_credits: "",
      includes_personal_training: false,
      is_active: true,
    });
  };

  const openEdit = (plan: MembershipPlan) => {
    setEditingPlan(plan);
    setForm({
      name: plan.name,
      description: plan.description || "",
      price: String(plan.price),
      billing_period: plan.billing_period,
      duration_days: String(plan.duration_days),
      includes_classes: plan.includes_classes,
      class_credits: plan.class_credits ? String(plan.class_credits) : "",
      includes_personal_training: plan.includes_personal_training,
      is_active: plan.is_active,
    });
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveMutation.mutate({
      ...form,
      price: parseFloat(form.price),
      duration_days: parseInt(form.duration_days),
      class_credits: form.class_credits ? parseInt(form.class_credits) : null,
    });
  };

  const plans: MembershipPlan[] = data?.data || [];

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(price);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold">💳 Membership Plans</h2>
          <p className="text-gray-500">Create and manage membership packages</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700"
        >
          + Add Plan
        </button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-48 text-gray-400">
          ⏳ Loading...
        </div>
      ) : plans.length === 0 ? (
        <div className="bg-white rounded-xl border shadow-sm flex flex-col items-center justify-center h-48 text-gray-400">
          <span className="text-5xl mb-3">💳</span>
          <p>No membership plans yet</p>
          <button
            onClick={() => setShowModal(true)}
            className="mt-2 text-blue-600 hover:underline text-sm"
          >
            Create your first plan
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`bg-white rounded-xl border shadow-sm p-6 relative ${!plan.is_active ? "opacity-60" : ""}`}
            >
              {!plan.is_active && (
                <span className="absolute top-3 right-3 text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded">
                  Inactive
                </span>
              )}
              <h3 className="text-xl font-bold mb-1">{plan.name}</h3>
              {plan.description && (
                <p className="text-gray-500 text-sm mb-3">{plan.description}</p>
              )}
              <div className="mb-4">
                <span className="text-3xl font-bold text-blue-600">
                  {formatPrice(plan.price)}
                </span>
                <span className="text-gray-400 text-sm ml-1">
                  / {billingLabels[plan.billing_period]}
                </span>
              </div>
              <div className="space-y-2 text-sm text-gray-600 mb-5">
                <div className="flex items-center gap-2">
                  <span>📅</span>{" "}
                  <span>{plan.duration_days} days duration</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>{plan.includes_classes ? "✅" : "❌"}</span>
                  <span>
                    Class access{" "}
                    {plan.class_credits
                      ? `(${plan.class_credits} credits)`
                      : "(unlimited)"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span>{plan.includes_personal_training ? "✅" : "❌"}</span>
                  <span>Personal training</span>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => openEdit(plan)}
                  className="flex-1 border border-gray-300 py-2 rounded-lg text-sm hover:bg-gray-50"
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={() => {
                    if (confirm(`Delete "${plan.name}"?`))
                      deleteMutation.mutate(plan.id);
                  }}
                  className="flex-1 border border-red-200 text-red-600 py-2 rounded-lg text-sm hover:bg-red-50"
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-xl font-bold">
                {editingPlan ? "Edit Plan" : "New Membership Plan"}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 text-xl"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Plan Name *
                </label>
                <input
                  className="w-full border rounded-lg px-3 py-2"
                  placeholder="e.g. Monthly Premium"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Description
                </label>
                <textarea
                  className="w-full border rounded-lg px-3 py-2"
                  rows={2}
                  placeholder="Brief description..."
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Price (IDR) *
                  </label>
                  <input
                    type="number"
                    className="w-full border rounded-lg px-3 py-2"
                    placeholder="500000"
                    value={form.price}
                    onChange={(e) =>
                      setForm({ ...form, price: e.target.value })
                    }
                    required
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Billing Period *
                  </label>
                  <select
                    className="w-full border rounded-lg px-3 py-2"
                    value={form.billing_period}
                    onChange={(e) =>
                      setForm({ ...form, billing_period: e.target.value })
                    }
                  >
                    <option value="monthly">Monthly</option>
                    <option value="quarterly">Quarterly (3 mo)</option>
                    <option value="yearly">Yearly</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Duration (days) *
                </label>
                <input
                  type="number"
                  className="w-full border rounded-lg px-3 py-2"
                  value={form.duration_days}
                  onChange={(e) =>
                    setForm({ ...form, duration_days: e.target.value })
                  }
                  required
                  min="1"
                />
              </div>
              <div className="space-y-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4"
                    checked={form.includes_classes}
                    onChange={(e) =>
                      setForm({ ...form, includes_classes: e.target.checked })
                    }
                  />
                  <span className="text-sm font-medium">
                    Includes Class Access
                  </span>
                </label>
                {form.includes_classes && (
                  <div className="ml-6">
                    <label className="block text-sm font-medium mb-1">
                      Class Credits (blank = unlimited)
                    </label>
                    <input
                      type="number"
                      className="w-full border rounded-lg px-3 py-2"
                      placeholder="Leave blank for unlimited"
                      value={form.class_credits}
                      onChange={(e) =>
                        setForm({ ...form, class_credits: e.target.value })
                      }
                      min="0"
                    />
                  </div>
                )}
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4"
                    checked={form.includes_personal_training}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        includes_personal_training: e.target.checked,
                      })
                    }
                  />
                  <span className="text-sm font-medium">
                    Includes Personal Training
                  </span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4"
                    checked={form.is_active}
                    onChange={(e) =>
                      setForm({ ...form, is_active: e.target.checked })
                    }
                  />
                  <span className="text-sm font-medium">
                    Active (visible to staff)
                  </span>
                </label>
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
                  disabled={saveMutation.isPending}
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {saveMutation.isPending
                    ? "Saving..."
                    : editingPlan
                      ? "Update Plan"
                      : "Create Plan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
