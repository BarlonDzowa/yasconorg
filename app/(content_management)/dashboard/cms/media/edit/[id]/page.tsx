"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import { Upload, X, ArrowLeft, Loader2, CheckCircle, AlertCircle, FileText, Image as ImageIcon } from "lucide-react";

type CmsMediaType = "gallery" | "document";
type CmsRegion = "national" | "northern" | "central" | "southern" | "eastern";
type ContentStatus = "draft" | "published" | "archived";

interface MediaFormData {
  title: string;
  description: string;
  fileUrl: string;
  coverImage: string;
  mediaType: CmsMediaType;
  region: CmsRegion;
  status: ContentStatus;
}

interface AlertState { message: string; type: "success" | "error" }

export default function MediaEditPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [formData, setFormData] = useState<MediaFormData>({
    title: "", description: "", fileUrl: "", coverImage: "",
    mediaType: "gallery", region: "national", status: "draft",
  });
  const [loadingData, setLoadingData] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState<"file" | "cover" | null>(null);
  const [filePreview, setFilePreview] = useState("");
  const [coverPreview, setCoverPreview] = useState("");
  const [alert, setAlert] = useState<AlertState | null>(null);

  const showAlert = (msg: string, type: "success" | "error") => setAlert({ message: msg, type });

  useEffect(() => {
    fetch(`/api/cms/media/${id}`)
      .then((r) => { if (!r.ok) throw new Error("Not found"); return r.json(); })
      .then((data) => {
        setFormData({
          title: data.title || "", description: data.description || "",
          fileUrl: data.fileUrl || "", coverImage: data.coverImage || "",
          mediaType: data.mediaType || "gallery", region: data.region || "national",
          status: data.status || "draft",
        });
        if (data.mediaType === "gallery" && data.fileUrl) setFilePreview(data.fileUrl);
        if (data.coverImage) setCoverPreview(data.coverImage);
      })
      .catch(() => showAlert("Failed to load media item", "error"))
      .finally(() => setLoadingData(false));
  }, [id]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading("file");
    try {
      const fd = new FormData();
      fd.append("file", file);
      const endpoint = formData.mediaType === "gallery" ? "/api/upload/image" : "/api/upload/video";
      const res = await fetch(endpoint, { method: "POST", body: fd });
      if (!res.ok) throw new Error((await res.json()).error || "Upload failed");
      const data = await res.json();
      setFormData((prev) => ({ ...prev, fileUrl: data.url }));
      if (formData.mediaType === "gallery") setFilePreview(data.url);
    } catch (err) { showAlert(err instanceof Error ? err.message : "Upload failed", "error"); }
    finally { setUploading(null); }
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading("cover");
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload/image", { method: "POST", body: fd });
      if (!res.ok) throw new Error((await res.json()).error || "Upload failed");
      const data = await res.json();
      setFormData((prev) => ({ ...prev, coverImage: data.url }));
      setCoverPreview(data.url);
    } catch (err) { showAlert(err instanceof Error ? err.message : "Upload failed", "error"); }
    finally { setUploading(null); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) { showAlert("Title is required.", "error"); return; }
    setSaving(true);
    try {
      const res = await fetch(`/api/cms/media/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, description: formData.description || null, coverImage: formData.coverImage || null }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Update failed");
      showAlert("Media updated!", "success");
      setTimeout(() => router.push("/dashboard/cms/media/manage"), 1500);
    } catch (err) { showAlert(err instanceof Error ? err.message : "Update failed", "error"); }
    finally { setSaving(false); }
  };

  if (loadingData) return <div className="min-h-screen bg-slate-50 flex items-center justify-center"><Loader2 size={32} className="animate-spin text-slate-300" /></div>;

  const isGallery = formData.mediaType === "gallery";

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-2xl mx-auto">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-slate-500 hover:text-slate-800 mb-6 text-sm"><ArrowLeft size={16} /> Back</button>
        <h1 className="text-2xl font-bold text-slate-800 mb-2">Edit Media Item</h1>

        {alert && (
          <div className={`mb-6 p-4 rounded-lg flex items-start gap-3 ${alert.type === "success" ? "bg-emerald-50 border border-emerald-200 text-emerald-800" : "bg-red-50 border border-red-200 text-red-800"}`}>
            {alert.type === "success" ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
            <span className="text-sm font-medium">{alert.message}</span>
            <button onClick={() => setAlert(null)} className="ml-auto"><X size={16} /></button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-5">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Media Type</label>
            <div className="grid grid-cols-2 gap-3">
              {(["gallery", "document"] as const).map((type) => (
                <button key={type} type="button" onClick={() => setFormData((prev) => ({ ...prev, mediaType: type }))}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg border-2 transition text-sm font-medium ${formData.mediaType === type ? "border-green-600 bg-green-50 text-green-800" : "border-slate-200 text-slate-600"}`}>
                  {type === "gallery" ? <ImageIcon size={18} /> : <FileText size={18} />}
                  {type === "gallery" ? "Gallery Image" : "Document"}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Title <span className="text-red-500">*</span></label>
            <input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none text-sm" required />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Description</label>
            <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3} className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none resize-vertical text-sm" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Region</label>
            <select value={formData.region} onChange={(e) => setFormData({ ...formData, region: e.target.value as CmsRegion })}
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none text-sm">
              <option value="national">National</option>
              <option value="northern">Northern</option>
              <option value="central">Central</option>
              <option value="southern">Southern</option>
              <option value="eastern">Eastern</option>
            </select>
          </div>
          {/* File Upload */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">File {isGallery ? "(Image)" : "(PDF)"}</label>
            {filePreview && isGallery ? (
              <div className="relative w-full h-44 rounded-lg overflow-hidden border mb-2">
                <Image src={filePreview} alt="Preview" fill className="object-cover" />
                <button type="button" onClick={() => { setFilePreview(""); setFormData((p) => ({ ...p, fileUrl: "" })); }}
                  className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full"><X size={14} /></button>
              </div>
            ) : formData.fileUrl && !isGallery ? (
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200 mb-2">
                <FileText size={18} className="text-blue-600" />
                <span className="text-sm text-blue-800 truncate">{formData.fileUrl.split("/").pop()}</span>
                <button type="button" onClick={() => setFormData((p) => ({ ...p, fileUrl: "" }))} className="ml-auto text-red-500"><X size={15} /></button>
              </div>
            ) : (
              <label className="flex items-center justify-center gap-3 w-full h-28 border-2 border-dashed border-slate-300 rounded-lg hover:border-green-400 cursor-pointer transition">
                {uploading === "file" ? <><Loader2 size={18} className="animate-spin" /><span className="text-sm text-slate-500">Uploading...</span></>
                  : <><Upload size={18} className="text-slate-400" /><span className="text-sm text-slate-500">Replace {isGallery ? "image" : "document"}</span></>}
                <input type="file" accept={isGallery ? "image/*" : "application/pdf"} onChange={handleFileUpload} className="hidden" disabled={uploading !== null} />
              </label>
            )}
          </div>
          {!isGallery && (
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Cover Thumbnail</label>
              {coverPreview ? (
                <div className="relative w-full h-36 rounded-lg overflow-hidden border mb-2">
                  <Image src={coverPreview} alt="Cover" fill className="object-cover" />
                  <button type="button" onClick={() => { setCoverPreview(""); setFormData((p) => ({ ...p, coverImage: "" })); }}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full"><X size={14} /></button>
                </div>
              ) : (
                <label className="flex items-center gap-3 px-4 py-3 border-2 border-dashed border-slate-300 rounded-lg hover:border-green-400 cursor-pointer transition">
                  {uploading === "cover" ? <><Loader2 size={18} className="animate-spin" /><span className="text-sm text-slate-500">Uploading...</span></>
                    : <><ImageIcon size={18} className="text-slate-400" /><span className="text-sm text-slate-500">Replace cover thumbnail</span></>}
                  <input type="file" accept="image/*" onChange={handleCoverUpload} className="hidden" disabled={uploading !== null} />
                </label>
              )}
            </div>
          )}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Status</label>
            <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value as ContentStatus })}
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none text-sm">
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </div>
          <div className="flex gap-3 pt-2 border-t border-slate-100">
            <button type="submit" disabled={saving || uploading !== null}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-green-700 text-white rounded-lg hover:bg-green-800 disabled:bg-slate-300 font-semibold text-sm transition">
              {saving ? <><Loader2 size={16} className="animate-spin" /> Saving...</> : "Save Changes"}
            </button>
            <button type="button" onClick={() => router.back()} className="px-6 py-3 border border-slate-300 rounded-lg hover:bg-slate-50 text-sm">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
