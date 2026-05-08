"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Plus, Trash2, Edit, Eye, EyeOff, Loader2, X, CheckCircle, AlertCircle,
  FileText, ArrowLeft, Filter
} from "lucide-react";

type ContentItem = {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  richContent: string;
  contentType: string;
  region: string;
  status: string;
  updatedAt: string;
  createdBy: { name: string };
};

type AlertState = { message: string; type: "success" | "error" };

const STATUS_STYLE: Record<string, string> = {
  published: "bg-emerald-100 text-emerald-700",
  draft: "bg-amber-100 text-amber-700",
  archived: "bg-slate-100 text-slate-700",
};

const TYPE_LABEL: Record<string, string> = {
  news: "News",
  announcement: "Announcement",
  press_briefing: "Press Briefing",
  blog: "Blog",
  video: "Video",
};

export default function ContentManagePage() {
  const router = useRouter();
  const [items, setItems] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState<"all" | string>("all");
  const [statusFilter, setStatusFilter] = useState<"all" | string>("all");
  const [alert, setAlert] = useState<AlertState | null>(null);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<ContentItem | null>(null);

  const showAlert = (message: string, type: "success" | "error") => setAlert({ message, type });

  const load = useCallback(async () => { 
    console.log('ContentManage - Loading items with filters:', {typeFilter, statusFilter}); 
    setLoading(true);
    try {
      const params = new URLSearchParams({ status: "all", limit: "100" });
      if (typeFilter !== "all") params.set("contentType", typeFilter);
      if (statusFilter !== "all") params.set("status", statusFilter);
      const res = await fetch(`/api/cms/content?${params}`);
      if (!res.ok) throw new Error("Failed to load");
      setItems(await res.json());
    } catch {
      showAlert("Failed to load content", "error");
    } finally {
      setLoading(false);
    }
  }, [typeFilter, statusFilter]);

  useEffect(() => { void load(); }, [load]);

  const handleDelete = async (item: ContentItem) => {
    setDeleting(item.id);
    try {
      const res = await fetch(`/api/cms/content/${item.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error((await res.json()).error || "Delete failed");
      showAlert(`"${item.title}" deleted.`, "success");
      setConfirmDelete(null);
      void load();
    } catch (err) {
      showAlert(err instanceof Error ? err.message : "Delete failed", "error");
    } finally {
      setDeleting(null);
    }
  };

  const handleToggleStatus = async (item: ContentItem) => {
    const newStatus = item.status === "published" ? "draft" : "published";
    try {
      const res = await fetch(`/api/cms/content/${item.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error((await res.json()).error || "Update failed");
      showAlert(`"${item.title}" ${newStatus === "published" ? "published" : "unpublished"}.`, "success");
      void load();
    } catch (err) {
      showAlert(err instanceof Error ? err.message : "Update failed", "error");
    }
  };

  const filtered = items.filter((i) => typeFilter === "all" || i.contentType === typeFilter);

  const uniqueTypes = Array.from(new Set(items.map(i => i.contentType)));

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-5xl mx-auto">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-slate-500 hover:text-slate-800 mb-6 text-sm transition">
          <ArrowLeft size={16} /> Back
        </button>

        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2"><FileText size={22} /> Content</h1>
            <p className="text-slate-500 text-sm mt-1">Manage all content across news, blogs, announcements, videos, etc.</p>
          </div>
          <button
            onClick={() => router.push("/dashboard/cms/content/create")}
            className="flex items-center gap-2 px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 text-sm font-semibold transition"
          >
            <Plus size={16} /> New Content
          </button>
        </div>

        {alert && (
          <div className={`mb-4 p-3 rounded-lg flex items-center gap-3 ${alert.type === "success" ? "bg-emerald-50 border border-emerald-200 text-emerald-800" : "bg-red-50 border border-red-200 text-red-800"}`}>
            {alert.type === "success" ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
            <span className="text-sm">{alert.message}</span>
            <button onClick={() => setAlert(null)} className="ml-auto"><X size={14} /></button>
          </div>
        )}

        {/* Filters */}
        <div className="flex gap-3 mb-4 flex-wrap">
          <div className="flex items-center gap-2">
            <Filter size={14} className="text-slate-400" />
            <span className="text-xs text-slate-500 font-medium">Type:</span>
          </div>
          <button onClick={() => setTypeFilter("all")}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition ${typeFilter === "all" ? "bg-green-700 text-white" : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"}`}>
            All
          </button>
          {uniqueTypes.map((t) => (
            <button key={t} onClick={() => setTypeFilter(t)}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition ${typeFilter === t ? "bg-green-700 text-white" : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"}`}>
              {TYPE_LABEL[t] || t}
            </button>
          ))}
          <div className="ml-4 flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">Status:</span>
          </div>
          {(["all", "published", "draft", "archived"] as const).map((s) => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={`px-3 py-1 rounded-full text-xs font-semibold capitalize transition ${statusFilter === s ? "bg-slate-700 text-white" : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"}`}>
              {s}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 size={28} className="animate-spin text-slate-300" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <FileText size={40} className="mx-auto text-slate-200 mb-3" />
              <p className="text-slate-400 text-sm">No content found.</p>
              <button onClick={() => router.push("/dashboard/cms/content/create")} className="mt-4 text-green-700 text-sm font-semibold hover:underline">
                + Create first piece
              </button>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left text-xs font-semibold text-slate-500 px-4 py-3">Title</th>
                  <th className="text-left text-xs font-semibold text-slate-500 px-4 py-3 hidden md:table-cell">Type</th>
                  <th className="text-left text-xs font-semibold text-slate-500 px-4 py-3 hidden lg:table-cell">Region</th>
                  <th className="text-left text-xs font-semibold text-slate-500 px-4 py-3 hidden lg:table-cell">Status</th>
                  <th className="text-left text-xs font-semibold text-slate-500 px-4 py-3">Updated</th>
                  <th className="text-right text-xs font-semibold text-slate-500 px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((i) => {
                  return (
                
                  <tr key={i.id} className="hover:bg-slate-50 transition">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-400 to-blue-600 flex-shrink-0 flex items-center justify-center">
                          <span className="text-white font-bold text-xs">{i.title[0]}</span>
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-slate-800 truncate">{i.title}</p>
                          <p className="text-xs text-slate-400 truncate md:hidden">{TYPE_LABEL[i.contentType] || i.contentType}</p>
                          <p className="text-xs text-slate-500">{i.excerpt.slice(0, 60)}...</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className={`px-2 py-0.5 rounded text-xs font-semibold ${i.contentType === "news" ? "bg-blue-100 text-blue-700" : "bg-purple-100 text-purple-700"}`}>
                        {TYPE_LABEL[i.contentType] || i.contentType}
                      </span>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <span className="text-xs text-slate-500 capitalize">{i.region}</span>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <span className={`px-2 py-0.5 rounded text-xs font-semibold capitalize ${STATUS_STYLE[i.status] || STATUS_STYLE.draft}`}>
                        {i.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs text-slate-500">{new Date(i.updatedAt).toLocaleDateString()}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleToggleStatus(i)}
                          title={i.status === "published" ? "Unpublish" : "Publish"}
                          className="p-1.5 rounded hover:bg-slate-100 text-slate-500 hover:text-slate-700 transition"
                        >
                          {i.status === "published" ? <EyeOff size={15} /> : <Eye size={15} />}
                        </button>
                        <button
                          onClick={() => { 
                            console.log('Navigate to edit URL:', `/dashboard/cms/content/edit/${i.id}`, 'full item:', i); 
                            router.push(`/dashboard/cms/content/edit/${i.id}`); 
                          }}
                          title="Edit"
                          className="p-1.5 rounded hover:bg-blue-50 text-blue-500 hover:text-blue-700 transition"
                        >
                          <Edit size={15} />
                        </button>
                        <button
                          onClick={() => setConfirmDelete(i)}
                          title="Delete"
                          className="p-1.5 rounded hover:bg-red-50 text-red-400 hover:text-red-600 transition"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
        <p className="text-xs text-slate-400 mt-2">{filtered.length} item{filtered.length !== 1 ? "s" : ""}</p>
      </div>

      {/* Confirm Delete Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-sm w-full">
            <h3 className="font-bold text-slate-800 mb-2">Delete Content</h3>
            <p className="text-sm text-slate-600 mb-6">
              Are you sure you want to delete <strong>{confirmDelete.title}</strong>? This cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => handleDelete(confirmDelete)}
                disabled={deleting === confirmDelete.id}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 text-sm font-semibold"
              >
                {deleting === confirmDelete.id ? <Loader2 size={15} className="animate-spin" /> : <Trash2 size={15} />}
                Delete
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

