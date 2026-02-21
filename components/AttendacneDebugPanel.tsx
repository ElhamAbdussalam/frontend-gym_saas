"use client";

import { useState } from "react";
import api from "@/lib/api";

export function AttendanceDebugPanel() {
  const [logs, setLogs] = useState<string[]>([]);
  const [testing, setTesting] = useState(false);

  const addLog = (msg: string) => {
    console.log(msg);
    setLogs((prev) => [...prev, msg]);
  };

  const testAttendanceAPI = async () => {
    setLogs([]);
    setTesting(true);

    try {
      addLog("🔍 Starting Attendance API Debug...");
      addLog("");

      // Test 1: Check environment
      addLog("1️⃣ Environment Check:");
      addLog(`   API URL: ${process.env.NEXT_PUBLIC_API_URL}`);
      addLog(`   Token: ${localStorage.getItem("token")?.substring(0, 20)}...`);
      addLog("");

      // Test 2: Daily stats
      addLog("2️⃣ Testing daily-stats endpoint...");
      const today = new Date().toISOString().split("T")[0];
      addLog(`   Date: ${today}`);

      try {
        const statsResponse = await api.get("/attendance/daily-stats", {
          params: { date: today },
        });
        addLog(`   ✅ Success! Status: ${statsResponse.status}`);
        addLog(`   Data: ${JSON.stringify(statsResponse.data)}`);
      } catch (error: any) {
        addLog(`   ❌ Failed!`);
        addLog(`   Error: ${error.message}`);
        addLog(`   Status: ${error.response?.status}`);
        addLog(`   Response: ${JSON.stringify(error.response?.data)}`);
      }
      addLog("");

      // Test 3: Attendance list
      addLog("3️⃣ Testing attendance list endpoint...");
      try {
        const listResponse = await api.get("/attendance", {
          params: { date: today },
        });
        addLog(`   ✅ Success! Status: ${listResponse.status}`);
        addLog(`   Records: ${listResponse.data?.data?.length || 0}`);
      } catch (error: any) {
        addLog(`   ❌ Failed!`);
        addLog(`   Error: ${error.message}`);
        addLog(`   Status: ${error.response?.status}`);
      }
      addLog("");

      // Test 4: Network check
      addLog("4️⃣ Testing backend availability...");
      try {
        const response = await fetch("http://localhost:8000");
        addLog(`   ✅ Backend is reachable (Status: ${response.status})`);
      } catch (error) {
        addLog(`   ❌ Backend not reachable!`);
        addLog(`   → Make sure backend is running: php artisan serve`);
      }
      addLog("");

      addLog("✅ Debug complete!");
    } catch (error: any) {
      addLog(`❌ Debug failed: ${error.message}`);
    } finally {
      setTesting(false);
    }
  };

  if (process.env.NODE_ENV !== "development") return null;

  return (
    <div className="fixed bottom-20 right-4 bg-white border rounded-lg shadow-lg p-4 max-w-lg max-h-96 overflow-auto z-50">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-bold text-sm">🐛 Attendance API Debug</h3>
        <button
          onClick={testAttendanceAPI}
          disabled={testing}
          className="text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {testing ? "Testing..." : "Run Test"}
        </button>
      </div>

      {logs.length > 0 && (
        <div className="bg-gray-900 text-gray-100 p-3 rounded text-xs font-mono space-y-1 max-h-64 overflow-y-auto">
          {logs.map((log, i) => (
            <div key={i}>{log}</div>
          ))}
        </div>
      )}

      {logs.length === 0 && (
        <p className="text-xs text-gray-500">
          Click "Run Test" to debug attendance API
        </p>
      )}
    </div>
  );
}
