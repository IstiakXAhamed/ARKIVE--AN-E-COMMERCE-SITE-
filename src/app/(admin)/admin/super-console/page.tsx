"use client";

import { useState, useEffect } from "react";
import { 
  ShieldAlert, 
  Activity, 
  Database, 
  Users, 
  Lock, 
  Trash2, 
  RefreshCw,
  Server,
  AlertTriangle,
  FileText,
  Cpu,
  Globe,
  HardDrive,
  Zap,
  Clock,
  Search,
  Package,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  Settings
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function SuperConsolePage() {
  const router = useRouter();
  const [stats, setStats] = useState<any>(null);
  const [admins, setAdmins] = useState<any[]>([]);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [userSearch, setUserSearch] = useState("");
  const [logs, setLogs] = useState<any[]>([]);
  const [health, setHealth] = useState<any>(null);
  const [settings, setSettings] = useState<any>({});
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, adminsRes, usersRes, ordersRes, productsRes, settingsRes, logsRes, healthRes] = await Promise.all([
        fetch("/api/admin/dashboard"),
        fetch("/api/admin/users?role=ADMIN"),
        fetch("/api/admin/users"),
        fetch("/api/admin/orders?limit=20"),
        fetch("/api/admin/products?limit=50"),
        fetch("/api/admin/settings?full=true"),
        fetch("/api/admin/system/logs?limit=10"),
        fetch("/api/health")
      ]);

      if (statsRes.ok) {
        const data = await statsRes.json();
        setStats(data.stats);
      }
      
      if (adminsRes.ok) {
        const data = await adminsRes.json();
        setAdmins(data.users);
      }

      if (usersRes.ok) {
        const data = await usersRes.json();
        setAllUsers(data.users);
      }

      if (ordersRes.ok) {
        const data = await ordersRes.json();
        setOrders(data.orders);
      }

      if (productsRes.ok) {
        const data = await productsRes.json();
        setProducts(data.products);
      }

      if (settingsRes.ok) {
        const data = await settingsRes.json();
        setSettings(data.settings || {});
      }

      if (logsRes.ok) {
        const data = await logsRes.json();
        setLogs(data.logs || []);
      }

      if (healthRes.ok) {
        setHealth(await healthRes.json());
      }

    } catch (err) {
      console.error("Failed to load super console data", err);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSetting = async (key: string, label: string) => {
    const currentValue = settings[key] === "true";
    const newValue = !currentValue;
    
    setSettings({ ...settings, [key]: String(newValue) });
    
    try {
      await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          key,
          value: String(newValue),
          type: "boolean",
          group: "system",
          label
        })
      });
    } catch (err) {
      setSettings({ ...settings, [key]: String(currentValue) });
      alert(`Failed to update ${label}`);
    }
  };

  const handleAction = async (action: string, endpoint: string, method = "POST") => {
    if (!confirm(`Are you sure you want to ${action}?`)) return;
    
    setActionLoading(action);
    try {
      const res = await fetch(endpoint, { method });
      const data = await res.json();
      
      if (res.ok) {
        alert(`${action} successful!`);
        fetchData();
      } else {
        alert(`Failed to ${action}: ${data.error || "Unknown error"}`);
      }
    } catch (err) {
      alert(`Error performing ${action}`);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDemote = async (userId: string) => {
    if (!confirm("Are you sure you want to demote this admin?")) return;
    
    setActionLoading(`demote-${userId}`);
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

  const handleRoleUpdate = async (userId: string, newRole: string) => {
    if (!confirm(`Are you sure you want to change this user's role to ${newRole}?`)) return;
    
    setActionLoading(`role-${userId}`);
    try {
      const res = await fetch("/api/admin/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, role: newRole }),
      });

      if (res.ok) {
        setAllUsers(allUsers.map(u => u.id === userId ? { ...u, role: newRole } : u));
        // Refresh admins list if needed
        if (newRole === "ADMIN" || newRole === "SUPERADMIN") {
           // We might need to refetch to get full data or just optimistically update
           const user = allUsers.find(u => u.id === userId);
           if (user && !admins.find(a => a.id === userId)) {
             setAdmins([...admins, { ...user, role: newRole }]);
           }
        } else {
           setAdmins(admins.filter(a => a.id !== userId));
        }
      } else {
        const data = await res.json();
        alert(data.error || "Failed to update role");
      }
    } catch (err) {
      alert("Error updating role");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user? This action cannot be undone.")) return;
    
    setActionLoading(`delete-${userId}`);
    try {
      const res = await fetch(`/api/admin/users?id=${userId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setAllUsers(allUsers.filter(u => u.id !== userId));
        setAdmins(admins.filter(a => a.id !== userId));
      } else {
        const data = await res.json();
        alert(data.error || "Failed to delete user");
      }
    } catch (err) {
      alert("Error deleting user");
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
    <div className="space-y-8 max-w-7xl mx-auto">
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
          
          <div className="mt-6 flex flex-wrap gap-3">
            <div className="bg-gray-800/50 backdrop-blur px-3 py-1.5 rounded-lg border border-gray-700 flex items-center gap-2 text-xs">
              <span className={`w-2 h-2 rounded-full ${health?.database === 'connected' ? 'bg-emerald-500' : 'bg-red-500'}`} />
              Database: {health?.database === 'connected' ? 'Connected' : 'Disconnected'}
            </div>
            <div className="bg-gray-800/50 backdrop-blur px-3 py-1.5 rounded-lg border border-gray-700 flex items-center gap-2 text-xs">
              <Clock size={12} className="text-blue-400" />
              Uptime: {Math.floor(health?.uptime || 0)}s
            </div>
            <div className="bg-gray-800/50 backdrop-blur px-3 py-1.5 rounded-lg border border-gray-700 flex items-center gap-2 text-xs">
              <Server size={12} className="text-purple-400" />
              Env: {health?.environment || 'unknown'}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex overflow-x-auto gap-2 pb-2 border-b border-gray-100 no-scrollbar">
        {[
          { id: "overview", label: "Overview", icon: Activity },
          { id: "users", label: "User Management", icon: Users },
          { id: "orders", label: "Order Intelligence", icon: ShoppingCart },
          { id: "inventory", label: "Inventory Health", icon: Package },
          { id: "system", label: "System Internals", icon: Server },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              activeTab === tab.id 
                ? "bg-gray-900 text-white shadow-md" 
                : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
            }`}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "overview" && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Feature Flags */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { key: 'maintenanceMode', label: 'Maintenance Mode', icon: AlertTriangle, color: 'text-red-600' },
              { key: 'aiChatEnabled', label: 'AI Chatbot', icon: Zap, color: 'text-blue-600' },
              { key: 'couponsEnabled', label: 'Coupon System', icon: FileText, color: 'text-emerald-600' },
              { key: 'reviewsEnabled', label: 'Product Reviews', icon: Activity, color: 'text-amber-600' },
              { key: 'pwaEnabled', label: 'PWA Install', icon: Globe, color: 'text-purple-600' },
              { key: 'wishlistEnabled', label: 'Wishlist', icon: Users, color: 'text-pink-600' },
              { key: 'announcementEnabled', label: 'Announcement Bar', icon: RefreshCw, color: 'text-orange-600' },
              { key: 'mobileBannerEnabled', label: 'Mobile App Banner', icon: HardDrive, color: 'text-indigo-600' },
            ].map((feature) => (
              <div key={feature.key} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg bg-gray-50 ${feature.color}`}>
                    <feature.icon size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{feature.label}</p>
                    <p className="text-xs text-gray-500">{settings[feature.key] === "true" ? "Enabled" : "Disabled"}</p>
                  </div>
                </div>
                <button
                  onClick={() => toggleSetting(feature.key, feature.label)}
                  className={`w-11 h-6 rounded-full transition-colors relative ${
                    settings[feature.key] === "true" ? "bg-emerald-500" : "bg-gray-300"
                  }`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full shadow-sm absolute top-0.5 transition-transform ${
                    settings[feature.key] === "true" ? "translate-x-5.5" : "translate-x-0.5"
                  }`} />
                </button>
              </div>
            ))}
          </div>

          {/* System Configuration */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Zap size={20} className="text-gray-500" />
              System Configuration
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mobile App Banner Delay (ms)
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={settings.mobileBannerDelay || "3000"}
                    onChange={(e) => setSettings({ ...settings, mobileBannerDelay: e.target.value })}
                    className="flex-1 rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                    placeholder="3000"
                  />
                  <button
                    onClick={() => {
                      fetch("/api/admin/settings", {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          key: "mobileBannerDelay",
                          value: settings.mobileBannerDelay || "3000",
                          type: "number",
                          group: "system",
                          label: "Mobile Banner Delay"
                        })
                      }).then(() => alert("Delay updated!"));
                    }}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
                  >
                    Save
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">Time in milliseconds before the app banner appears (default: 3000ms)</p>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column: Logs & Metrics */}
            <div className="lg:col-span-2 space-y-8">
              {/* System Logs */}
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                  <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <FileText size={20} className="text-gray-500" />
                    Live System Logs
                  </h2>
                  <button 
                    onClick={fetchData}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500"
                    title="Refresh Logs"
                  >
                    <RefreshCw size={16} />
                  </button>
                </div>
                <div className="divide-y divide-gray-50 max-h-[400px] overflow-y-auto">
                  {logs.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">No logs found.</div>
                  ) : (
                    logs.map((log) => (
                      <div key={log.id} className="p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex items-start gap-3">
                          <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${
                            log.level === 'ERROR' || log.level === 'CRITICAL' ? 'bg-red-500' : 
                            log.level === 'WARN' ? 'bg-amber-500' : 
                            'bg-blue-500'
                          }`} />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                [{log.action}] {log.message}
                              </p>
                              <span className="text-xs text-gray-400 whitespace-nowrap">
                                {new Date(log.createdAt).toLocaleTimeString()}
                              </span>
                            </div>
                            <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                              {log.user && (
                                <span className="flex items-center gap-1">
                                  <Users size={10} />
                                  {log.user.name || log.user.email}
                                </span>
                              )}
                              {log.ipAddress && <span>IP: {log.ipAddress}</span>}
                              <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                                log.level === 'ERROR' ? 'bg-red-50 text-red-600' : 
                                log.level === 'WARN' ? 'bg-amber-50 text-amber-600' : 
                                'bg-blue-50 text-blue-600'
                              }`}>
                                {log.level}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Admin Management */}
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">Administrators</h2>
                    <p className="text-sm text-gray-500">Manage admin privileges</p>
                  </div>
                  <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-bold">
                    {admins.length} Active
                  </span>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 text-left">
                      <tr>
                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">User</th>
                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Role</th>
                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {admins.length === 0 ? (
                        <tr>
                          <td colSpan={3} className="px-6 py-8 text-center text-gray-500">
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
                            <td className="px-6 py-4 text-right">
                              <button
                                onClick={() => handleDemote(admin.id)}
                                disabled={actionLoading === `demote-${admin.id}`}
                                className="text-red-600 hover:text-red-700 text-sm font-medium disabled:opacity-50"
                              >
                                {actionLoading === `demote-${admin.id}` ? "..." : "Revoke Access"}
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Right Column: Quick Actions */}
            <div className="space-y-6">
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <button
                    onClick={() => handleAction("clear system cache", "/api/admin/system/cache")}
                    disabled={actionLoading !== null}
                    className="w-full flex items-center justify-between p-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <RefreshCw size={18} />
                      Clear System Cache
                    </span>
                    {actionLoading === "clear system cache" && <span className="text-xs">Running...</span>}
                  </button>

                  <button
                    onClick={() => handleAction("seed database", "/api/seed", "GET")}
                    disabled={actionLoading !== null}
                    className="w-full flex items-center justify-between p-3 bg-amber-50 text-amber-700 rounded-lg hover:bg-amber-100 transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <Database size={18} />
                      Seed Database
                    </span>
                    {actionLoading === "seed database" && <span className="text-xs">Running...</span>}
                  </button>

                  <button
                    onClick={() => toggleSetting('maintenanceMode', 'Maintenance Mode')}
                    disabled={actionLoading !== null}
                    className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${
                      settings.maintenanceMode === "true" 
                        ? "bg-red-100 text-red-700 hover:bg-red-200" 
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <AlertTriangle size={18} />
                      {settings.maintenanceMode === "true" ? "Disable Maintenance" : "Enable Maintenance"}
                    </span>
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">System Metrics</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-500">API Latency</span>
                      <span className="font-medium text-gray-900">45ms</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 w-[15%]" />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-500">DB Connection Pool</span>
                      <span className="font-medium text-gray-900">3/10</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 w-[30%]" />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-500">Error Rate (24h)</span>
                      <span className="font-medium text-gray-900">0.05%</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 w-[1%]" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "users" && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-gray-900">User Management</h2>
              <p className="text-sm text-gray-500">Manage all registered users</p>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text"
                placeholder="Search users..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full md:w-64"
              />
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 text-left">
                <tr>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">User</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Role</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Orders</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Joined</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {allUsers
                  .filter(u => u.name?.toLowerCase().includes(userSearch.toLowerCase()) || u.email?.toLowerCase().includes(userSearch.toLowerCase()))
                  .map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {user.image ? (
                          <img src={user.image} alt={user.name} className="w-8 h-8 rounded-full object-cover" />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-bold text-xs">
                            {user.name?.[0] || "U"}
                          </div>
                        )}
                        <div>
                          <p className="text-sm font-medium text-gray-900">{user.name}</p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.role === 'SUPERADMIN' ? 'bg-purple-100 text-purple-700' :
                        user.role === 'ADMIN' ? 'bg-blue-100 text-blue-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {user.role === 'SUPERADMIN' ? <ShieldAlert size={12} /> : user.role === 'ADMIN' ? <Lock size={12} /> : <Users size={12} />}
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {user._count?.orders || 0}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right flex items-center justify-end gap-2">
                      {user.role !== 'SUPERADMIN' && (
                        <>
                          <select
                            value={user.role}
                            onChange={(e) => handleRoleUpdate(user.id, e.target.value)}
                            disabled={actionLoading === `role-${user.id}`}
                            className="text-xs border-gray-200 rounded-md py-1 pl-2 pr-6 focus:ring-indigo-500 bg-white"
                          >
                            <option value="CUSTOMER">Customer</option>
                            <option value="ADMIN">Admin</option>
                          </select>
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            disabled={actionLoading === `delete-${user.id}`}
                            className="p-1.5 text-red-500 hover:bg-red-50 rounded-md transition-colors"
                            title="Delete User"
                          >
                            <Trash2 size={16} />
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
                {allUsers.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "orders" && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-emerald-100 text-emerald-600 rounded-lg">
                  <DollarSign size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Revenue</p>
                  <h3 className="text-2xl font-bold text-gray-900">
                    ৳{stats?.totalRevenue?.toLocaleString() || "0"}
                  </h3>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
                  <ShoppingCart size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Orders</p>
                  <h3 className="text-2xl font-bold text-gray-900">{stats?.totalOrders || 0}</h3>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-amber-100 text-amber-600 rounded-lg">
                  <TrendingUp size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Avg. Order Value</p>
                  <h3 className="text-2xl font-bold text-gray-900">
                    ৳{stats?.totalOrders ? Math.round(stats.totalRevenue / stats.totalOrders).toLocaleString() : "0"}
                  </h3>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">Recent Transactions</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 text-left">
                  <tr>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Order ID</th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Customer</th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Amount</th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {order.orderNumber}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {order.customer}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        ৳{order.total?.toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                          order.status === 'DELIVERED' ? 'bg-emerald-100 text-emerald-700' :
                          order.status === 'CANCELLED' ? 'bg-red-100 text-red-700' :
                          'bg-blue-100 text-blue-700'
                        }`}>
                          {order.status.toLowerCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {order.date}
                      </td>
                    </tr>
                  ))}
                  {orders.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                        No orders found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === "inventory" && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm border-l-4 border-l-red-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Low Stock Items</p>
                  <h3 className="text-2xl font-bold text-gray-900">
                    {products.filter(p => p.status === "Low Stock" || p.status === "Out of Stock").length}
                  </h3>
                </div>
                <div className="p-3 bg-red-50 text-red-600 rounded-lg">
                  <AlertTriangle size={24} />
                </div>
              </div>
              <p className="text-xs text-gray-400 mt-2">Requires immediate attention</p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm border-l-4 border-l-emerald-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Products</p>
                  <h3 className="text-2xl font-bold text-gray-900">{products.length}</h3>
                </div>
                <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg">
                  <Package size={24} />
                </div>
              </div>
              <p className="text-xs text-gray-400 mt-2">Active catalog size</p>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">Inventory Status</h2>
              <span className="text-xs font-medium text-red-600 bg-red-50 px-2 py-1 rounded-full">
                Showing top 50 items
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 text-left">
                  <tr>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Product</th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">SKU/Slug</th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Price</th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Stock</th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {products
                    .sort((a, b) => a.stock - b.stock) // Sort by lowest stock first
                    .map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden shrink-0">
                            {product.image && <img src={product.image} alt={product.name} className="w-full h-full object-cover" />}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900 truncate max-w-[200px]">{product.name}</p>
                            <p className="text-xs text-gray-500">{product.category}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-xs text-gray-500 font-mono">
                        {product.slug}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        ৳{product.price?.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-gray-900">
                        {product.stock}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          product.stock === 0 ? 'bg-red-100 text-red-700' :
                          product.stock < 5 ? 'bg-amber-100 text-amber-700' :
                          'bg-emerald-100 text-emerald-700'
                        }`}>
                          {product.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === "system" && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Server size={20} className="text-gray-500" />
            System Internals
          </h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Environment</h4>
                <div className="space-y-2 text-xs font-mono">
                  <div className="flex justify-between">
                    <span className="text-gray-500">NODE_ENV</span>
                    <span className="text-gray-900">{process.env.NODE_ENV}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">NEXT_PUBLIC_APP_URL</span>
                    <span className="text-gray-900">{process.env.NEXT_PUBLIC_APP_URL || 'Not Set'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">DATABASE_URL</span>
                    <span className="text-gray-900">Configured (Hidden)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
