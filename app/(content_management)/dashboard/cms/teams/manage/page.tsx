"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Plus, Trash2, Edit, Eye, EyeOff, Loader2, X, CheckCircle, AlertCircle,
  Users2, ArrowLeft, Filter
} from "lucide-react";

type TeamMember = {
  id: number;
  name: string;
  role: string;
  joined?: string | null;
  avatar?: string | null;
  focus: string;
  teamType: string;
  region: string;
  status: string;
  publishedAt?: string | null;
  updatedAt: string;
  createdBy: { name: string };
};

type AlertState = { message: string; type: "success" | "error" };

const STATUS_STYLE: Record<string, string> = {
  published: "bg-emerald-100 text-emerald-700",
  draft: "bg-amber-100 text-amber-700",
  archived: "bg-slate-100 text-slate-700",
};

export default function TeamsManagePage() {
  const router = useRouter();
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState<"all" | "management" | "board">("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "published" | "draft" | "archived">("all");
  const [alert, setAlert] = useState<AlertState | null>(null);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<TeamMember | null>(null);

  const showAlert = (message: string, type: "success" | "error") => setAlert({ message, type });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ status: "all", limit: "100" });
      if (typeFilter !== "all") params.set("type", typeFilter);
      const res = await fetch(`/api/cms/teams?${params}`);
      if (!res.ok) throw new Error("Failed to load");
      setMembers(await res.json());
    } catch {
      showAlert("Failed to load team members", "error");
    } finally {
      setLoading(false);
    }
  }, [typeFilter]);

  useEffect(() => { void load(); }, [load]);

  const handleDelete = async (member: TeamMember) => {
    setDeleting(member.id);
    try {
      const res = await fetch(`/api/cms/teams/${member.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error((await res.json()).error || "Delete failed");
      showAlert(`"${member.name}" deleted.`, "success");
      setConfirmDelete(null);
      void load();
    } catch (err) {
      showAlert(err instanceof Error ? err.message : "Delete failed", "error");
    } finally {
      setDeleting(null);
    }
  };

  const handleToggleStatus = async (member: TeamMember) => {
    const newStatus = member.status === "published" ? "draft" : "published";
    try {
      const res = await fetch(`/api/cms/teams/${member.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error((await res.json()).error || "Update failed");
      showAlert(`"${member.name}" ${newStatus === "published" ? "published" : "unpublished"}.`, "success");
      void load();
    } catch (err) {
      showAlert(err instanceof Error ? err.message : "Update failed", "error");
    }
  };

  const filtered = members.filter((m) => statusFilter === "all" || m.status === statusFilter);

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-5xl mx-auto">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-slate-500 hover:text-slate-800 mb-6 text-sm transition">
          <ArrowLeft size={16} /> Back
        </button>

        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2"><Users2 size={22} /> Teams & Board</h1>
            <p className="text-slate-500 text-sm mt-1">Manage management team and board of trustees members.</p>
          </div>
          <button
            onClick={() => router.push("/dashboard/cms/teams/create")}
            className="flex items-center gap-2 px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 text-sm font-semibold transition"
          >
            <Plus size={16} /> Add Member
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
          {(["all", "management", "board"] as const).map((t) => (
            <button key={t} onClick={() => setTypeFilter(t)}
              className={`px-3 py-1 rounded-full text-xs font-semibold capitalize transition ${typeFilter === t ? "bg-green-700 text-white" : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"}`}>
              {t === "all" ? "All" : t === "management" ? "Management" : "Board of Trustees"}
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
              <Users2 size={40} className="mx-auto text-slate-200 mb-3" />
              <p className="text-slate-400 text-sm">No team members found.</p>
              <button onClick={() => router.push("/dashboard/cms/teams/create")} className="mt-4 text-green-700 text-sm font-semibold hover:underline">
                + Add your first member
              </button>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left text-xs font-semibold text-slate-500 px-4 py-3">Member</th>
                  <th className="text-left text-xs font-semibold text-slate-500 px-4 py-3 hidden md:table-cell">Role</th>
                  <th className="text-left text-xs font-semibold text-slate-500 px-4 py-3 hidden lg:table-cell">Type</th>
                  <th className="text-left text-xs font-semibold text-slate-500 px-4 py-3 hidden lg:table-cell">Region</th>
                  <th className="text-left text-xs font-semibold text-slate-500 px-4 py-3">Status</th>
                  <th className="text-right text-xs font-semibold text-slate-500 px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((m) => (
                  <tr key={m.id} className="hover:bg-slate-50 transition">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full overflow-hidden bg-green-100 flex-shrink-0">
                          {m.avatar ? (
                            <Image src={m.avatar} alt={m.name} width={36} height={36} className="object-cover w-full h-full" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-green-800 font-bold text-sm">{m.name[0]}</div>
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-800">{m.name}</p>
                          <p className="text-xs text-slate-400 md:hidden">{m.role}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className="text-sm text-slate-600">{m.role}</span>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <span className={`px-2 py-0.5 rounded text-xs font-semibold ${m.teamType === "management" ? "bg-blue-100 text-blue-700" : "bg-purple-100 text-purple-700"}`}>
                        {m.teamType === "management" ? "Management" : "Board"}
                      </span>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <span className="text-xs text-slate-500 capitalize">{m.region}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded text-xs font-semibold capitalize ${STATUS_STYLE[m.status] || STATUS_STYLE.draft}`}>
                        {m.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleToggleStatus(m)}
                          title={m.status === "published" ? "Unpublish" : "Publish"}
                          className="p-1.5 rounded hover:bg-slate-100 text-slate-500 hover:text-slate-700 transition"
                        >
                          {m.status === "published" ? <EyeOff size={15} /> : <Eye size={15} />}
                        </button>
                        <button
                          onClick={() => router.push(`/dashboard/cms/teams/edit/${m.id}`)}
                          title="Edit"
                          className="p-1.5 rounded hover:bg-blue-50 text-blue-500 hover:text-blue-700 transition"
                        >
                          <Edit size={15} />
                        </button>
                        <button
                          onClick={() => setConfirmDelete(m)}
                          title="Delete"
                          className="p-1.5 rounded hover:bg-red-50 text-red-400 hover:text-red-600 transition"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        <p className="text-xs text-slate-400 mt-2">{filtered.length} member{filtered.length !== 1 ? "s" : ""}</p>
      </div>

      {/* Confirm Delete Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-sm w-full">
            <h3 className="font-bold text-slate-800 mb-2">Delete Member</h3>
            <p className="text-sm text-slate-600 mb-6">
              Are you sure you want to delete <strong>{confirmDelete.name}</strong>? This cannot be undone.
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
