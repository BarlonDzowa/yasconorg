"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import RichTextEditor from "./RichTextEditor";
import { generateSlug } from "@/lib/cms/utils";

interface ContentFormProps {
  contentType:
    | "announcement"
    | "news"
    | "press_briefing"
    | "video"
    | "blog";
  regions: string[];
  onSubmit: (data: any) => Promise<void>;
  initialData?: any;
  isLoading?: boolean;
}

export default function ContentForm({
  contentType,
  regions,
  onSubmit,
  initialData,
  isLoading = false,
}: ContentFormProps) {
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    excerpt: initialData?.excerpt || "",
    richContent: initialData?.richContent || "",
    region: initialData?.region || regions[0],
    status: initialData?.status || "draft",
    coverImage: initialData?.coverImage || "",
    videoUrl: initialData?.videoUrl || "",
  });

  const [coverPreview, setCoverPreview] = useState<string | null>(
    initialData?.coverImage || null
  );
  const [uploading, setUploading] = useState(false);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setFormData({
      ...formData,
      title,
    });
  };

  const handleImageUpload = async (file: File): Promise<string> => {
    const formDataObj = new FormData();
    formDataObj.append("file", file);

    const response = await fetch("/api/upload/image", {
      method: "POST",
      body: formDataObj,
    });

    if (!response.ok) {
      throw new Error("Failed to upload image");
    }

    const data = await response.json();
    return data.url;
  };

  const handleCoverImageChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        setUploading(true);
        const imageUrl = await handleImageUpload(file);
        setFormData({
          ...formData,
          coverImage: imageUrl,
        });
        setCoverPreview(imageUrl);
      } catch (error) {
        console.error("Cover image upload failed:", error);
        alert("Failed to upload cover image");
      } finally {
        setUploading(false);
      }
    }
  };

  const handleVideoUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        setUploading(true);
        const formDataObj = new FormData();
        formDataObj.append("file", file);

        const response = await fetch("/api/upload/video", {
          method: "POST",
          body: formDataObj,
        });

        if (!response.ok) {
          throw new Error("Failed to upload video");
        }

        const data = await response.json();
        setFormData({
          ...formData,
          videoUrl: data.url,
        });
      } catch (error) {
        console.error("Video upload failed:", error);
        alert("Failed to upload video");
      } finally {
        setUploading(false);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.title || !formData.excerpt || !formData.richContent) {
      alert("Please fill in all required fields");
      return;
    }

    if (contentType === "video" && !formData.videoUrl) {
      alert("Please upload a video");
      return;
    }

    await onSubmit(formData);
  };

  const getContentTypeLabel = () => {
    const labels: Record<string, string> = {
      announcement: "Announcement",
      news: "News",
      press_briefing: "Press Briefing",
      video: "Video",
      blog: "Blog",
    };
    return labels[contentType];
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-6">
          {initialData
            ? `Edit ${getContentTypeLabel()}`
            : `Create New ${getContentTypeLabel()}`}
        </h2>
      </div>

      {/* Title */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Title *
        </label>
        <input
          type="text"
          value={formData.title}
          onChange={handleTitleChange}
          placeholder="Enter content title"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          required
        />
        {formData.title && (
          <p className="text-xs text-gray-500 mt-1">
            Slug: {generateSlug(formData.title)}
          </p>
        )}
      </div>

      {/* Region */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Region *
        </label>
        <select
          value={formData.region}
          onChange={(e) =>
            setFormData({ ...formData, region: e.target.value })
          }
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          required
        >
          {regions.map((region) => (
            <option key={region} value={region}>
              {region.charAt(0).toUpperCase() + region.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* Status */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Status
        </label>
        <select
          value={formData.status}
          onChange={(e) =>
            setFormData({ ...formData, status: e.target.value })
          }
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
        >
          <option value="draft">Draft</option>
          <option value="published">Published</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      {/* Cover Image */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Cover Image
        </label>
        <div className="flex flex-col gap-4">
          {coverPreview && (
            <div className="relative w-full h-64">
              <Image
                src={coverPreview}
                alt="Cover preview"
                fill
                className="object-cover rounded-lg"
              />
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleCoverImageChange}
            disabled={uploading}
            className="px-4 py-2 border border-gray-300 rounded-lg"
          />
        </div>
      </div>

      {/* Excerpt */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Excerpt *
        </label>
        <textarea
          value={formData.excerpt}
          onChange={(e) =>
            setFormData({ ...formData, excerpt: e.target.value })
          }
          placeholder="Brief summary of the content (max 200 characters)"
          maxLength={200}
          rows={3}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          required
        />
        <p className="text-xs text-gray-500 mt-1">
          {formData.excerpt.length}/200 characters
        </p>
      </div>

      {/* Rich Content */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Content *
        </label>
        <RichTextEditor
          value={formData.richContent}
          onChange={(content) =>
            setFormData({ ...formData, richContent: content })
          }
          onImageUpload={handleImageUpload}
          placeholder="Write your detailed content here..."
        />
      </div>

      {/* Video Upload (for video content type) */}
      {contentType === "video" && (
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Video Upload *
          </label>
          {formData.videoUrl ? (
            <div className="flex items-center gap-4">
              <div className="px-4 py-2 bg-green-50 text-green-700 rounded-lg">
                ✓ Video uploaded
              </div>
              <button
                type="button"
                onClick={() =>
                  setFormData({ ...formData, videoUrl: "" })
                }
                className="px-4 py-2 text-sm text-red-600 hover:text-red-700"
              >
                Remove
              </button>
            </div>
          ) : (
            <input
              type="file"
              accept="video/*"
              onChange={handleVideoUpload}
              disabled={uploading}
              className="px-4 py-2 border border-gray-300 rounded-lg"
              required
            />
          )}
        </div>
      )}

      {/* Submit Button */}
      <div className="flex gap-4">
        <button
          type="submit"
          disabled={isLoading || uploading}
          className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400"
        >
          {isLoading
            ? "Saving..."
            : initialData
              ? "Update"
              : "Create"}
        </button>
        <button
          type="button"
          className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
