"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Upload, X, ArrowLeft, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import UnifiedContentForm, { ContentFormData } from "@/components/cms/UnifiedContentForm";
import { getSessionUserFromRequest } from "@/lib/cms/auth";

type CmsRegion = "national" | "northern" | "central" | "southern" | "eastern";
type AlertState = { message: string; type: "success" | "error" };

export default function ContentCreatePage() {
  const router = useRouter();
  const [initialRegion, setInitialRegion] = useState<CmsRegion>("national");
  const [loadingUser, setLoadingUser] = useState(true);
  const [alert, setAlert] = useState<AlertState | null>(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((u) => {
        if (u?.region) {
          setInitialRegion(u.region as CmsRegion);
        }
      })
      .catch(() => router.replace("/dashboard/login"))
      .finally(() => setLoadingUser(false));
  }, [router]);

  const showAlert = (message: string, type: "success" | "error") => {
    setAlert({ message, type });
    if (type === "success") {
      setTimeout(() => router.push("/dashboard/cms/content/manage"), 1800);
    }
  };

  const handleSubmit = async (data: ContentFormData) => {
    try {
      const res = await fetch("/api/cms/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Create failed");
      showAlert("Content created successfully!", "success");
    } catch (err) {
      showAlert(err instanceof Error ? err.message : "Error creating content", "error");
    }
  };

  if (loadingUser) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 size={32} className="animate-spin text-slate-300" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-800 mb-6 text-sm transition"
        >
          <ArrowLeft size={16} /> Back to Content Management
        </button>

        <h1 className="text-2xl font-bold text-slate-800 mb-2">Create New Content</h1>
        <p className="text-slate-500 text-sm mb-8">Create news, announcements, blogs, press briefings, or videos.</p>

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

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8">
          <UnifiedContentForm 
            regions={["national", "northern", "central", "southern", "eastern"]}
            onSubmit={handleSubmit} 
          />
        </div>
      </div>
    </div>
  );
}
