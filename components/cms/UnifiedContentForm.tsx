"use client";

import { useState, useEffect } from "react";
import RichTextEditor from "./RichTextEditor";
import { generateSlug } from "@/lib/cms/utils";
import Image from "next/image";
import { Upload } from "lucide-react";

interface UnifiedContentFormProps {
  onSubmit: (data: ContentFormData) => Promise<void>;
  isLoading?: boolean;
  initialData?: Partial<ContentFormData> & { id?: number; contentType?: string };
  regions: string[];
  mode?: "create" | "edit";
}

export interface ContentFormData {
  id?: number;
  contentType: string;
  title: string;
  excerpt: string;
  richContent: string;
  region: string;
  status: string;
  coverImage: string;
  videoUrl: string;
  publishedAt: string;
}

const CONTENT_TYPES = [
  { value: "news", label: "News" },
  { value: "announcement", label: "Announcement" },
  { value: "press_briefing", label: "Press Briefing" },
  { value: "blog", label: "Blog" },
  { value: "video", label: "Video" },
];

export default function UnifiedContentForm({
  onSubmit,
  isLoading = false,
  initialData,
  regions,
  mode = "create",
}: UnifiedContentFormProps) {
  const [contentType, setContentType] = useState(initialData?.contentType || "news");
  const [formData, setFormData] = useState<ContentFormData>({
    id: initialData?.id,
    contentType: initialData?.contentType || "news",
    title: initialData?.title || "",
    excerpt: initialData?.excerpt || "",
    richContent: initialData?.richContent || "",
    region: initialData?.region || regions[0] || "national",
    status: initialData?.status || "draft",
    coverImage: initialData?.coverImage || "",
    videoUrl: initialData?.videoUrl || "",
    publishedAt: initialData?.publishedAt
      ? initialData.publishedAt.slice(0, 16) // format for datetime-local input
      : "",
  });

  const [coverPreview, setCoverPreview] = useState<string | null>(initialData?.coverImage || null);
  const [uploading, setUploading] = useState(false);

  // Re-hydrate when initialData changes (e.g. when user clicks Edit on a different item)
  useEffect(() => {
    if (!initialData) return;
    const ct = initialData.contentType || "news";
    setContentType(ct);
    setFormData({
      id: initialData.id,
      contentType: ct,
      title: initialData.title || "",
      excerpt: initialData.excerpt || "",
      richContent: initialData.richContent || "",
      region: initialData.region || regions[0] || "national",
      status: initialData.status || "draft",
      coverImage: initialData.coverImage || "",
      videoUrl: initialData.videoUrl || "",
      publishedAt: initialData.publishedAt
        ? initialData.publishedAt.slice(0, 16)
        : "",
    });
    setCoverPreview(initialData.coverImage || null);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialData?.id]);

  const set = (key: keyof ContentFormData, val: string) =>
    setFormData((prev) => ({ ...prev, [key]: val }));

  const handleImageUpload = async (file: File): Promise<string> => {
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/upload/image", { method: "POST", body: fd });
    if (!res.ok) throw new Error("Upload failed");
    const data = await res.json();
    return data.url;
  };

  const handleCoverChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await handleImageUpload(file);
      set("coverImage", url);
      setCoverPreview(url);
    } catch { alert("Cover image upload failed"); }
    finally { setUploading(false); }
  };

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload/video", { method: "POST", body: fd });
      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      set("videoUrl", data.url);
    } catch { alert("Video upload failed"); }
    finally { setUploading(false); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.excerpt || !formData.richContent)
      return alert("Please fill in title, excerpt, and content");
    if (contentType === "video" && !formData.videoUrl)
      return alert("Please upload a video");
    await onSubmit({ ...formData, contentType });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Content Type *</label>
          <select
            value={contentType}
            onChange={(e) => { setContentType(e.target.value); set("contentType", e.target.value); }}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            disabled={mode === "edit"}
          >
            {CONTENT_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Region *</label>
          <select
            value={formData.region}
            onChange={(e) => set("region", e.target.value)}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            {regions.map((r) => <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Status</label>
          <select
            value={formData.status}
            onChange={(e) => set("status", e.target.value)}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
        </div>

        {/* ── MANUAL PUBLISH DATE ── */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Published Date
            <span className="ml-1 text-xs font-normal text-slate-400">(leave blank to auto-set on publish)</span>
          </label>
          <input
            type="datetime-local"
            value={formData.publishedAt}
            onChange={(e) => set("publishedAt", e.target.value)}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-slate-700"
          />
          {formData.publishedAt && (
            <button
              type="button"
              onClick={() => set("publishedAt", "")}
              className="text-xs text-red-500 hover:text-red-700 mt-1 underline"
            >
              Clear date
            </button>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">Title *</label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => set("title", e.target.value)}
          placeholder="Enter content title"
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          required
        />
        {formData.title && (
          <p className="text-xs text-slate-500 mt-1">Slug: {generateSlug(formData.title)}</p>
        )}
      </div>

      {/* Cover Image */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">Cover Image</label>
        <div className="flex flex-col gap-3">
          {coverPreview && (
            <div className="relative w-full h-40 rounded-lg overflow-hidden">
              <Image src={coverPreview} alt="Cover" fill className="object-cover" />
              <button type="button" onClick={() => { setCoverPreview(null); set("coverImage", ""); }}
                className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded hover:bg-red-700">
                Remove
              </button>
            </div>
          )}
          <label className="flex items-center gap-3 px-4 py-3 border-2 border-dashed border-slate-300 rounded-lg hover:border-blue-400 cursor-pointer transition-colors">
            <Upload size={18} className="text-slate-400" />
            <input type="file" accept="image/*" onChange={handleCoverChange} disabled={uploading} className="hidden" />
            <span className="text-sm text-slate-600">{uploading ? "Uploading…" : "Click to upload cover image"}</span>
          </label>
        </div>
      </div>

      {/* Excerpt */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">
          Excerpt * <span className="text-xs font-normal text-slate-500">(max 300 chars)</span>
        </label>
        <textarea
          value={formData.excerpt}
          onChange={(e) => set("excerpt", e.target.value)}
          placeholder="Brief summary"
          maxLength={300}
          rows={3}
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          required
        />
        <p className="text-xs text-slate-500 mt-1">{formData.excerpt.length}/300</p>
      </div>

      {/* Rich Content — stored as HTML */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">
          Content * <span className="text-xs font-normal text-slate-500">(WYSIWYG — saved as HTML)</span>
        </label>
        <RichTextEditor
          value={formData.richContent}
          onChange={(html) => set("richContent", html)}
          onImageUpload={handleImageUpload}
          placeholder="Write your content here…"
        />
      </div>

      {/* Video upload */}
      {contentType === "video" && (
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Video *</label>
          {formData.videoUrl ? (
            <div className="flex items-center gap-4 p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
              <span className="text-emerald-700 font-semibold text-sm">✓ Video uploaded</span>
              <button type="button" onClick={() => set("videoUrl", "")}
                className="px-3 py-1 text-xs text-red-600 border border-red-300 rounded hover:bg-red-50">
                Remove
              </button>
            </div>
          ) : (
            <label className="flex items-center gap-3 px-4 py-3 border-2 border-dashed border-slate-300 rounded-lg hover:border-blue-400 cursor-pointer transition-colors">
              <Upload size={18} className="text-slate-400" />
              <input type="file" accept="video/*" onChange={handleVideoUpload} disabled={uploading} className="hidden" />
              <span className="text-sm text-slate-600">{uploading ? "Uploading video…" : "Click to upload video"}</span>
            </label>
          )}
        </div>
      )}

      <div className="flex gap-4 pt-4 border-t border-slate-200">
        <button
          type="submit"
          disabled={isLoading || uploading}
          className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-slate-400 font-semibold transition-colors"
        >
          {isLoading ? "Saving…" : mode === "edit" ? "Update Content" : "Create Content"}
        </button>
        <button
          type="reset"
          onClick={() => {
            setFormData({
              id: undefined,
              contentType: "news",
              title: "",
              excerpt: "",
              richContent: "",
              region: regions[0],
              status: "draft",
              coverImage: "",
              videoUrl: "",
              publishedAt: "",
            });
            setCoverPreview(null);
          }}
          className="px-6 py-2.5 border border-slate-300 rounded-lg hover:bg-slate-50 font-semibold text-slate-700"
        >
          Reset
        </button>
      </div>
    </form>
  );
}