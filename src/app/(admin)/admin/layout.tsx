import { AuthProvider } from "@/components/providers/AuthProvider";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";

export const metadata = {
  title: "Admin Dashboard | ARKIVE",
  description: "ARKIVE Admin Dashboard - Manage products, orders, and settings",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <div className="flex min-h-screen bg-gray-50">
        <AdminSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <AdminHeader />
          <main className="flex-1 p-6">{children}</main>
        </div>
      </div>
    </AuthProvider>
  );
}
