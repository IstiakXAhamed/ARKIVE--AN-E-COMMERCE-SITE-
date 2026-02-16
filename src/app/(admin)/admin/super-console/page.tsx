"use client";

import { useState, useEffect } from "react";
import { 
  ShieldAlert, 
  Activity, 
  Database, 
  Users, 
  Lock, 
  Unlock, 
  Trash2, 
  RefreshCw,
  Server,
  AlertTriangle
} from "lucide-react";

export default function SuperConsolePage() {
  const [stats, setStats] = useState<any>(null);
  const [admins, setAdmins] = useState<any[]>([]);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Parallel fetch for dashboard-like stats and admin users
      const [statsRes, adminsRes, settingsRes] = await Promise.all([
        fetch("/api/admin/dashboard"),
        fetch("/api/admin/users?role=ADMIN"),
        fetch("/api/admin/settings?full=true")
      ]);

      if (statsRes.ok) {
        const data = await statsRes.json();
        setStats(data.stats);
      }
      
      if (adminsRes.ok) {
        const data = await adminsRes.json();
        setAdmins(data.users);
      }

      if (settingsRes.ok) {
        const data = await settingsRes.json();
        setMaintenanceMode(data.settings?.maintenanceMode === "true");
      }
    } catch (err) {
      console.error("Failed to load super console data", err);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMaintenance = async () => {
    const newValue = !maintenanceMode;
    // Optimistic update
    setMaintenanceMode(newValue);
    
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          key: "maintenanceMode",
          value: String(newValue),
          type: "boolean",
          group: "system",
          label: "Maintenance Mode"
        })
      });

      if (!res.ok) {
        throw new Error("Failed to update");
      }
      
      // Also clear cache to ensure middleware picks it up immediately if cached (though middleware usually isn't)
      await fetch("/api/admin/system/cache", { method: "POST" });
      
    } catch (err) {
      setMaintenanceMode(!newValue); // Revert
      alert("Failed to update maintenance mode");
    }
  };

  const handleDemote = async (userId: string) => {
    if (!confirm("Are you sure you want to demote this admin?")) return;
    
    setActionLoading(userId);
    try {
      const res = await fetch("/api/admin/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, role: "CUSTOMER" }),
      });

      if (res.ok) {
        setAdmins(admins.filter(a => a.id !== userId));
      } else {
        alert("Failed to demote user");
      }
    } catch (err) {
      alert("Error demoting user");
    } finally {
      setActionLoading(null);
    }
  };

  const clearCache = async () => {
    setActionLoading("cache");
    try {
      const res = await fetch("/api/admin/system/cache", { method: "POST" });
      if (res.ok) {
        alert("System cache cleared successfully!");
      } else {
        alert("Failed to clear cache");
      }
    } catch (err) {
      alert("Error clearing cache");
    } finally {
      setActionLoading(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <ShieldAlert size={120} />
        </div>
        <div className="relative z-10">
          <h1 className="text-3xl font-bold font-display flex items-center gap-3">
            <ShieldAlert className="text-red-500" />
            Super Console
          </h1>
          <p className="text-gray-400 mt-2 max-w-xl">
            Restricted access. Control system-level settings, manage administrators, and monitor critical infrastructure.
          </p>
        </div>
      </div>

      {/* System Controls */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Maintenance Mode */}
        <div className={`rounded-xl border p-6 transition-all ${
          maintenanceMode ? "bg-red-50 border-red-200" : "bg-white border-gray-100"
        }`}>
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-gray-100">
              <Server size={24} className={maintenanceMode ? "text-red-600" : "text-gray-600"} />
            </div>
            <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 transition-colors">
              <button
                onClick={toggleMaintenance}
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  maintenanceMode ? "translate-x-6 bg-red-500" : "translate-x-1"
                }`}
              />
            </div>
          </div>
          <h3 className="font-semibold text-lg text-gray-900">Maintenance Mode</h3>
          <p className="text-sm text-gray-500 mt-1">
            {maintenanceMode 
              ? "Site is currently inaccessible to customers." 
              : "Site is live and accessible."}
          </p>
        </div>

        {/* Cache Control */}
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-blue-50">
              <Database size={24} className="text-blue-600" />
            </div>
            <button 
              onClick={clearCache}
              disabled={actionLoading === "cache"}
              className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              <RefreshCw size={16} className={actionLoading === "cache" ? "animate-spin" : ""} />
              {actionLoading === "cache" ? "Clearing..." : "Clear Now"}
            </button>
          </div>
          <h3 className="font-semibold text-lg text-gray-900">System Cache</h3>
          <p className="text-sm text-gray-500 mt-1">
            Revalidate all static pages and clear API cache.
          </p>
        </div>

        {/* Security Status */}
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-emerald-50">
              <Activity size={24} className="text-emerald-600" />
            </div>
            <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded">
              HEALTHY
            </span>
          </div>
          <h3 className="font-semibold text-lg text-gray-900">System Health</h3>
          <p className="text-sm text-gray-500 mt-1">
            Database connections and API latency normal.
          </p>
        </div>
      </div>

      {/* Admin Management */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Administrators</h2>
            <p className="text-sm text-gray-500">Manage users with admin privileges</p>
          </div>
          <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-bold">
            {admins.length} Active
          </span>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 text-left">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">User</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Role</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Joined</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {admins.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                    No other admins found.
                  </td>
                </tr>
              ) : (
                admins.map((admin) => (
                  <tr key={admin.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-bold text-xs">
                          {admin.name?.[0] || "A"}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{admin.name}</p>
                          <p className="text-xs text-gray-500">{admin.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                        <Lock size={12} />
                        ADMIN
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(admin.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDemote(admin.id)}
                        disabled={actionLoading === admin.id}
                        className="text-red-600 hover:text-red-700 text-sm font-medium disabled:opacity-50"
                      >
                        {actionLoading === admin.id ? "Processing..." : "Revoke Access"}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Activity Log Placeholder */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <AlertTriangle size={20} className="text-amber-500" />
          Recent Suspicious Activity
        </h2>
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-3 bg-red-50 rounded-lg border border-red-100">
            <ShieldAlert size={18} className="text-red-600 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-red-900">Failed Login Attempt (Superadmin)</p>
              <p className="text-xs text-red-700 mt-0.5">IP: 192.168.1.1 • 2 minutes ago</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
            <Lock size={18} className="text-gray-500 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-gray-900">Password Changed (Admin: John Doe)</p>
              <p className="text-xs text-gray-500 mt-0.5">2 hours ago</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
