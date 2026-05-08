"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Upload, X, ArrowLeft, Loader2, CheckCircle, AlertCircle, FileText, Image as ImageIcon } from "lucide-react";
import Image from "next/image";

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

interface AlertState {
  message: string;
  type: "success" | "error";
}

export default function MediaCreatePage() {
  const router = useRouter();
  const [formData, setFormData] = useState<MediaFormData>({
    title: "",
    description: "",
    fileUrl: "",
    coverImage: "",
    mediaType: "gallery",
    region: "national",
    status: "draft",
  });
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState<"file" | "cover" | null>(null);
  const [filePreview, setFilePreview] = useState("");
  const [coverPreview, setCoverPreview] = useState("");
  const [alert, setAlert] = useState<AlertState | null>(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((u) => {
        if (u?.region) setFormData((prev) => ({ ...prev, region: u.region as CmsRegion }));
      })
      .catch(() => router.replace("/dashboard/login"));
  }, [router]);

  const showAlert = (message: string, type: "success" | "error") => {
    setAlert({ message, type });
    if (type === "success") setTimeout(() => router.push("/dashboard/cms"), 1800);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading("file");
    try {
      const fd = new FormData();
      fd.append("file", file);
      const endpoint = formData.mediaType === "gallery" ? "/api/upload/image" : "/api/upload/document";
      const res = await fetch(endpoint, { method: "POST", body: fd });
      if (!res.ok) throw new Error((await res.json()).error || "Upload failed");
      const data = await res.json();
      setFormData((prev) => ({ ...prev, fileUrl: data.url }));
      if (formData.mediaType === "gallery") setFilePreview(data.url);
      else setFilePreview(data.url);
    } catch (err) {
      showAlert(err instanceof Error ? err.message : "File upload failed", "error");
    } finally {
      setUploading(null);
    }
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
    } catch (err) {
      showAlert(err instanceof Error ? err.message : "Cover upload failed", "error");
    } finally {
      setUploading(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.fileUrl) {
      showAlert("Title and file are required.", "error");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/cms/media", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          description: formData.description || null,
          coverImage: formData.coverImage || null,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create media item");
      showAlert("Media item created successfully!", "success");
    } catch (err) {
      showAlert(err instanceof Error ? err.message : "Error creating media item", "error");
    } finally {
      setLoading(false);
    }
  };

  const isGallery = formData.mediaType === "gallery";

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-2xl mx-auto">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-slate-500 hover:text-slate-800 mb-6 text-sm transition">
          <ArrowLeft size={16} /> Back to Dashboard
        </button>

        <h1 className="text-2xl font-bold text-slate-800 mb-2">Add Media Item</h1>
        <p className="text-slate-500 text-sm mb-8">Upload gallery images or documents to your media library.</p>

        {alert && (
          <div className={`mb-6 p-4 rounded-lg flex items-start gap-3 ${alert.type === "success" ? "bg-emerald-50 border border-emerald-200 text-emerald-800" : "bg-red-50 border border-red-200 text-red-800"}`}>
            {alert.type === "success" ? <CheckCircle size={18} className="flex-shrink-0 mt-0.5" /> : <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />}
            <span className="text-sm font-medium">{alert.message}</span>
            <button onClick={() => setAlert(null)} className="ml-auto"><X size={16} /></button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-5">
          {/* Media type selector */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Media Type <span className="text-red-500">*</span></label>
            <div className="grid grid-cols-2 gap-3">
              {(["gallery", "document"] as const).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => { setFormData((prev) => ({ ...prev, mediaType: type, fileUrl: "" })); setFilePreview(""); }}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg border-2 transition text-sm font-medium ${formData.mediaType === type ? "border-green-600 bg-green-50 text-green-800" : "border-slate-200 hover:border-slate-300 text-slate-600"}`}
                >
                  {type === "gallery" ? <ImageIcon size={18} /> : <FileText size={18} />}
                  {type === "gallery" ? "Gallery Image" : "Document / PDF"}
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Title <span className="text-red-500">*</span></label>
            <input
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder={isGallery ? "e.g. Community Tree Planting 2025" : "e.g. Annual Report 2024"}
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none text-sm"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              placeholder="Optional description..."
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none resize-vertical text-sm"
            />
          </div>

          {/* Region */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Region</label>
            <select
              value={formData.region}
              onChange={(e) => setFormData({ ...formData, region: e.target.value as CmsRegion })}
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none text-sm"
            >
              <option value="national">National</option>
              <option value="northern">Northern</option>
              <option value="central">Central</option>
              <option value="southern">Southern</option>
              <option value="eastern">Eastern</option>
            </select>
          </div>

          {/* File Upload */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              {isGallery ? "Image File" : "Document File"} <span className="text-red-500">*</span>
            </label>
            {filePreview && isGallery ? (
              <div className="relative w-full h-52 rounded-lg overflow-hidden border mb-2">
                <Image src={filePreview} alt="Preview" fill className="object-cover" />
                <button type="button" onClick={() => { setFilePreview(""); setFormData((prev) => ({ ...prev, fileUrl: "" })); }} className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600">
                  <X size={14} />
                </button>
              </div>
            ) : formData.fileUrl && !isGallery ? (
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200 mb-2">
                <FileText size={20} className="text-blue-600 flex-shrink-0" />
                {/* <span className="text-sm text-blue-800 truncate">{formData.fileUrl.split("/").pop()}</span> */}
                <button type="button" onClick={() => setFormData((prev) => ({ ...prev, fileUrl: "" }))} className="ml-auto text-red-500 hover:text-red-700"><X size={16} /></button>
              </div>
            ) : (
              <label className="flex items-center justify-center gap-3 w-full h-32 border-2 border-dashed border-slate-300 rounded-lg hover:border-green-400 hover:bg-green-50 cursor-pointer transition">
                {uploading === "file" ? (
                  <><Loader2 size={20} className="animate-spin text-slate-400" /><span className="text-sm text-slate-500">Uploading...</span></>
                ) : (
                  <><Upload size={20} className="text-slate-400" /><span className="text-sm text-slate-500">Upload {isGallery ? "image (JPG, PNG, WebP)" : "document (PDF)"}</span></>
                )}
                <input type="file" accept={isGallery ? "image/*" : "application/pdf"} onChange={handleFileUpload} className="hidden" disabled={uploading !== null} />
              </label>
            )}
          </div>

          {/* Cover Image (for documents) */}
          {!isGallery && (
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Cover Image <span className="text-xs font-normal text-slate-400">(optional thumbnail)</span></label>
              {coverPreview ? (
                <div className="relative w-full h-36 rounded-lg overflow-hidden border mb-2">
                  <Image src={coverPreview} alt="Cover" fill className="object-cover" />
                  <button type="button" onClick={() => { setCoverPreview(""); setFormData((prev) => ({ ...prev, coverImage: "" })); }} className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full">
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <label className="flex items-center gap-3 px-4 py-3 border-2 border-dashed border-slate-300 rounded-lg hover:border-green-400 cursor-pointer transition">
                  {uploading === "cover" ? <><Loader2 size={18} className="animate-spin" /><span className="text-sm text-slate-500">Uploading...</span></> : <><ImageIcon size={18} className="text-slate-400" /><span className="text-sm text-slate-500">Upload cover thumbnail</span></>}
                  <input type="file" accept="image/*" onChange={handleCoverUpload} className="hidden" disabled={uploading !== null} />
                </label>
              )}
            </div>
          )}

          {/* Status */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Publish Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as ContentStatus })}
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none text-sm"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          <div className="flex gap-3 pt-2 border-t border-slate-100">
            <button
              type="submit"
              disabled={loading || uploading !== null}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-green-700 text-white rounded-lg hover:bg-green-800 disabled:bg-slate-300 disabled:cursor-not-allowed font-semibold text-sm transition"
            >
              {loading ? <><Loader2 size={16} className="animate-spin" /> Creating...</> : "Create Media Item"}
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
