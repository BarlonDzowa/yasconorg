"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Loader2, CheckCircle, AlertCircle, X } from "lucide-react";
import UnifiedContentForm, { ContentFormData } from "@/components/cms/UnifiedContentForm";
import type { CmsContentType, ContentRegion, ContentStatus } from "@/lib/cms/service";

type AlertState = { message: string; type: "success" | "error" };

interface ContentData {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  richContent: string;
  contentType: CmsContentType;
  region: ContentRegion;
  status: ContentStatus;
  coverImage: string | null;
  videoUrl: string | null;
}

export default function ContentEditPage() {
  const router = useRouter();
  const params = useParams();
 const id = params.id as string;

  const [data, setData] = useState<ContentData | null>(null);
  const [loadingData, setLoadingData] = useState(true);
  const [saving, setSaving] = useState(false);
  const [alert, setAlert] = useState<AlertState | null>(null);

  const showAlert = (message: string, type: "success" | "error") => {
    setAlert({ message, type });
    if (type === "success") {
      setTimeout(() => router.push("/dashboard/cms/content/manage"), 1500);
    }
  };

  useEffect(() => {
    if (!id) return;
    fetch(`/api/cms/content/${id}`)
      .then((r) => {
        if (!r.ok) throw new Error("Content not found");
        return r.json();
      })
      .then((item: ContentData) => setData(item))
      .catch(() => showAlert("Failed to load content", "error"))
      .finally(() => setLoadingData(false));
  }, [id]);

  const handleSubmit = async (formData: ContentFormData) => {
    setSaving(true);
    try {
      const res = await fetch(`/api/cms/content/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Update failed");
      showAlert("Content updated successfully!", "success");
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

  if (!data) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle size={48} className="mx-auto text-red-400 mb-4" />
          <h2 className="text-xl font-bold text-slate-800 mb-2">Content Not Found</h2>
          <button onClick={() => router.push("/dashboard/cms/content/manage")} className="text-blue-600 hover:underline">
            Go to Manage Content
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-4xl mx-auto">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-slate-500 hover:text-slate-800 mb-6 text-sm">
          <ArrowLeft size={16} /> Back to Manage
        </button>

        <div className="flex items-center gap-3 mb-8">
          <h1 className="text-2xl font-bold text-slate-800">Edit Content</h1>
          <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded font-semibold uppercase">
            {data.contentType}
          </span>
          <span className={`px-2 py-0.5 text-xs rounded font-semibold capitalize ${data.status === "published" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
            {data.status}
          </span>
        </div>

        {alert && (
          <div className={`mb-6 p-4 rounded-lg flex items-start gap-3 ${
            alert.type === "success"
              ? "bg-emerald-50 border border-emerald-200 text-emerald-800"
              : "bg-red-50 border border-red-200 text-red-800"
          }`}>
            {alert.type === "success" ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
            <span className="text-sm font-medium">{alert.message}</span>
            <button onClick={() => setAlert(null)} className="ml-auto"><X size={16} /></button>
          </div>
        )}

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8">
          <UnifiedContentForm
            regions={["national", "northern", "central", "southern", "eastern"]}
            onSubmit={handleSubmit}
            isLoading={saving}
            mode="edit"
            initialData={{
              id: data.id,
              contentType: data.contentType,
              title: data.title,
              excerpt: data.excerpt,
              richContent: data.richContent || "",
              region: data.region,
              status: data.status,
              coverImage: data.coverImage || "",
              videoUrl: data.videoUrl || "",
            }}
          />
        </div>
      </div>
    </div>
  );
}
