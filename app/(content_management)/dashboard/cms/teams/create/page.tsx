"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Upload, X, ArrowLeft, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import Image from "next/image";

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

interface AlertState {
  message: string;
  type: "success" | "error";
}

export default function TeamsCreatePage() {
  const router = useRouter();
  const [initialRegion, setInitialRegion] = useState<CmsRegion>("national");
  const [formData, setFormData] = useState<TeamFormData>({
    name: "",
    role: "",
    joined: "",
    avatar: "",
    focus: "",
    teamType: "management",
    region: "national",
    status: "draft",
  });
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState("");
  const [alert, setAlert] = useState<AlertState | null>(null);

  // Fetch current user on mount to pre-fill region
  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((u) => {
        if (u?.region) {
          setInitialRegion(u.region as CmsRegion);
          setFormData((prev) => ({ ...prev, region: u.region as CmsRegion }));
        }
      })
      .catch(() => {
        router.replace("/dashboard/login");
      });
  }, [router]);

  const showAlert = (message: string, type: "success" | "error") => {
    setAlert({ message, type });
    if (type === "success") {
      setTimeout(() => router.push("/dashboard/cms"), 1800);
    }
  };

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
      showAlert(err instanceof Error ? err.message : "Avatar upload failed", "error");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.role.trim() || !formData.focus.trim()) {
      showAlert("Name, Role, and Bio/Focus are required.", "error");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/cms/teams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          joined: formData.joined || null,
          avatar: formData.avatar || null,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create team member");
      showAlert("Team member created successfully!", "success");
    } catch (err) {
      showAlert(err instanceof Error ? err.message : "Error creating team member", "error");
    } finally {
      setLoading(false);
    }
  };

  const field = (label: string, key: keyof TeamFormData, opts?: { required?: boolean; placeholder?: string }) => (
    <div>
      <label className="block text-sm font-semibold text-slate-700 mb-1.5">
        {label} {opts?.required && <span className="text-red-500">*</span>}
      </label>
      <input
        value={formData[key] as string}
        onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
        placeholder={opts?.placeholder}
        className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition text-sm"
        required={opts?.required}
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-800 mb-6 text-sm transition"
        >
          <ArrowLeft size={16} /> Back to Dashboard
        </button>

        <h1 className="text-2xl font-bold text-slate-800 mb-2">Add Team Member</h1>
        <p className="text-slate-500 text-sm mb-8">Add a new member to the management team or board of trustees.</p>

        {alert && (
          <div
            className={`mb-6 p-4 rounded-lg flex items-start gap-3 ${
              alert.type === "success"
                ? "bg-emerald-50 border border-emerald-200 text-emerald-800"
                : "bg-red-50 border border-red-200 text-red-800"
            }`}
          >
            {alert.type === "success" ? <CheckCircle size={18} className="flex-shrink-0 mt-0.5" /> : <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />}
            <span className="text-sm font-medium">{alert.message}</span>
            <button onClick={() => setAlert(null)} className="ml-auto flex-shrink-0 opacity-60 hover:opacity-100">
              <X size={16} />
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-5">
          {field("Full Name", "name", { required: true, placeholder: "e.g. Clement Chiwambo" })}
          {field("Role / Title", "role", { required: true, placeholder: "e.g. Funding & Compliance Manager" })}
          {field("Year Joined", "joined", { placeholder: "e.g. 2025" })}

          {/* Team Type */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Team Type <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.teamType}
              onChange={(e) => setFormData({ ...formData, teamType: e.target.value as CmsTeamType })}
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none text-sm"
              required
            >
              <option value="management">Management Team</option>
              <option value="board">Board of Trustees</option>
            </select>
          </div>

          {/* Region */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Region <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.region}
              onChange={(e) => setFormData({ ...formData, region: e.target.value as CmsRegion })}
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none text-sm"
              required
            >
              <option value="national">National</option>
              <option value="northern">Northern</option>
              <option value="central">Central</option>
              <option value="southern">Southern</option>
              <option value="eastern">Eastern</option>
            </select>
          </div>

          {/* Avatar Upload */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Profile Photo</label>
            {preview ? (
              <div className="relative w-full h-52 rounded-lg overflow-hidden border border-slate-200 mb-2">
                <Image src={preview} alt="Preview" fill className="object-cover object-top" />
                <button
                  type="button"
                  onClick={() => { setPreview(""); setFormData((prev) => ({ ...prev, avatar: "" })); }}
                  className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600 transition"
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <label className="flex items-center justify-center gap-3 w-full h-32 border-2 border-dashed border-slate-300 rounded-lg hover:border-green-400 hover:bg-green-50 cursor-pointer transition">
                {uploading ? (
                  <><Loader2 size={20} className="animate-spin text-slate-400" /><span className="text-sm text-slate-500">Uploading...</span></>
                ) : (
                  <><Upload size={20} className="text-slate-400" /><span className="text-sm text-slate-500">Click to upload photo (JPG, PNG, WebP)</span></>
                )}
                <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" disabled={uploading} />
              </label>
            )}
          </div>

          {/* Bio / Focus */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Bio / Focus <span className="text-red-500">*</span>
              <span className="text-xs font-normal text-slate-400 ml-2">Full biography / background description</span>
            </label>
            <textarea
              value={formData.focus}
              onChange={(e) => setFormData({ ...formData, focus: e.target.value })}
              rows={8}
              placeholder="Describe the member's background, qualifications, and focus areas..."
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none resize-vertical text-sm"
              required
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Publish Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as ContentStatus })}
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none text-sm"
            >
              <option value="draft">Draft (not visible on website)</option>
              <option value="published">Published (live on website)</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          <div className="flex gap-3 pt-2 border-t border-slate-100">
            <button
              type="submit"
              disabled={loading || uploading}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-green-700 text-white rounded-lg hover:bg-green-800 disabled:bg-slate-300 disabled:cursor-not-allowed font-semibold text-sm transition"
            >
              {loading ? <><Loader2 size={16} className="animate-spin" /> Creating...</> : "Create Team Member"}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-3 border border-slate-300 rounded-lg hover:bg-slate-50 text-sm font-medium transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
