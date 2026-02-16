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
  AlertTriangle,
  FileText,
  Cpu,
  Globe,
  HardDrive,
  Zap
} from "lucide-react";

// ... existing imports ...

// Mock Logs
const systemLogs = [
  { id: 1, type: "info", message: "System cache revalidated via Admin Console", time: "Just now", user: "Superadmin" },
  { id: 2, type: "warning", message: "High latency detected on Product API", time: "5 mins ago", user: "System" },
  { id: 3, type: "success", message: "Daily backup completed successfully", time: "1 hour ago", user: "System" },
  { id: 4, type: "error", message: "Failed login attempt from IP 192.168.1.105", time: "2 hours ago", user: "Unknown" },
  { id: 5, type: "info", message: "New deployment detected (v1.2.0)", time: "4 hours ago", user: "System" },
];

// ... inside component ...

        {/* Advanced System Metrics (New) */}
        <div className="grid md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-xl border border-gray-100 flex items-center gap-3">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Cpu size={20} /></div>
            <div>
              <p className="text-xs text-gray-500">CPU Usage</p>
              <p className="font-bold text-gray-900">12%</p>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-100 flex items-center gap-3">
            <div className="p-2 bg-purple-50 text-purple-600 rounded-lg"><HardDrive size={20} /></div>
            <div>
              <p className="text-xs text-gray-500">Memory</p>
              <p className="font-bold text-gray-900">450MB</p>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-100 flex items-center gap-3">
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg"><Globe size={20} /></div>
            <div>
              <p className="text-xs text-gray-500">Active Sessions</p>
              <p className="font-bold text-gray-900">24</p>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-100 flex items-center gap-3">
            <div className="p-2 bg-amber-50 text-amber-600 rounded-lg"><Zap size={20} /></div>
            <div>
              <p className="text-xs text-gray-500">API Latency</p>
              <p className="font-bold text-gray-900">45ms</p>
            </div>
          </div>
        </div>

        {/* System Logs (New) */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <FileText size={20} className="text-gray-500" />
              System Logs
            </h2>
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">View All Logs</button>
          </div>
          <div className="space-y-4">
            {systemLogs.map((log) => (
              <div key={log.id} className="flex items-start gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors border border-transparent hover:border-gray-100">
                <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${
                  log.type === 'error' ? 'bg-red-500' : 
                  log.type === 'warning' ? 'bg-amber-500' : 
                  log.type === 'success' ? 'bg-emerald-500' : 'bg-blue-500'
                }`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{log.message}</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {log.time} • User: <span className="font-medium text-gray-700">{log.user}</span>
                  </p>
                </div>
                <span className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded border ${
                  log.type === 'error' ? 'bg-red-50 text-red-600 border-red-100' : 
                  log.type === 'warning' ? 'bg-amber-50 text-amber-600 border-amber-100' : 
                  log.type === 'success' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-blue-50 text-blue-600 border-blue-100'
                }`}>
                  {log.type}
                </span>
              </div>
            ))}
          </div>
        </div>

      {/* Admin Management (Existing) */}

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
