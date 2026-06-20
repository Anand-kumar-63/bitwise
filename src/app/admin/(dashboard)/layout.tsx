import type { Metadata } from "next";
import { redirect } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { isAdminAuthenticated } from "@/lib/admin-auth";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const authed = await isAdminAuthenticated();
  if (!authed) redirect("/admin/login");

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#0a0806]">
      <AdminSidebar />
      <div className="flex-1 min-w-0">
        <div className="p-6 lg:p-10">{children}</div>
      </div>
    </div>
  );
}
