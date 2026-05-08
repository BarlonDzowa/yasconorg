"use client";

/**
 * WYSIWYG Rich Text Editor
 * Stores content as HTML (not Markdown) so styling is preserved on render.
 * Uses Quill loaded via CDN – no extra npm dependency required.
 * The output is sanitised before storage in the DB and injected with
 * dangerouslySetInnerHTML on the public side (wrapped in a .prose container).
 */

import { useEffect, useRef, useState } from "react";

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  onImageUpload?: (file: File) => Promise<string>;
}

declare global {
  interface Window {
    Quill: typeof import("quill").default;
  }
}

// ── Quill CDN URLs (Cloudflare, CSP-safe) ──────────────────────────────────
const QUILL_CSS = "https://cdnjs.cloudflare.com/ajax/libs/quill/1.3.7/quill.snow.min.css";
const QUILL_JS  = "https://cdnjs.cloudflare.com/ajax/libs/quill/1.3.7/quill.min.js";

function loadQuill(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.Quill) { resolve(); return; }

    // CSS
    if (!document.querySelector(`link[href="${QUILL_CSS}"]`)) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = QUILL_CSS;
      document.head.appendChild(link);
    }

    // JS
    if (!document.querySelector(`script[src="${QUILL_JS}"]`)) {
      const script = document.createElement("script");
      script.src = QUILL_JS;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error("Failed to load Quill"));
      document.head.appendChild(script);
    } else {
      // Script tag already exists but may still be loading
      const check = setInterval(() => {
        if (window.Quill) { clearInterval(check); resolve(); }
      }, 50);
    }
  });
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder = "Write your content here...",
  onImageUpload,
}: RichTextEditorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const quillRef    = useRef<InstanceType<typeof window.Quill> | null>(null);
  const valueRef    = useRef(value);
  const [ready, setReady]       = useState(false);
  const [uploading, setUploading] = useState(false);

  // Keep ref in sync so the text-change handler doesn't stale-close over value
  valueRef.current = value;

  useEffect(() => {
    let cancelled = false;

    loadQuill().then(() => {
      if (cancelled || !containerRef.current || quillRef.current) return;

      const toolbarOptions = [
        [{ header: [1, 2, 3, false] }],
        ["bold", "italic", "underline", "strike"],
        [{ color: [] }, { background: [] }],
        [{ list: "ordered" }, { list: "bullet" }],
        [{ indent: "-1" }, { indent: "+1" }],
        [{ align: [] }],
        ["blockquote", "code-block"],
        ["link", "image"],
        ["clean"],
      ];

      const quill = new window.Quill(containerRef.current, {
        theme: "snow",
        placeholder,
        modules: {
          toolbar: {
            container: toolbarOptions,
            handlers: {
              image: onImageUpload
                ? () => {
                    const input = document.createElement("input");
                    input.type = "file";
                    input.accept = "image/*";
                    input.onchange = async () => {
                      const file = input.files?.[0];
                      if (!file) return;
                      setUploading(true);
                      try {
                        const url = await onImageUpload(file);
                        const range = quill.getSelection(true);
                        quill.insertEmbed(range.index, "image", url);
                        quill.setSelection(range.index + 1, 0);
                      } catch {
                        alert("Image upload failed");
                      } finally {
                        setUploading(false);
                      }
                    };
                    input.click();
                  }
                : undefined,
            },
          },
        },
      });

      // Hydrate existing HTML value
      if (valueRef.current) {
        quill.root.innerHTML = valueRef.current;
      }

      quill.on("text-change", () => {
        const html = quill.root.innerHTML;
        // Emit empty string for truly empty editor (quill leaves <p><br></p>)
        onChange(html === "<p><br></p>" ? "" : html);
      });

      quillRef.current = quill;
      setReady(true);
    });

    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync external value changes (e.g. form reset) back into editor
  useEffect(() => {
    if (!quillRef.current) return;
    const currentHtml = quillRef.current.root.innerHTML;
    const incoming = value || "";
    if (currentHtml !== incoming) {
      quillRef.current.root.innerHTML = incoming;
    }
  }, [value]);

  return (
    <div className="border border-slate-300 rounded-lg overflow-hidden">
      {/* Uploading overlay */}
      {uploading && (
        <div className="absolute inset-0 bg-white/70 flex items-center justify-center z-10 rounded-lg text-sm font-semibold text-slate-600">
          Uploading image…
        </div>
      )}

      {/* Loading state before Quill is ready */}
      {!ready && (
        <div className="p-4 text-sm text-slate-400 bg-slate-50 min-h-[300px] flex items-center justify-center">
          Loading editor…
        </div>
      )}

      {/* Quill mounts here */}
      <div
        ref={containerRef}
        style={{
          minHeight: "320px",
          display: ready ? "block" : "none",
        }}
      />

      <div className="bg-slate-50 px-4 py-2 border-t border-slate-200 text-xs text-slate-500">
        Content is saved as <strong>HTML</strong> — formatting will be preserved on the public site.
      </div>
    </div>
  );
}
