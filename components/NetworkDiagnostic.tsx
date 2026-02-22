"use client";

import { useState } from "react";

export function NetworkDiagnostic() {
  const [logs, setLogs] = useState<string[]>([]);
  const [testing, setTesting] = useState(false);

  const addLog = (msg: string) => {
    console.log(msg);
    setLogs((prev) => [...prev, msg]);
  };

  const runDiagnostic = async () => {
    setLogs([]);
    setTesting(true);

    try {
      addLog("🔍 Starting Network Diagnostic...");
      addLog("");

      // 1. Check environment
      addLog("1️⃣ Environment Configuration:");
      addLog(`   API URL: ${process.env.NEXT_PUBLIC_API_URL || "NOT SET"}`);
      addLog(`   App URL: ${process.env.NEXT_PUBLIC_APP_URL || "NOT SET"}`);
      addLog(`   Token exists: ${!!localStorage.getItem("token")}`);
      addLog("");

      // 2. Test backend connectivity
      addLog("2️⃣ Testing Backend Connectivity...");
      try {
        const backendUrl = "http://localhost:8000";
        addLog(`   Trying: ${backendUrl}`);

        const response = await fetch(backendUrl, {
          method: "GET",
          mode: "cors",
        });

        addLog(`   ✅ Backend reachable (Status: ${response.status})`);
        addLog(`   Response type: ${response.type}`);
        addLog(
          `   Response headers: ${JSON.stringify([...response.headers.entries()])}`,
        );
      } catch (error: any) {
        addLog(`   ❌ Backend NOT reachable`);
        addLog(`   Error: ${error.message}`);
        addLog(`   → Start backend: php artisan serve`);
      }
      addLog("");

      // 3. Test API endpoint
      addLog("3️⃣ Testing API Endpoint...");
      const apiUrl = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"}`;
      addLog(`   API Base: ${apiUrl}`);

      try {
        const response = await fetch(apiUrl, {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        });
        addLog(`   ✅ API endpoint reachable (Status: ${response.status})`);
      } catch (error: any) {
        addLog(`   ❌ API endpoint failed`);
        addLog(`   Error: ${error.message}`);
        addLog(`   → Check .env.local file`);
      }
      addLog("");

      // 4. Test authenticated endpoint
      addLog("4️⃣ Testing Authenticated Endpoint...");
      const token = localStorage.getItem("token");
      if (!token) {
        addLog("   ⚠️ No token found - Login first");
      } else {
        addLog(`   Token: ${token.substring(0, 20)}...`);
        try {
          const response = await fetch(`${apiUrl}/members`, {
            method: "GET",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });
          addLog(`   Status: ${response.status}`);

          if (response.ok) {
            const data = await response.json();
            addLog(`   ✅ Authenticated request successful`);
            addLog(`   Members count: ${data?.data?.length || 0}`);
          } else {
            const errorData = await response.text();
            addLog(`   ❌ Request failed`);
            addLog(`   Response: ${errorData.substring(0, 200)}`);
          }
        } catch (error: any) {
          addLog(`   ❌ Request error: ${error.message}`);
        }
      }
      addLog("");

      // 5. Test member creation
      addLog("5️⃣ Testing Member Creation...");
      if (!token) {
        addLog("   ⚠️ Skipped - no token");
      } else {
        const testData = {
          first_name: "Test",
          last_name: "User",
          phone: `+628${Math.floor(Math.random() * 1000000000)}`,
          email: `test${Date.now()}@example.com`,
          gender: "male",
        };

        addLog(`   Test data: ${JSON.stringify(testData)}`);

        try {
          const response = await fetch(`${apiUrl}/members`, {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(testData),
          });

          addLog(`   Status: ${response.status}`);

          if (response.ok) {
            const data = await response.json();
            addLog(`   ✅ Member creation works!`);
            addLog(`   Created: ${data?.member?.full_name || "Unknown"}`);
            addLog(`   Member #: ${data?.member?.member_number || "Unknown"}`);
          } else {
            const errorData = await response.json();
            addLog(`   ❌ Creation failed`);
            addLog(`   Error: ${JSON.stringify(errorData, null, 2)}`);
          }
        } catch (error: any) {
          addLog(`   ❌ Request error: ${error.message}`);
        }
      }
      addLog("");

      addLog("✅ Diagnostic complete!");
    } catch (error: any) {
      addLog(`❌ Diagnostic failed: ${error.message}`);
    } finally {
      setTesting(false);
    }
  };

  if (process.env.NODE_ENV !== "development") return null;

  return (
    <div className="fixed top-4 right-4 bg-white border rounded-lg shadow-lg p-4 max-w-2xl max-h-[80vh] overflow-auto z-50">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-bold">🔬 Network Diagnostic</h3>
        <button
          onClick={runDiagnostic}
          disabled={testing}
          className="text-xs bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 disabled:opacity-50"
        >
          {testing ? "Testing..." : "Run Diagnostic"}
        </button>
      </div>

      {logs.length > 0 && (
        <div className="bg-gray-900 text-gray-100 p-3 rounded text-xs font-mono space-y-1 max-h-96 overflow-y-auto">
          {logs.map((log, i) => (
            <div key={i}>{log}</div>
          ))}
        </div>
      )}

      {logs.length === 0 && (
        <p className="text-xs text-gray-500">
          Click "Run Diagnostic" to test network & API
        </p>
      )}
    </div>
  );
}
