"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import { Upload, X, ArrowLeft, Loader2, CheckCircle, AlertCircle } from "lucide-react";

type CmsTeamType = "management" | "board";
type CmsRegion = "national" | "northern" | "central" | "southern" | "eastern";
type ContentStatus = "draft" | "published" | "archived";

interface TeamFormData {
  name: string;
  role: string;
  joined: string;
  avatar: string;
  focus: string;
  teamType: CmsTeamType;
  region: CmsRegion;
  status: ContentStatus;
}

interface AlertState { message: string; type: "success" | "error" }

export default function TeamsEditPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [formData, setFormData] = useState<TeamFormData>({
    name: "", role: "", joined: "", avatar: "", focus: "",
    teamType: "management", region: "national", status: "draft",
  });
  const [loadingData, setLoadingData] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState("");
  const [alert, setAlert] = useState<AlertState | null>(null);

  const showAlert = (message: string, type: "success" | "error") => setAlert({ message, type });

  useEffect(() => {
    fetch(`/api/cms/teams/${id}`)
      .then((r) => {
        if (!r.ok) throw new Error("Member not found");
        return r.json();
      })
      .then((data) => {
        setFormData({
          name: data.name || "",
          role: data.role || "",
          joined: data.joined || "",
          avatar: data.avatar || "",
          focus: data.focus || "",
          teamType: data.teamType || "management",
          region: data.region || "national",
          status: data.status || "draft",
        });
        if (data.avatar) setPreview(data.avatar);
      })
      .catch(() => { showAlert("Failed to load team member", "error"); })
      .finally(() => setLoadingData(false));
  }, [id]);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload/image", { method: "POST", body: fd });
      if (!res.ok) throw new Error((await res.json()).error || "Upload failed");
     
      const data = await res.json();
     
      setFormData((prev) => ({ ...prev, avatar: data.url }));
      setPreview(data.url);
    } catch (err) {
      showAlert(err instanceof Error ? err.message : "Upload failed", "error");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.role.trim() || !formData.focus.trim()) {
      showAlert("Name, Role, and Bio are required.", "error");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch(`/api/cms/teams/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, joined: formData.joined || null, avatar: formData.avatar || null }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Update failed");
      showAlert("Member updated successfully!", "success");
      setTimeout(() => router.push("/dashboard/cms/teams/manage"), 1500);
    } catch (err) {
      showAlert(err instanceof Error ? err.message : "Update failed", "error");
    } finally {
      setSaving(false);
    }
  };

  if (loadingData) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 size={32} className="animate-spin text-slate-300" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-2xl mx-auto">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-slate-500 hover:text-slate-800 mb-6 text-sm">
          <ArrowLeft size={16} /> Back
        </button>
        <h1 className="text-2xl font-bold text-slate-800 mb-2">Edit Team Member</h1>
        <p className="text-slate-500 text-sm mb-8">Update member information and publish status.</p>

        {alert && (
          <div className={`mb-6 p-4 rounded-lg flex items-start gap-3 ${alert.type === "success" ? "bg-emerald-50 border border-emerald-200 text-emerald-800" : "bg-red-50 border border-red-200 text-red-800"}`}>
            {alert.type === "success" ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
            <span className="text-sm font-medium">{alert.message}</span>
            <button onClick={() => setAlert(null)} className="ml-auto"><X size={16} /></button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-5">
          {/* Name */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Full Name <span className="text-red-500">*</span></label>
            <input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none text-sm" required />
          </div>
          {/* Role */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Role / Title <span className="text-red-500">*</span></label>
            <input value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none text-sm" required />
          </div>
          {/* Year Joined */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Year Joined</label>
            <input value={formData.joined} onChange={(e) => setFormData({ ...formData, joined: e.target.value })}
              placeholder="e.g. 2025" className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none text-sm" />
          </div>
          {/* Team Type */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Team Type <span className="text-red-500">*</span></label>
            <select value={formData.teamType} onChange={(e) => setFormData({ ...formData, teamType: e.target.value as CmsTeamType })}
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none text-sm">
              <option value="management">Management Team</option>
              <option value="board">Board of Trustees</option>
            </select>
          </div>
          {/* Region */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Region <span className="text-red-500">*</span></label>
            <select value={formData.region} onChange={(e) => setFormData({ ...formData, region: e.target.value as CmsRegion })}
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none text-sm">
              <option value="national">National</option>
              <option value="northern">Northern</option>
              <option value="central">Central</option>
              <option value="southern">Southern</option>
              <option value="eastern">Eastern</option>
            </select>
          </div>
          {/* Avatar */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Profile Photo</label>
            {preview ? (
              <div className="relative w-full h-52 rounded-lg overflow-hidden border mb-2">
                <Image src={preview} alt="Preview" fill className="object-cover object-top" />
                <button type="button" onClick={() => { setPreview(""); setFormData((prev) => ({ ...prev, avatar: "" })); }}
                  className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600"><X size={14} /></button>
              </div>
            ) : (
              <label className="flex items-center justify-center gap-3 w-full h-28 border-2 border-dashed border-slate-300 rounded-lg hover:border-green-400 hover:bg-green-50 cursor-pointer transition">
                {uploading ? <><Loader2 size={18} className="animate-spin text-slate-400" /><span className="text-sm text-slate-500">Uploading...</span></>
                  : <><Upload size={18} className="text-slate-400" /><span className="text-sm text-slate-500">Upload new photo</span></>}
                <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" disabled={uploading} />
              </label>
            )}
          </div>
          {/* Focus/Bio */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Bio / Focus <span className="text-red-500">*</span></label>
            <textarea value={formData.focus} onChange={(e) => setFormData({ ...formData, focus: e.target.value })}
              rows={8} className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none resize-vertical text-sm" required />
          </div>
          {/* Status */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Publish Status</label>
            <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value as ContentStatus })}
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none text-sm">
              <option value="draft">Draft</option>
              <option value="published">Published (live)</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          <div className="flex gap-3 pt-2 border-t border-slate-100">
            <button type="submit" disabled={saving || uploading}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-green-700 text-white rounded-lg hover:bg-green-800 disabled:bg-slate-300 font-semibold text-sm transition">
              {saving ? <><Loader2 size={16} className="animate-spin" /> Saving...</> : "Save Changes"}
            </button>
            <button type="button" onClick={() => router.back()} className="px-6 py-3 border border-slate-300 rounded-lg hover:bg-slate-50 text-sm font-medium">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
