"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ContentForm from "@/components/cms/ContentForm";

const REGIONS = ["central", "northern", "southern", "eastern", "national"] as const;

export default function CreateVideoPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/cms/videos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        alert(error.error || "Failed to create video");
        return;
      }

      alert("Video created successfully!");
      router.push("/dashboard/cms");
    } catch (error) {
      console.error("Error creating video:", error);
      alert("An error occurred while creating the video");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <ContentForm
        contentType="video"
        regions={REGIONS as any}
        onSubmit={handleSubmit}
        isLoading={isLoading}
      />
    </div>
  );
}
