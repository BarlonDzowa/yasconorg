"use client";

import { useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { CmsUserRecord } from "@/lib/cms/constants";
import { Menu, X, BarChart3, Plus, FileText, Users, LogOut, Image, Users2, Image as ImageIcon, FileText as FileTextIcon } from "lucide-react";

interface SidebarProps {
  user: CmsUserRecord;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  onLogout?: () => void;
  canManageUsers: boolean;
}

export default function DashboardSidebar({ user, activeTab, onTabChange, onLogout, canManageUsers }: SidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const queryTab = searchParams?.get("tab");
  const inferredTab = queryTab || pathname?.split("/").filter(Boolean)[2] || "overview";
  const selectedTab = activeTab ?? inferredTab;

  const tabRoutes: Record<string, string> = {
    overview: "/dashboard/cms",
    content: "/dashboard/cms/content/manage",
    teams: "/dashboard/cms/teams/manage",
    media: "/dashboard/cms/media/manage",
    users: "/dashboard/cms?tab=users",
  };

  const handleTabChange = async (tab: string) => {
    if (onTabChange) {
      onTabChange(tab);
    } else {
      const href = tabRoutes[tab] ?? "/dashboard/cms";
      await router.push(href);
    }
    setMobileOpen(false);
  };

  const handleLogout = async () => {
    if (onLogout) {
      onLogout();
      return;
    }

    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/dashboard/login");
  };

  const menuItems = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    // { id: "create", label: "Create Content", icon: Plus },
{ id: "content", label: "Content", icon: FileText },
    // { id: "hero", label: "Hero Slides", icon: Image },
     { id: "teams", label: "Teams & Board", icon: Users2 },
    // { id: "news", label: "News", icon: FileTextIcon },
    // { id: "blogs", label: "Blogs", icon: FileTextIcon },
    // { id: "press_briefings", label: "Press Briefings", icon: FileTextIcon },
    { id: "media", label: "Gallery & Documents", icon: ImageIcon },
    ...(canManageUsers ? [{ id: "users", label: "Users", icon: Users }] : []),
  ];

  return (
    <section >
      <button onClick={() => setMobileOpen(!mobileOpen)}
        className="fixed top-4 left-4 z-40 md:hidden bg-slate-700 text-white p-2 rounded-lg">
        {mobileOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <aside className={`fixed left-0 top-0 h-screen w-64  bg-slate-900 text-white transform transition-transform md:translate-x-0 ${mobileOpen ? "translate-x-0" : "-translate-x-full"} z-30 overflow-y-auto`}>
        <div className="p-6 flex flex-col ">
          <div className="mb-2">
            <h2 className="text-xl font-bold text-slate-100">YASCON CMS</h2>
            <p className="text-xs text-slate-400 mt-1">Content Management</p>
          </div>
          <div className="mb-2 pb-6 border-b border-slate-700">
            <p className="text-xs text-slate-400 mb-1">Logged in as</p>
            <p className="font-semibold text-slate-100">{user.name}</p>
            <p className="text-xs text-slate-400 mt-1 capitalize">{user.role.replace("_", " ")} · {user.region}</p>
          </div>
          <nav className="space-y-1 flex-1">
            {menuItems.map(({ id, label, icon: Icon }) => (
              <button key={id} onClick={() => handleTabChange(id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left ${selectedTab === id ? "bg-blue-600 text-white" : "text-slate-300 hover:bg-slate-800"}`}>
                <Icon size={18} />
                <span className="text-sm font-medium">{label}</span>
              </button>
            ))}
          </nav>
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-200">
            <LogOut size={18} />
            <span className="text-sm font-medium">Sign out</span>
          </button>
        </div>
      </aside>

      {mobileOpen && <div className="fixed inset-0 bg-black/50 z-20 md:hidden" onClick={() => setMobileOpen(false)} />}
    </section>
  );
}
