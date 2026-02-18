"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { classService } from "@/lib/services";
import api from "@/lib/api";

const statusColors: Record<string, string> = {
  scheduled: "bg-blue-100 text-blue-700",
  ongoing: "bg-green-100 text-green-700",
  completed: "bg-gray-100 text-gray-700",
  canceled: "bg-red-100 text-red-700",
};

export default function ClassesPage() {
  const queryClient = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const [editingClass, setEditingClass] = useState<any>(null);
  const [filter, setFilter] = useState({ status: "", from_date: "" });
  const [form, setForm] = useState({
    name: "",
    description: "",
    type: "yoga",
    trainer_id: "",
    max_capacity: "20",
    duration_minutes: "60",
    date: "",
    start_time: "",
    end_time: "",
    notes: "",
  });

  const { data: classesData, isLoading } = useQuery({
    queryKey: ["classes", filter],
    queryFn: () =>
      classService.getAll({
        status: filter.status || undefined,
        from_date: filter.from_date || undefined,
      }),
  });

  const { data: trainersData } = useQuery({
    queryKey: ["trainers"],
    queryFn: () => api.get("/users?role=trainer").then((r) => r.data),
  });

  const saveMutation = useMutation({
    mutationFn: (data: any) =>
      editingClass
        ? classService.update(editingClass.id, data)
        : classService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["classes"] });
      setShowModal(false);
      resetForm();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: classService.delete,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["classes"] }),
  });

  const resetForm = () => {
    setEditingClass(null);
    setForm({
      name: "",
      description: "",
      type: "yoga",
      trainer_id: "",
      max_capacity: "20",
      duration_minutes: "60",
      date: "",
      start_time: "",
      end_time: "",
      notes: "",
    });
  };

  const openEdit = (cls: any) => {
    setEditingClass(cls);
    setForm({
      name: cls.name,
      description: cls.description || "",
      type: cls.type,
      trainer_id: cls.trainer_id,
      max_capacity: String(cls.max_capacity),
      duration_minutes: String(cls.duration_minutes),
      date: cls.date,
      start_time: cls.start_time,
      end_time: cls.end_time,
      notes: cls.notes || "",
    });
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveMutation.mutate({
      ...form,
      max_capacity: parseInt(form.max_capacity),
      duration_minutes: parseInt(form.duration_minutes),
    });
  };

  const classes = classesData?.data || [];
  const trainers = trainersData?.data || [];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold">🏋️ Classes</h2>
          <p className="text-gray-500">Schedule and manage gym classes</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700"
        >
          + Schedule Class
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 shadow-sm border mb-6 flex gap-4">
        <select
          className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={filter.status}
          onChange={(e) => setFilter({ ...filter, status: e.target.value })}
        >
          <option value="">All Status</option>
          <option value="scheduled">Scheduled</option>
          <option value="ongoing">Ongoing</option>
          <option value="completed">Completed</option>
          <option value="canceled">Canceled</option>
        </select>
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-500">From:</label>
          <input
            type="date"
            className="border border-gray-300 rounded-lg px-3 py-2"
            value={filter.from_date}
            onChange={(e) =>
              setFilter({ ...filter, from_date: e.target.value })
            }
          />
        </div>
      </div>

      {/* Classes List */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center h-48 text-gray-400">
            ⏳ Loading classes...
          </div>
        ) : classes.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-gray-400">
            <span className="text-5xl mb-3">📅</span>
            <p>No classes found</p>
            <button
              onClick={() => setShowModal(true)}
              className="mt-2 text-blue-600 hover:underline text-sm"
            >
              Schedule your first class
            </button>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">
                  Class
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">
                  Date & Time
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">
                  Trainer
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">
                  Capacity
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
              {classes.map((cls: any) => (
                <tr key={cls.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <p className="font-medium">{cls.name}</p>
                    <p className="text-xs text-gray-400 capitalize">
                      {cls.type} • {cls.duration_minutes} min
                    </p>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <p>
                      {new Date(cls.date).toLocaleDateString("id-ID", {
                        weekday: "short",
                        day: "numeric",
                        month: "short",
                      })}
                    </p>
                    <p className="text-gray-400">
                      {cls.start_time?.slice(0, 5)} -{" "}
                      {cls.end_time?.slice(0, 5)}
                    </p>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {cls.trainer?.name || "-"}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-gray-200 rounded-full h-1.5">
                        <div
                          className="bg-blue-600 h-1.5 rounded-full"
                          style={{
                            width: `${Math.min(100, ((cls.bookings_count || 0) / cls.max_capacity) * 100)}%`,
                          }}
                        />
                      </div>
                      <span className="text-xs text-gray-500">
                        {cls.bookings_count || 0}/{cls.max_capacity}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium capitalize ${statusColors[cls.status]}`}
                    >
                      {cls.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => openEdit(cls)}
                        className="text-xs bg-gray-50 text-gray-700 px-2 py-1 rounded hover:bg-gray-100"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Delete "${cls.name}"?`))
                            deleteMutation.mutate(cls.id);
                        }}
                        className="text-xs bg-red-50 text-red-600 px-2 py-1 rounded hover:bg-red-100"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-xl font-bold">
                {editingClass ? "Edit Class" : "Schedule New Class"}
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
                  Class Name *
                </label>
                <input
                  className="w-full border rounded-lg px-3 py-2"
                  placeholder="e.g. Morning Yoga"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Type *
                  </label>
                  <select
                    className="w-full border rounded-lg px-3 py-2"
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                  >
                    {[
                      "yoga",
                      "pilates",
                      "zumba",
                      "spinning",
                      "hiit",
                      "boxing",
                      "crossfit",
                      "aerobics",
                      "other",
                    ].map((t) => (
                      <option key={t} value={t} className="capitalize">
                        {t.charAt(0).toUpperCase() + t.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Trainer
                  </label>
                  <select
                    className="w-full border rounded-lg px-3 py-2"
                    value={form.trainer_id}
                    onChange={(e) =>
                      setForm({ ...form, trainer_id: e.target.value })
                    }
                  >
                    <option value="">Select Trainer</option>
                    {trainers.map((t: any) => (
                      <option key={t.id} value={t.id}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Max Capacity *
                  </label>
                  <input
                    type="number"
                    className="w-full border rounded-lg px-3 py-2"
                    min="1"
                    value={form.max_capacity}
                    onChange={(e) =>
                      setForm({ ...form, max_capacity: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Duration (min) *
                  </label>
                  <input
                    type="number"
                    className="w-full border rounded-lg px-3 py-2"
                    min="1"
                    value={form.duration_minutes}
                    onChange={(e) =>
                      setForm({ ...form, duration_minutes: e.target.value })
                    }
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Date *</label>
                <input
                  type="date"
                  className="w-full border rounded-lg px-3 py-2"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Start Time *
                  </label>
                  <input
                    type="time"
                    className="w-full border rounded-lg px-3 py-2"
                    value={form.start_time}
                    onChange={(e) =>
                      setForm({ ...form, start_time: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    End Time *
                  </label>
                  <input
                    type="time"
                    className="w-full border rounded-lg px-3 py-2"
                    value={form.end_time}
                    onChange={(e) =>
                      setForm({ ...form, end_time: e.target.value })
                    }
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Notes</label>
                <textarea
                  className="w-full border rounded-lg px-3 py-2"
                  rows={2}
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
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
                  disabled={saveMutation.isPending}
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {saveMutation.isPending
                    ? "Saving..."
                    : editingClass
                      ? "Update Class"
                      : "Schedule Class"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
