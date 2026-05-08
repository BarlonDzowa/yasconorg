import { redirect } from "next/navigation";
import DashboardSidebar from "@/components/cms/DashboardSidebar";
import { getCurrentDashboardUser } from "@/lib/cms/auth";
import type { CmsUserRecord } from "@/lib/cms/constants";

export default async function CmsLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentDashboardUser();

  if (!user) {
    redirect("/dashboard/login");
  }

  const activeTab = "overview";
  const canManageUsers = user.role === "super_admin";

  return (
    <div className="flex min-h-screen bg-slate-50">
      <DashboardSidebar
        user={user}
        activeTab={activeTab}
        canManageUsers={canManageUsers}
      />
      <main className="flex-1 md:ml-64 pt-16 p-6 md:p-8">
        {children}
      </main>
    </div>
  );
}


