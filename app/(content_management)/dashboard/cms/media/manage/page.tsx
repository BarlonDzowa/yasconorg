"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Plus, Trash2, Edit, Eye, EyeOff, Loader2, X, CheckCircle, AlertCircle, Image as ImageIcon, FileText, ArrowLeft, Filter } from "lucide-react";

type MediaItem = {
  id: number;
  title: string;
  slug: string;
  description?: string | null;
  mediaType: string;
  fileUrl: string;
  coverImage?: string | null;
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

export default function MediaManagePage() {
  const router = useRouter();
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState<"all" | "gallery" | "document">("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "published" | "draft" | "archived">("all");
  const [alert, setAlert] = useState<AlertState | null>(null);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<MediaItem | null>(null);

  const showAlert = (msg: string, type: "success" | "error") => setAlert({ message: msg, type });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ status: "all", limit: "100" });
      if (typeFilter !== "all") params.set("type", typeFilter);
      const res = await fetch(`/api/cms/media?${params}`);
      if (!res.ok) throw new Error("Failed to load");
      setItems(await res.json());
    } catch { showAlert("Failed to load media items", "error"); }
    finally { setLoading(false); }
  }, [typeFilter]);

  useEffect(() => { void load(); }, [load]);

  const handleDelete = async (item: MediaItem) => {
    setDeleting(item.id);
    try {
      const res = await fetch(`/api/cms/media/${item.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error((await res.json()).error || "Delete failed");
      showAlert(`"${item.title}" deleted.`, "success");
      setConfirmDelete(null);
      void load();
    } catch (err) { showAlert(err instanceof Error ? err.message : "Delete failed", "error"); }
    finally { setDeleting(null); }
  };

  const handleToggleStatus = async (item: MediaItem) => {
    const newStatus = item.status === "published" ? "draft" : "published";
    try {
      const res = await fetch(`/api/cms/media/${item.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error((await res.json()).error || "Update failed");
      showAlert(`"${item.title}" ${newStatus === "published" ? "published" : "unpublished"}.`, "success");
      void load();
    } catch (err) { showAlert(err instanceof Error ? err.message : "Update failed", "error"); }
  };

  const filtered = items.filter((i) => statusFilter === "all" || i.status === statusFilter);

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-5xl mx-auto">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-slate-500 hover:text-slate-800 mb-6 text-sm"><ArrowLeft size={16} /> Back</button>

        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2"><ImageIcon size={22} /> Gallery & Documents</h1>
            <p className="text-slate-500 text-sm mt-1">Manage gallery images and document files.</p>
          </div>
          <button onClick={() => router.push("/dashboard/cms/media/create")}
            className="flex items-center gap-2 px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 text-sm font-semibold transition">
            <Plus size={16} /> Add Media
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
        <div className="flex gap-3 mb-4 flex-wrap items-center">
          <Filter size={14} className="text-slate-400" />
          <span className="text-xs text-slate-500 font-medium">Type:</span>
          {(["all", "gallery", "document"] as const).map((t) => (
            <button key={t} onClick={() => setTypeFilter(t)}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition ${typeFilter === t ? "bg-green-700 text-white" : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"}`}>
              {t === "all" ? "All" : t === "gallery" ? "Gallery" : "Documents"}
            </button>
          ))}
          <span className="ml-4 text-xs text-slate-500 font-medium">Status:</span>
          {(["all", "published", "draft", "archived"] as const).map((s) => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={`px-3 py-1 rounded-full text-xs font-semibold capitalize transition ${statusFilter === s ? "bg-slate-700 text-white" : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"}`}>
              {s}
            </button>
          ))}
        </div>

        {/* Grid or table */}
        {loading ? (
          <div className="flex items-center justify-center py-20 bg-white rounded-xl border"><Loader2 size={28} className="animate-spin text-slate-300" /></div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl border">
            <ImageIcon size={40} className="mx-auto text-slate-200 mb-3" />
            <p className="text-slate-400 text-sm">No media items found.</p>
            <button onClick={() => router.push("/dashboard/cms/media/create")} className="mt-4 text-green-700 text-sm font-semibold hover:underline">+ Add first media item</button>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="bg-slate-50 border-b">
                <tr>
                  <th className="text-left text-xs font-semibold text-slate-500 px-4 py-3">Item</th>
                  <th className="text-left text-xs font-semibold text-slate-500 px-4 py-3 hidden md:table-cell">Type</th>
                  <th className="text-left text-xs font-semibold text-slate-500 px-4 py-3 hidden lg:table-cell">Region</th>
                  <th className="text-left text-xs font-semibold text-slate-500 px-4 py-3">Status</th>
                  <th className="text-right text-xs font-semibold text-slate-500 px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 transition">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0 flex items-center justify-center">
                          {item.coverImage || (item.mediaType === "gallery" && item.fileUrl) ? (
                            <Image src={item.coverImage || item.fileUrl} alt={item.title} width={40} height={40} className="object-cover w-full h-full" />
                          ) : (
                            <FileText size={18} className="text-slate-400" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-800 leading-tight">{item.title}</p>
                          {item.description && <p className="text-xs text-slate-400 truncate max-w-[200px]">{item.description}</p>}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className={`px-2 py-0.5 rounded text-xs font-semibold ${item.mediaType === "gallery" ? "bg-blue-100 text-blue-700" : "bg-orange-100 text-orange-700"}`}>
                        {item.mediaType === "gallery" ? "Gallery" : "Document"}
                      </span>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell"><span className="text-xs text-slate-500 capitalize">{item.region}</span></td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded text-xs font-semibold capitalize ${STATUS_STYLE[item.status] || STATUS_STYLE.draft}`}>{item.status}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => handleToggleStatus(item)} title={item.status === "published" ? "Unpublish" : "Publish"}
                          className="p-1.5 rounded hover:bg-slate-100 text-slate-500 hover:text-slate-700 transition">
                          {item.status === "published" ? <EyeOff size={15} /> : <Eye size={15} />}
                        </button>
                        <button onClick={() => router.push(`/dashboard/cms/media/edit/${item.id}`)} title="Edit"
                          className="p-1.5 rounded hover:bg-blue-50 text-blue-500 transition"><Edit size={15} /></button>
                        <button onClick={() => setConfirmDelete(item)} title="Delete"
                          className="p-1.5 rounded hover:bg-red-50 text-red-400 hover:text-red-600 transition"><Trash2 size={15} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <p className="text-xs text-slate-400 mt-2">{filtered.length} item{filtered.length !== 1 ? "s" : ""}</p>
      </div>

      {confirmDelete && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-sm w-full">
            <h3 className="font-bold text-slate-800 mb-2">Delete Media Item</h3>
            <p className="text-sm text-slate-600 mb-6">Delete <strong>{confirmDelete.title}</strong>? This cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => handleDelete(confirmDelete)} disabled={deleting === confirmDelete.id}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 text-sm font-semibold">
                {deleting === confirmDelete.id ? <Loader2 size={15} className="animate-spin" /> : <Trash2 size={15} />} Delete
              </button>
              <button onClick={() => setConfirmDelete(null)} className="flex-1 px-4 py-2.5 border border-slate-300 rounded-lg hover:bg-slate-50 text-sm font-medium">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
