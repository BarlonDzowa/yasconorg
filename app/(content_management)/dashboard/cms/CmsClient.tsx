"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import DashboardSidebar from "@/components/cms/DashboardSidebar";
import UnifiedContentForm, { type ContentFormData } from "@/components/cms/UnifiedContentForm";
import { type CmsUserRecord } from "@/lib/cms/constants";
import Image from "next/image";

import {
  FileText, CheckCircle, Trash2, Edit, Eye, EyeOff, Plus, ArrowUp,
  ArrowDown, Save, X, Users2, Image as ImageIcon, Loader2,
  ExternalLink, AlertCircle, FileText as DocIcon,
} from "lucide-react";

// ── Types ─────────────────────────────────────────────────────────────────────
interface ContentItem {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  richContent: string;
  contentType: string;
  region: string;
  status: string;
  updatedAt: string;
  publishedAt: string | null;
  coverImage: string | null;
  videoUrl?: string | null;
  createdBy: { name: string };
}

interface HeroSlide {
  id: string; label: string; heading: string; sub: string; bg: string;
  cta1Label: string; cta1Href: string; cta2Label: string; cta2Href: string;
  order: number; active: boolean;
}

interface TeamMember {
  id: number; name: string; role: string; joined?: string | null;
  avatar?: string | null; focus: string; teamType: string;
  region: string; status: string; updatedAt: string;
  createdBy: { name: string };
}

interface MediaItem {
  id: number; title: string; slug: string; description?: string | null;
  mediaType: string; fileUrl: string; coverImage?: string | null;
  region: string; status: string; updatedAt: string;
  createdBy: { name: string };
}

// ── Constants ─────────────────────────────────────────────────────────────────
const REGIONS = ["national", "central", "northern", "southern", "eastern"];

const TYPE_LABEL: Record<string, string> = {
  news: "News",
  announcement: "Announcement",
  press_briefing: "Press Briefing",
  blog: "Blog",
  video: "Video",
};

const STATUS_STYLE: Record<string, string> = {
  published: "bg-emerald-100 text-emerald-700",
  draft: "bg-amber-100 text-amber-700",
  archived: "bg-slate-100 text-slate-700",
};

// ── Alert component ────────────────────────────────────────────────────────────
function Alert({ msg, type, onDismiss }: { msg: string; type: "success" | "error"; onDismiss: () => void }) {
  return (
    <div className={`mb-6 p-4 rounded-lg border flex items-start justify-between gap-4 ${type === "success" ? "bg-emerald-50 border-emerald-200 text-emerald-800" : "bg-red-50 border-red-200 text-red-800"}`}>
      <div className="flex items-center gap-2">
        {type === "success" ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
        <span className="text-sm font-medium">{msg}</span>
      </div>
      <button onClick={onDismiss} className="flex-shrink-0 text-slate-500 hover:text-slate-700"><X size={16} /></button>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────
interface ContentItem {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  richContent: string;
  contentType: string;
  region: string;
  status: string;
  updatedAt: string;
  publishedAt: string | null;
  coverImage: string | null;
  videoUrl?: string | null;
  createdBy: { name: string };
}

interface HeroSlide {
  id: string; label: string; heading: string; sub: string; bg: string;
  cta1Label: string; cta1Href: string; cta2Label: string; cta2Href: string;
  order: number; active: boolean;
}

interface TeamMember {
  id: number; name: string; role: string; joined?: string | null;
  avatar?: string | null; focus: string; teamType: string;
  region: string; status: string; updatedAt: string;
  createdBy: { name: string };
}

interface MediaItem {
  id: number; title: string; slug: string; description?: string | null;
  mediaType: string; fileUrl: string; coverImage?: string | null;
  region: string; status: string; updatedAt: string;
  createdBy: { name: string };
}

export default function CmsClient({ initialUser }: { initialUser: CmsUserRecord | null }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [user, setUser] = useState(initialUser);
  const [activeTab, setActiveTab] = useState(() => searchParams?.get("tab") || "overview");
  const [allContent, setAllContent] = useState<ContentItem[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [users, setUsers] = useState<CmsUserRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [teamsLoading, setTeamsLoading] = useState(false);
  const [mediaLoading, setMediaLoading] = useState(false);
  const [msg, setMsg] = useState<{ text: string; type: "success" | "error" } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [typeFilter, setTypeFilter] = useState("all");
  const [teamTypeFilter, setTeamTypeFilter] = useState<"all" | "management" | "board">("all");
  const [mediaTypeFilter, setMediaTypeFilter] = useState<"all" | "gallery" | "document">("all");
  const [editItem, setEditItem] = useState<ContentItem | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<{ id: number; type: string; title: string } | null>(null);

  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>([]);
  const [heroSaving, setHeroSaving] = useState(false);

  useEffect(() => {
    const tab = searchParams?.get("tab");
    if (tab && tab !== activeTab) {
      setActiveTab(tab);
    } else if (!tab && activeTab !== "overview") {
      setActiveTab("overview");
    }
  }, [searchParams, activeTab]);

  const [userForm, setUserForm] = useState({ name: "", email: "", password: "", role: "regional_admin" as const, region: "national" });
  const [editingUser, setEditingUser] = useState<CmsUserRecord | null>(null);

  const canManageUsers = useMemo(() => user?.role === "super_admin", [user]);
  const showMsg = (text: string, type: "success" | "error" = "success") => setMsg({ text, type });

  // Fetch current user on mount/refresh
  const refreshUser = useCallback(async () => {
    try {
      const res = await fetch('/api/cms/session');
      if (!res.ok) {
        setUser(null);
        return;
      }
      const { user: currentUser } = await res.json();
      setUser(currentUser);
    } catch {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  // ── Data fetching ──────────────────────────────────────────────────────────

  // Single request to unified endpoint — no more 5-way fan-out
  const refreshContent = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/cms/content?status=all&limit=200");
      if (!res.ok) throw new Error("Failed to load");
      const items: ContentItem[] = await res.json();
      items.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
      setAllContent(items);
    } catch {
      showMsg("Failed to load content", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshTeams = useCallback(async () => {
    setTeamsLoading(true);
    try {
      const res = await fetch("/api/cms/teams?status=all&limit=100");
      if (res.ok) setTeamMembers(await res.json());
    } catch {
      showMsg("Failed to load team members", "error");
    } finally {
      setTeamsLoading(false);
    }
  }, []);

  const refreshMedia = useCallback(async () => {
    setMediaLoading(true);
    try {
      const res = await fetch("/api/cms/media?status=all&limit=100");
      if (res.ok) setMediaItems(await res.json());
    } catch {
      showMsg("Failed to load media items", "error");
    } finally {
      setMediaLoading(false);
    }
  }, []);

  const refreshUsers = useCallback(async () => {
    const res = await fetch("/api/cms/users");
    const data = await res.json();
    if (res.ok) setUsers(data.items || []);
  }, []);

  const refreshHeroSlides = useCallback(async () => {
    try {
      const res = await fetch("/api/cms/hero-slides");
      if (res.ok) setHeroSlides(await res.json());
    } catch { /* hero slides optional */ }
  }, []);

  useEffect(() => {
    void refreshContent();
    void refreshTeams();
    void refreshMedia();
    if (canManageUsers) void refreshUsers();
    void refreshHeroSlides();
  }, [refreshContent, refreshTeams, refreshMedia, refreshUsers, refreshHeroSlides, canManageUsers]);

  // ── Content CRUD ───────────────────────────────────────────────────────────

  async function handleContentSubmit(data: ContentFormData) {
    setIsSubmitting(true);
    try {
      // All content types go to the same unified endpoint
      const url = editItem ? `/api/cms/content/${editItem.id}` : "/api/cms/content";
      const method = editItem ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          coverImage: data.coverImage || null,
          videoUrl: data.videoUrl || null,
        }),
      });

      const result = await res.json();
      if (!res.ok) { showMsg(result.error || "Save failed", "error"); return; }

      showMsg(editItem ? "Content updated!" : "Content created!");
      setEditItem(null);
      setActiveTab("manage");
      await refreshContent();
    } catch {
      showMsg("An error occurred", "error");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDeleteContent(id: number) {
    try {
      const res = await fetch(`/api/cms/content/${id}`, { method: "DELETE" });
      if (res.ok) {
        showMsg("Deleted.");
        setConfirmDelete(null);
        await refreshContent();
      } else {
        showMsg("Delete failed", "error");
      }
    } catch {
      showMsg("Delete failed", "error");
    }
  }

  async function toggleContentStatus(item: ContentItem) {
    const newStatus = item.status === "published" ? "draft" : "published";
    const res = await fetch(`/api/cms/content/${item.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    if (res.ok) {
      showMsg(`Set to ${newStatus}.`);
      await refreshContent();
    } else {
      showMsg("Failed to update status", "error");
    }
  }

  // ── Team CRUD ──────────────────────────────────────────────────────────────

  async function handleDeleteTeam(id: number, name: string) {
    try {
      const res = await fetch(`/api/cms/teams/${id}`, { method: "DELETE" });
      if (res.ok) {
        showMsg(`"${name}" deleted.`);
        setConfirmDelete(null);
        await refreshTeams();
      } else {
        showMsg("Delete failed", "error");
      }
    } catch {
      showMsg("Delete failed", "error");
    }
  }

  async function toggleTeamStatus(m: TeamMember) {
    const newStatus = m.status === "published" ? "draft" : "published";
    const res = await fetch(`/api/cms/teams/${m.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    if (res.ok) {
      showMsg(`"${m.name}" ${newStatus}.`);
      await refreshTeams();
    } else {
      showMsg("Failed", "error");
    }
  }

  // ── Media CRUD ─────────────────────────────────────────────────────────────

  async function handleDeleteMedia(id: number, title: string) {
    try {
      const res = await fetch(`/api/cms/media/${id}`, { method: "DELETE" });
      if (res.ok) {
        showMsg(`"${title}" deleted.`);
        setConfirmDelete(null);
        await refreshMedia();
      } else {
        showMsg("Delete failed", "error");
      }
    } catch {
      showMsg("Delete failed", "error");
    }
  }

  async function toggleMediaStatus(item: MediaItem) {
    const newStatus = item.status === "published" ? "draft" : "published";
    const res = await fetch(`/api/cms/media/${item.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    if (res.ok) {
      showMsg(`"${item.title}" ${newStatus}.`);
      await refreshMedia();
    } else {
      showMsg("Failed", "error");
    }
  }

  // ── Hero Slides ────────────────────────────────────────────────────────────

  function addSlide() {
    const s: HeroSlide = {
      id: `slide-${Date.now()}`, label: "New Slide", heading: "Heading here",
      sub: "Subtitle here.", bg: "/hero/hero4.webp",
      cta1Label: "Learn More", cta1Href: "/about",
      cta2Label: "Get Involved", cta2Href: "/get-involved",
      order: heroSlides.length, active: true,
    };
    setHeroSlides((p) => [...p, s]);
  }

  function updateSlide(id: string, field: keyof HeroSlide, value: string | boolean | number) {
    setHeroSlides((p) => p.map((s) => s.id === id ? { ...s, [field]: value } : s));
  }

  function moveSlide(id: string, dir: "up" | "down") {
    setHeroSlides((p) => {
      const idx = p.findIndex((s) => s.id === id);
      if (idx < 0) return p;
      const next = [...p];
      const swap = dir === "up" ? idx - 1 : idx + 1;
      if (swap < 0 || swap >= next.length) return p;
      [next[idx], next[swap]] = [next[swap], next[idx]];
      return next.map((s, i) => ({ ...s, order: i }));
    });
  }

  async function saveHeroSlides() {
    setHeroSaving(true);
    try {
      const res = await fetch("/api/cms/hero-slides", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(heroSlides),
      });
      if (res.ok) showMsg("Hero slides saved!");
      else showMsg("Failed to save hero slides", "error");
    } finally {
      setHeroSaving(false);
    }
  }

  // ── Users CRUD ─────────────────────────────────────────────────────────────

  async function handleUserSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingUser) {
        const res = await fetch(`/api/cms/users/${editingUser.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: userForm.name, role: userForm.role, region: userForm.region,
            ...(userForm.password ? { password: userForm.password } : {}),
          }),
        });
        const data = await res.json();
        if (!res.ok) { showMsg(data.error || "Update failed", "error"); return; }
        showMsg("User updated!");
        setEditingUser(null);
      } else {
        const res = await fetch("/api/cms/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(userForm),
        });
        const data = await res.json();
        if (!res.ok) { showMsg(data.error || "Create failed", "error"); return; }
        showMsg("User created!");
      }
      setUserForm({ name: "", email: "", password: "", role: "regional_admin", region: "national" });
      await refreshUsers();
    } finally {
      setIsSubmitting(false);
    }
  }

  async function deleteUser(id: number) {
    if (!confirm("Delete this user?")) return;
    const res = await fetch(`/api/cms/users/${id}`, { method: "DELETE" });
    if (res.ok) { showMsg("User deleted."); await refreshUsers(); }
    else showMsg("Delete failed", "error");
  }

  // ── Helpers ────────────────────────────────────────────────────────────────

  const filteredContent = typeFilter === "all" ? allContent : allContent.filter((i) => i.contentType === typeFilter);
  const filteredTeams = teamTypeFilter === "all" ? teamMembers : teamMembers.filter((m) => m.teamType === teamTypeFilter);
  const filteredMedia = mediaTypeFilter === "all" ? mediaItems : mediaItems.filter((i) => i.mediaType === mediaTypeFilter);

  const totalAll = allContent.length + teamMembers.length + mediaItems.length;
  const stats = {
    total: totalAll,
    published: [...allContent, ...teamMembers, ...mediaItems].filter((i) => i.status === "published").length,
    draft: [...allContent, ...teamMembers, ...mediaItems].filter((i) => i.status === "draft").length,
  };

  // Tab navigation — "content" tab is handled inline in this component
  const changeTab = (tab: string) => {
    setActiveTab(tab);
    setEditItem(null);
  };

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="flex min-h-screen bg-slate-50">
    <main className="w-full pt-16 p-6 md:p-8">
      {msg && <Alert msg={msg.text} type={msg.type} onDismiss={() => setMsg(null)} />}

        {/* ── Overview ── */}
        {activeTab === "overview" && (
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Dashboard</h1>
            <p className="text-slate-600 mb-8">Welcome back, {user?.name}.</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[
                { label: "Total Items", value: stats.total, color: "bg-blue-50 border-blue-200" },
                { label: "Published", value: stats.published, color: "bg-emerald-50 border-emerald-200" },
                { label: "Drafts", value: stats.draft, color: "bg-amber-50 border-amber-200" },
                { label: "Region", value: user?.region.charAt(0).toUpperCase() + user.region.slice(1), color: "bg-purple-50 border-purple-200" },
              ].map((s) => (
                <div key={s.label} className={`border rounded-xl p-5 ${s.color}`}>
                  <p className="text-xs text-slate-500 mb-1">{s.label}</p>
                  <p className="text-2xl font-bold text-slate-900">{s.value}</p>
                </div>
              ))}
            </div>

            <h2 className="text-lg font-bold text-slate-800 mb-3">Quick Actions</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
              {[
                { label: "Add Team Member", icon: Users2, tab: "teams", color: "bg-blue-600" },
                { label: "Upload Media", icon: ImageIcon, tab: "media", color: "bg-purple-600" },
                { label: "Write News", icon: FileText, tab: "create", color: "bg-green-600" },
                { label: "Hero Slides", icon: Save, tab: "hero", color: "bg-orange-600" },
              ].map(({ label, icon: Icon, tab, color }) => (
                <button key={tab} onClick={() => changeTab(tab)}
                  className={`${color} text-white rounded-xl p-4 text-left hover:opacity-90 transition`}>
                  <Icon size={20} className="mb-2" />
                  <p className="text-sm font-semibold">{label}</p>
                </button>
              ))}
            </div>

            <h2 className="text-lg font-bold text-slate-800 mb-3">Recent Content</h2>
            <div className="space-y-3">
              {allContent.slice(0, 5).map((item) => (
                <div key={`${item.contentType}-${item.id}`} className="bg-white border border-slate-200 rounded-lg p-4 flex items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs font-semibold">{TYPE_LABEL[item.contentType] || item.contentType}</span>
                      <span className={`px-2 py-0.5 rounded text-xs font-semibold ${STATUS_STYLE[item.status] || STATUS_STYLE.draft}`}>{item.status}</span>
                    </div>
                    <p className="font-semibold text-slate-900 truncate">{item.title}</p>
                  </div>
                  <button onClick={() => { setEditItem(item); changeTab("create"); }} className="flex-shrink-0 text-blue-600 hover:text-blue-800 p-1">
                    <Edit size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Create / Edit ── */}
        {activeTab === "create" && (
          <div>
            <div className="flex items-center gap-3 mb-6">
              {editItem && (
                <button onClick={() => { setEditItem(null); changeTab("manage"); }} className="text-slate-500 hover:text-slate-700">
                  <X size={20} />
                </button>
              )}
              <h1 className="text-3xl font-bold text-slate-900">
                {editItem ? `Editing: ${editItem.title.slice(0, 40)}${editItem.title.length > 40 ? "…" : ""}` : "Create New Content"}
              </h1>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-8">
              <UnifiedContentForm
                regions={REGIONS}
                onSubmit={handleContentSubmit}
                isLoading={isSubmitting}
                mode={editItem ? "edit" : "create"}
                initialData={editItem ? {
                  id: editItem.id,
                  contentType: editItem.contentType,
                  title: editItem.title,
                  excerpt: editItem.excerpt,
                  richContent: editItem.richContent,
                  region: editItem.region,
                  status: editItem.status,
                  coverImage: editItem.coverImage || "",
                  videoUrl: editItem.videoUrl || "",
                } : undefined}
              />
            </div>
          </div>
        )}

        {/* ── Manage Content ── */}
        {activeTab === "content" && (
          <div>
            <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
              <h1 className="text-3xl font-bold text-slate-900">Manage Content</h1>
              <button onClick={() => { setEditItem(null); changeTab("create"); }}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold text-sm">
                <Plus size={16} /> New Content
              </button>
            </div>

            <div className="mb-5 flex flex-wrap gap-2">
              {["all", "news", "announcement", "press_briefing", "blog", "video"].map((t) => (
                <button key={t} onClick={() => setTypeFilter(t)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-semibold border transition-colors ${typeFilter === t ? "bg-blue-600 text-white border-blue-600" : "bg-white text-slate-600 border-slate-300 hover:border-blue-400"}`}>
                  {t === "all" ? "All" : TYPE_LABEL[t] || t}
                </button>
              ))}
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 size={28} className="animate-spin text-slate-300" />
              </div>
            ) : filteredContent.length === 0 ? (
              <div className="text-center py-16 text-slate-500">
                <FileText size={40} className="mx-auto mb-3 opacity-30" />
                <p>No content yet. <button onClick={() => changeTab("create")} className="text-blue-600 font-semibold hover:underline">Create some</button></p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredContent.map((item) => (
                  <div key={`${item.contentType}-${item.id}`} className="bg-white border border-slate-200 rounded-xl p-5 hover:shadow-sm transition-shadow">
                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs font-semibold uppercase">{TYPE_LABEL[item.contentType] || item.contentType}</span>
                          <span className={`px-2 py-0.5 rounded text-xs font-semibold ${STATUS_STYLE[item.status] || STATUS_STYLE.draft}`}>{item.status}</span>
                          <span className="text-xs text-slate-400 capitalize">· {item.region}</span>
                        </div>
                        <h3 className="font-bold text-slate-900 truncate">{item.title}</h3>
                        <p className="text-sm text-slate-500 mt-1 line-clamp-1">{item.excerpt}</p>
                        <p className="text-xs text-slate-400 mt-1">{item.createdBy.name} · {new Date(item.updatedAt).toLocaleDateString()}</p>
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        <button onClick={() => toggleContentStatus(item)} title={item.status === "published" ? "Unpublish" : "Publish"}
                          className={`p-2 rounded-lg border transition-colors ${item.status === "published" ? "border-emerald-300 text-emerald-600 hover:bg-emerald-50" : "border-slate-300 text-slate-500 hover:bg-slate-50"}`}>
                          {item.status === "published" ? <Eye size={16} /> : <EyeOff size={16} />}
                        </button>
                        <button onClick={() => router.push(`/dashboard/cms/content/edit/${item.id}`)}
                          className="p-2 rounded-lg border border-blue-300 text-blue-600 hover:bg-blue-50 transition-colors">
                          <Edit size={16} />
                        </button>
                        <button onClick={() => setConfirmDelete({ id: item.id, type: item.contentType, title: item.title })}
                          className="p-2 rounded-lg border border-red-300 text-red-600 hover:bg-red-50 transition-colors">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <p className="text-xs text-slate-400 mt-2">{filteredContent.length} item{filteredContent.length !== 1 ? "s" : ""}</p>
          </div>
        )}

        {/* ── Hero Slides ── */}
        {activeTab === "hero" && (
          <div>
            <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
              <div>
                <h1 className="text-3xl font-bold text-slate-900">Hero Slides</h1>
                <p className="text-slate-500 text-sm mt-1">Manage homepage hero carousel content</p>
              </div>
              <div className="flex gap-3">
                <button onClick={addSlide} className="flex items-center gap-2 px-4 py-2 border border-slate-300 bg-white rounded-lg hover:bg-slate-50 font-semibold text-sm text-slate-700">
                  <Plus size={16} /> Add Slide
                </button>
                <button onClick={saveHeroSlides} disabled={heroSaving}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold text-sm disabled:bg-slate-400">
                  <Save size={16} /> {heroSaving ? "Saving…" : "Save All"}
                </button>
              </div>
            </div>
            {heroSlides.length === 0 ? (
              <div className="text-center py-16 text-slate-500 bg-white border border-slate-200 rounded-xl">
                <p className="mb-3">No slides yet. The site uses built-in fallback slides.</p>
                <button onClick={addSlide} className="text-blue-600 font-semibold hover:underline">Add first slide</button>
              </div>
            ) : (
              <div className="space-y-4">
                {heroSlides.map((slide, idx) => (
                  <div key={slide.id} className="bg-white border border-slate-200 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm font-bold text-slate-500">SLIDE {idx + 1}</span>
                      <div className="flex gap-2">
                        <button onClick={() => moveSlide(slide.id, "up")} disabled={idx === 0} className="p-1.5 rounded border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-30"><ArrowUp size={14} /></button>
                        <button onClick={() => moveSlide(slide.id, "down")} disabled={idx === heroSlides.length - 1} className="p-1.5 rounded border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-30"><ArrowDown size={14} /></button>
                        <button onClick={() => updateSlide(slide.id, "active", !slide.active)}
                          className={`px-3 py-1 rounded text-xs font-semibold border ${slide.active ? "bg-emerald-50 border-emerald-300 text-emerald-700" : "bg-slate-50 border-slate-300 text-slate-500"}`}>
                          {slide.active ? "Active" : "Hidden"}
                        </button>
                        <button onClick={() => setHeroSlides((p) => p.filter((s) => s.id !== slide.id))}
                          className="p-1.5 rounded border border-red-200 text-red-500 hover:bg-red-50"><Trash2 size={14} /></button>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {(["label", "heading", "sub", "bg", "cta1Label", "cta1Href", "cta2Label", "cta2Href"] as (keyof HeroSlide)[]).map((field) => (
                        <div key={field} className={field === "sub" || field === "heading" ? "md:col-span-2" : ""}>
                          <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wide">{field}</label>
                          {field === "sub" || field === "heading" ? (
                            <textarea rows={field === "sub" ? 3 : 2} value={String(slide[field])}
                              onChange={(e) => updateSlide(slide.id, field, e.target.value)}
                              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                          ) : (
                            <input type="text" value={String(slide[field])}
                              onChange={(e) => updateSlide(slide.id, field, e.target.value)}
                              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Teams & Board ── */}
        {activeTab === "teams" && (
          <div>
            <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
              <div>
                <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-2"><Users2 size={28} /> Teams &amp; Board</h1>
                <p className="text-slate-500 text-sm mt-1">Manage management team and board of trustees members.</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => router.push("/dashboard/cms/teams/manage")}
                  className="flex items-center gap-2 px-4 py-2 border border-slate-300 bg-white rounded-lg hover:bg-slate-50 text-sm font-semibold text-slate-700">
                  <ExternalLink size={15} /> Full Manager
                </button>
                <button onClick={() => router.push("/dashboard/cms/teams/create")}
                  className="flex items-center gap-2 px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 font-semibold text-sm">
                  <Plus size={16} /> Add Member
                </button>
              </div>
            </div>

            <div className="mb-4 flex flex-wrap gap-2">
              {(["all", "management", "board"] as const).map((t) => (
                <button key={t} onClick={() => setTeamTypeFilter(t)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-semibold border transition-colors ${teamTypeFilter === t ? "bg-green-700 text-white border-green-700" : "bg-white text-slate-600 border-slate-300 hover:border-green-400"}`}>
                  {t === "all" ? "All" : t === "management" ? "Management" : "Board of Trustees"}
                </button>
              ))}
            </div>

            {teamsLoading ? (
              <div className="flex items-center justify-center py-20"><Loader2 size={28} className="animate-spin text-slate-300" /></div>
            ) : filteredTeams.length === 0 ? (
              <div className="text-center py-16 bg-white border border-slate-200 rounded-xl">
                <Users2 size={40} className="mx-auto mb-3 text-slate-200" />
                <p className="text-slate-500 mb-3">No team members yet.</p>
                <button onClick={() => router.push("/dashboard/cms/teams/create")} className="text-green-700 font-semibold hover:underline text-sm">+ Add first member</button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredTeams.map((m) => (
                  <div key={m.id} className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow">
                    <div className="relative h-40 bg-green-900">
                      {m.avatar ? (
                        <Image src={m.avatar} alt={m.name} fill className="object-cover object-top" sizes="300px" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-white/30 text-5xl font-bold">{m.name[0]}</span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide ${STATUS_STYLE[m.status] || STATUS_STYLE.draft}`}>{m.status}</span>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-slate-900 text-sm leading-tight">{m.name}</h3>
                      <p className="text-xs text-green-700 font-semibold mt-0.5 mb-1">{m.role}</p>
                      <div className="flex gap-1 mt-1">
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${m.teamType === "management" ? "bg-blue-100 text-blue-700" : "bg-purple-100 text-purple-700"}`}>
                          {m.teamType === "management" ? "Management" : "Board"}
                        </span>
                        <span className="px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] font-semibold capitalize">{m.region}</span>
                      </div>
                      <div className="flex gap-1 mt-3 border-t border-slate-100 pt-3">
                        <button onClick={() => toggleTeamStatus(m)} title={m.status === "published" ? "Unpublish" : "Publish"}
                          className={`flex-1 flex items-center justify-center p-1.5 rounded border text-xs transition ${m.status === "published" ? "border-emerald-200 text-emerald-600 hover:bg-emerald-50" : "border-slate-200 text-slate-500 hover:bg-slate-50"}`}>
                          {m.status === "published" ? <EyeOff size={13} /> : <Eye size={13} />}
                        </button>
                        <button onClick={() => router.push(`/dashboard/cms/teams/edit/${m.id}`)}
                          className="flex-1 flex items-center justify-center p-1.5 rounded border border-blue-200 text-blue-600 hover:bg-blue-50 text-xs transition">
                          <Edit size={13} />
                        </button>
                        <button onClick={() => setConfirmDelete({ id: m.id, type: "team", title: m.name })}
                          className="flex-1 flex items-center justify-center p-1.5 rounded border border-red-200 text-red-500 hover:bg-red-50 text-xs transition">
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Gallery & Documents ── */}
        {activeTab === "media" && (
          <div>
            <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
              <div>
                <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-2"><ImageIcon size={28} /> Gallery &amp; Documents</h1>
                <p className="text-slate-500 text-sm mt-1">Manage gallery images and document files.</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => router.push("/dashboard/cms/media/manage")}
                  className="flex items-center gap-2 px-4 py-2 border border-slate-300 bg-white rounded-lg hover:bg-slate-50 text-sm font-semibold text-slate-700">
                  <ExternalLink size={15} /> Full Manager
                </button>
                <button onClick={() => router.push("/dashboard/cms/media/create")}
                  className="flex items-center gap-2 px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 font-semibold text-sm">
                  <Plus size={16} /> Add Media
                </button>
              </div>
            </div>

            <div className="mb-4 flex flex-wrap gap-2">
              {(["all", "gallery", "document"] as const).map((t) => (
                <button key={t} onClick={() => setMediaTypeFilter(t)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-semibold border transition-colors ${mediaTypeFilter === t ? "bg-green-700 text-white border-green-700" : "bg-white text-slate-600 border-slate-300 hover:border-green-400"}`}>
                  {t === "all" ? "All" : t === "gallery" ? "Gallery Images" : "Documents"}
                </button>
              ))}
            </div>

            {mediaLoading ? (
              <div className="flex items-center justify-center py-20"><Loader2 size={28} className="animate-spin text-slate-300" /></div>
            ) : filteredMedia.length === 0 ? (
              <div className="text-center py-16 bg-white border border-slate-200 rounded-xl">
                <ImageIcon size={40} className="mx-auto mb-3 text-slate-200" />
                <p className="text-slate-500 mb-3">No media items yet.</p>
                <button onClick={() => router.push("/dashboard/cms/media/create")} className="text-green-700 font-semibold hover:underline text-sm">+ Upload first item</button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredMedia.map((item) => (
                  <div key={item.id} className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow">
                    <div className="relative h-36 bg-slate-100">
                      {(item.coverImage || (item.mediaType === "gallery" && item.fileUrl)) ? (
                        <Image src={item.coverImage || item.fileUrl} alt={item.title} fill className="object-cover" sizes="300px" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <DocIcon size={32} className="text-slate-300" />
                        </div>
                      )}
                      <div className="absolute top-2 right-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${item.mediaType === "gallery" ? "bg-blue-100 text-blue-700" : "bg-orange-100 text-orange-700"}`}>
                          {item.mediaType === "gallery" ? "Gallery" : "Doc"}
                        </span>
                      </div>
                    </div>
                    <div className="p-3">
                      <h3 className="font-semibold text-slate-900 text-sm truncate">{item.title}</h3>
                      <div className="flex items-center gap-1 mt-1">
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${STATUS_STYLE[item.status] || STATUS_STYLE.draft}`}>{item.status}</span>
                        <span className="text-[10px] text-slate-400 capitalize ml-1">{item.region}</span>
                      </div>
                      <div className="flex gap-1 mt-2 border-t border-slate-100 pt-2">
                        <button onClick={() => toggleMediaStatus(item)}
                          className={`flex-1 flex items-center justify-center p-1.5 rounded border text-xs transition ${item.status === "published" ? "border-emerald-200 text-emerald-600 hover:bg-emerald-50" : "border-slate-200 text-slate-500 hover:bg-slate-50"}`}>
                          {item.status === "published" ? <EyeOff size={13} /> : <Eye size={13} />}
                        </button>
                        <button onClick={() => router.push(`/dashboard/cms/media/edit/${item.id}`)}
                          className="flex-1 flex items-center justify-center p-1.5 rounded border border-blue-200 text-blue-600 hover:bg-blue-50 text-xs transition">
                          <Edit size={13} />
                        </button>
                        <button onClick={() => setConfirmDelete({ id: item.id, type: "media", title: item.title })}
                          className="flex-1 flex items-center justify-center p-1.5 rounded border border-red-200 text-red-500 hover:bg-red-50 text-xs transition">
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Users ── */}
        {activeTab === "users" && canManageUsers && (
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-6">Manage Users</h1>
            <div className="bg-white border border-slate-200 rounded-xl p-8 mb-8">
              <h2 className="text-xl font-bold text-slate-900 mb-5">{editingUser ? `Editing: ${editingUser.name}` : "Create New User"}</h2>
              <form onSubmit={handleUserSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input value={userForm.name} onChange={(e) => setUserForm((p) => ({ ...p, name: e.target.value }))} required placeholder="Full Name"
                  className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                <input type="email" value={userForm.email} onChange={(e) => setUserForm((p) => ({ ...p, email: e.target.value }))} required={!editingUser} placeholder="Email"
                  disabled={!!editingUser} className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100" />
                <input type="password" value={userForm.password} onChange={(e) => setUserForm((p) => ({ ...p, password: e.target.value }))} required={!editingUser}
                  placeholder={editingUser ? "New password (leave blank to keep)" : "Password"}
                  className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                <select value={userForm.role} onChange={(e) => setUserForm((p) => ({ ...p, role: e.target.value as typeof userForm.role }))}
                  className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                  <option value="regional_admin">Regional Admin</option>
                  <option value="super_admin">Super Admin</option>
                </select>
                <select value={userForm.region} onChange={(e) => setUserForm((p) => ({ ...p, region: e.target.value }))}
                  className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                  {REGIONS.map((r) => <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>)}
                </select>
                <div className="md:col-span-2 flex gap-3">
                  <button type="submit" disabled={isSubmitting}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-slate-400 font-semibold">
                    {isSubmitting ? "Saving…" : editingUser ? "Update User" : "Create User"}
                  </button>
                  {editingUser && (
                    <button type="button" onClick={() => { setEditingUser(null); setUserForm({ name: "", email: "", password: "", role: "regional_admin", region: "national" }); }}
                      className="px-6 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 font-semibold text-slate-700">Cancel</button>
                  )}
                </div>
              </form>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-200">
                <h2 className="text-lg font-bold text-slate-900">All Users ({users.length})</h2>
              </div>
              {users.length === 0 ? <p className="p-6 text-slate-500">No users found.</p> : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-50 border-b border-slate-200">
                      <tr>{["Name", "Email", "Role", "Region", "Created", "Actions"].map((h) => (
                        <th key={h} className="text-left py-3 px-4 font-semibold text-slate-600">{h}</th>
                      ))}</tr>
                    </thead>
                    <tbody>
                      {users.map((u) => (
                        <tr key={u.id} className="border-b border-slate-100 hover:bg-slate-50">
                          <td className="py-3 px-4 font-medium">{u.name}</td>
                          <td className="py-3 px-4 text-slate-600">{u.email}</td>
                          <td className="py-3 px-4 capitalize">{u.role.replace("_", " ")}</td>
                          <td className="py-3 px-4 capitalize">{u.region}</td>
                          <td className="py-3 px-4 text-slate-500">{new Date(u.created_at).toLocaleDateString()}</td>
                          <td className="py-3 px-4">
                            <div className="flex gap-2">
                              <button onClick={() => { setEditingUser(u); setUserForm({ name: u.name, email: u.email, password: "", role: u.role as typeof userForm.role, region: u.region }); }}
                                className="p-1.5 rounded border border-blue-200 text-blue-600 hover:bg-blue-50"><Edit size={14} /></button>
                              {u.id !== user?.id && (
                                <button onClick={() => deleteUser(u.id)} className="p-1.5 rounded border border-red-200 text-red-600 hover:bg-red-50"><Trash2 size={14} /></button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

     {/* ── Confirm Delete Modal ── */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setConfirmDelete(null)}>
          <div className="bg-white rounded-xl shadow-2xl p-6 max-w-sm w-full" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-bold text-slate-800 text-lg mb-2">Confirm Delete</h3>
            <p className="text-sm text-slate-600 mb-6">
              Are you sure you want to delete <strong>&ldquo;{confirmDelete.title}&rdquo;</strong>? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  if (confirmDelete.type === "team") handleDeleteTeam(confirmDelete.id, confirmDelete.title);
                  else if (confirmDelete.type === "media") handleDeleteMedia(confirmDelete.id, confirmDelete.title);
                  else handleDeleteContent(confirmDelete.id);
                }}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-semibold">
                <Trash2 size={15} /> Delete
              </button>
              <button onClick={() => setConfirmDelete(null)} className="flex-1 px-4 py-2.5 border border-slate-300 rounded-lg hover:bg-slate-50 text-sm font-medium">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
</div>
      );
}