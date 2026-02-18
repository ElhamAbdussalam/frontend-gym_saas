"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { attendanceService, memberService } from "@/lib/services";
import type { AttendanceRecord, Member } from "@/types";

export default function AttendancePage() {
  const queryClient = useQueryClient();
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [memberSearch, setMemberSearch] = useState("");
  const [qrCode, setQrCode] = useState("");
  const [activeTab, setActiveTab] = useState<"list" | "checkin" | "qr">("list");
  const [selectedMemberId, setSelectedMemberId] = useState("");
  const [searchResults, setSearchResults] = useState<Member[]>([]);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const showMessage = (type: "success" | "error", text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  // Queries
  const { data: attendanceData, isLoading } = useQuery({
    queryKey: ["attendance", date],
    queryFn: () => attendanceService.getDailyStats(date),
  });

  const { data: listData, isLoading: listLoading } = useQuery({
    queryKey: ["attendance-list", date],
    queryFn: () =>
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/attendance?date=${date}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          Accept: "application/json",
        },
      }).then((r) => r.json()),
  });

  // Search members
  const handleSearchMembers = async () => {
    if (!memberSearch.trim()) return;
    const res = await memberService.getAll({
      search: memberSearch,
      status: "active",
    });
    setSearchResults(res.data || []);
  };

  // Mutations
  const checkInMutation = useMutation({
    mutationFn: (memberId: string) => attendanceService.checkIn(memberId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["attendance"] });
      queryClient.invalidateQueries({ queryKey: ["attendance-list"] });
      showMessage(
        "success",
        `✅ ${data.attendance?.member?.full_name || "Member"} checked in successfully!`,
      );
      setSelectedMemberId("");
      setSearchResults([]);
      setMemberSearch("");
    },
    onError: (err: any) => {
      showMessage("error", err.response?.data?.message || "Check-in failed");
    },
  });

  const checkInQrMutation = useMutation({
    mutationFn: (code: string) => attendanceService.checkInByQr(code),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["attendance"] });
      queryClient.invalidateQueries({ queryKey: ["attendance-list"] });
      showMessage(
        "success",
        `✅ ${data.attendance?.member?.full_name || "Member"} checked in via QR!`,
      );
      setQrCode("");
    },
    onError: (err: any) => {
      showMessage("error", err.response?.data?.message || "QR check-in failed");
    },
  });

  const checkOutMutation = useMutation({
    mutationFn: (memberId: string) => attendanceService.checkOut(memberId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attendance-list"] });
      showMessage("success", "✅ Check-out successful!");
    },
    onError: (err: any) => {
      showMessage("error", err.response?.data?.message || "Check-out failed");
    },
  });

  const records: AttendanceRecord[] = listData?.data || [];

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold">✅ Attendance</h2>
          <p className="text-gray-500">Track member check-ins and check-outs</p>
        </div>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Message */}
      {message && (
        <div
          className={`p-4 rounded-xl mb-4 font-medium ${
            message.type === "success"
              ? "bg-green-50 text-green-700 border border-green-200"
              : "bg-red-50 text-red-700 border border-red-200"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 shadow-sm border text-center">
          <p className="text-3xl font-bold text-blue-600">
            {attendanceData?.total_checkins ?? 0}
          </p>
          <p className="text-sm text-gray-500 mt-1">Total Check-ins</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border text-center">
          <p className="text-3xl font-bold text-green-600">
            {attendanceData?.still_inside ?? 0}
          </p>
          <p className="text-sm text-gray-500 mt-1">Currently Inside</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border text-center">
          <p className="text-3xl font-bold text-purple-600">
            {attendanceData?.checked_out ?? 0}
          </p>
          <p className="text-sm text-gray-500 mt-1">Checked Out</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border">
        <div className="flex border-b">
          {[
            { key: "list", label: "📋 Attendance List" },
            { key: "checkin", label: "🚪 Manual Check-in" },
            { key: "qr", label: "📱 QR Check-in" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex-1 py-3 text-sm font-medium transition-colors ${
                activeTab === tab.key
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-6">
          {/* Attendance List Tab */}
          {activeTab === "list" &&
            (listLoading ? (
              <div className="text-center py-8 text-gray-400">
                ⏳ Loading...
              </div>
            ) : records.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <div className="text-5xl mb-3">📭</div>
                <p>
                  No attendance records for{" "}
                  {new Date(date).toLocaleDateString("id-ID")}
                </p>
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="text-left text-xs font-medium text-gray-500 uppercase border-b">
                    <th className="pb-3">Member</th>
                    <th className="pb-3">Check-in</th>
                    <th className="pb-3">Check-out</th>
                    <th className="pb-3">Method</th>
                    <th className="pb-3">Duration</th>
                    <th className="pb-3">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {records.map((record) => {
                    const checkIn = new Date(record.check_in_time);
                    const checkOut = record.check_out_time
                      ? new Date(record.check_out_time)
                      : null;
                    const duration = checkOut
                      ? `${Math.round((checkOut.getTime() - checkIn.getTime()) / 60000)} min`
                      : "Still inside";
                    return (
                      <tr key={record.id} className="hover:bg-gray-50">
                        <td className="py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                              {record.member?.first_name?.charAt(0) || "?"}
                            </div>
                            <div>
                              <p className="font-medium text-sm">
                                {record.member?.full_name}
                              </p>
                              <p className="text-xs text-gray-400">
                                {record.member?.member_number}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 text-sm">
                          {checkIn.toLocaleTimeString("id-ID", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </td>
                        <td className="py-3 text-sm">
                          {checkOut ? (
                            checkOut.toLocaleTimeString("id-ID", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          ) : (
                            <span className="text-green-600 font-medium">
                              Active
                            </span>
                          )}
                        </td>
                        <td className="py-3">
                          <span className="text-xs bg-gray-100 px-2 py-1 rounded capitalize">
                            {record.check_in_method}
                          </span>
                        </td>
                        <td className="py-3 text-sm text-gray-500">
                          {duration}
                        </td>
                        <td className="py-3">
                          {!record.check_out_time && (
                            <button
                              onClick={() =>
                                checkOutMutation.mutate(record.member_id)
                              }
                              className="text-xs bg-orange-50 text-orange-700 px-2 py-1 rounded hover:bg-orange-100"
                            >
                              Check Out
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ))}

          {/* Manual Check-in Tab */}
          {activeTab === "checkin" && (
            <div className="max-w-md">
              <h3 className="font-semibold mb-4">Manual Check-in</h3>
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  placeholder="Search member by name or phone..."
                  className="flex-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={memberSearch}
                  onChange={(e) => setMemberSearch(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearchMembers()}
                />
                <button
                  onClick={handleSearchMembers}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Search
                </button>
              </div>

              {searchResults.length > 0 && (
                <div className="border rounded-lg divide-y mb-4">
                  {searchResults.map((member) => (
                    <div
                      key={member.id}
                      className={`flex items-center justify-between p-3 hover:bg-gray-50 cursor-pointer ${
                        selectedMemberId === member.id ? "bg-blue-50" : ""
                      }`}
                      onClick={() => setSelectedMemberId(member.id)}
                    >
                      <div>
                        <p className="font-medium text-sm">
                          {member.full_name}
                        </p>
                        <p className="text-xs text-gray-400">
                          {member.phone} • {member.status}
                        </p>
                      </div>
                      {selectedMemberId === member.id && (
                        <span className="text-blue-600">✓</span>
                      )}
                    </div>
                  ))}
                </div>
              )}

              <button
                onClick={() =>
                  selectedMemberId && checkInMutation.mutate(selectedMemberId)
                }
                disabled={!selectedMemberId || checkInMutation.isPending}
                className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {checkInMutation.isPending
                  ? "⏳ Processing..."
                  : "🚪 Check In Member"}
              </button>
            </div>
          )}

          {/* QR Check-in Tab */}
          {activeTab === "qr" && (
            <div className="max-w-md">
              <h3 className="font-semibold mb-4">QR Code Check-in</h3>
              <p className="text-gray-500 text-sm mb-4">
                Scan or enter the member's QR code to check them in.
              </p>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Scan or enter QR code..."
                  className="flex-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={qrCode}
                  onChange={(e) => setQrCode(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === "Enter" &&
                    qrCode &&
                    checkInQrMutation.mutate(qrCode)
                  }
                  autoFocus
                />
                <button
                  onClick={() => qrCode && checkInQrMutation.mutate(qrCode)}
                  disabled={!qrCode || checkInQrMutation.isPending}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
                >
                  {checkInQrMutation.isPending ? "⏳" : "✅ Check In"}
                </button>
              </div>
              <p className="text-xs text-gray-400 mt-2">
                💡 Tip: Press Enter after scanning to auto-submit
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
