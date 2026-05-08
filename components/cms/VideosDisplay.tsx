"use client";

import { useRef, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { formatDate } from "@/lib/cms/utils";

interface VideoItem {
  id: number;
  title: string;
  excerpt: string;
  coverImage: string | null;
  videoUrl: string;
  publishedAt: string | null;
  slug: string;
}

function LazyVideo({ src, poster }: { src: string; poster?: string | null }) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect(); } },
      { rootMargin: "200px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref} className="relative pt-[56.25%] bg-gray-900 rounded-t-xl overflow-hidden">
      {inView ? (
        <video controls className="absolute inset-0 w-full h-full" poster={poster || undefined} preload="none">
          <source src={src} type="video/mp4" />
        </video>
      ) : (
        poster ? (
          <Image src={poster} alt="" fill className="object-cover opacity-60" sizes="(max-width:768px) 100vw, 33vw" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-white/30 text-xs">Loading…</div>
        )
      )}
    </div>
  );
}

export default function VideosDisplay({ region = "national", limit = 3 }: { region?: string; limit?: number }) {
  const { data, isLoading } = useQuery<VideoItem[]>({
    queryKey: ["videos", region, limit],
    queryFn: async () => {
      const res = await fetch(`/api/cms/videos?region=${region}&status=published&limit=${limit}`);
      if (!res.ok) throw new Error("fetch failed");
      return res.json();
    },
    staleTime: 5 * 60 * 1000,
  });

  if (isLoading) return (
    <div className="grid md:grid-cols-3 gap-6 mt-4 mb-4 px-6">
      {Array.from({ length: limit }).map((_, i) => (
        <div key={i} className="animate-pulse border border-gray-200 rounded-xl bg-white h-64" />
      ))}
    </div>
  );

  if (!data || data.length === 0) return null;

  return (
    <div className="grid md:grid-cols-3 gap-6 mt-4 mb-4 px-6">
      {data.map((video) => (
        <div key={video.id} className="flex flex-col border border-gray-200 rounded-xl bg-white overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
          <LazyVideo src={video.videoUrl} poster={video.coverImage} />
          <div className="p-5">
            {video.publishedAt && (
              <p className="text-xs font-semibold text-green-700">{formatDate(video.publishedAt)}</p>
            )}
            <p className="font-semibold text-[#1a2e1a] mt-2 line-clamp-2">{video.title}</p>
            <p className="text-sm text-[#2e3d35] mt-2 line-clamp-3">{video.excerpt}</p>
            <Link href={`/news/${video.slug}`} className="text-sm font-semibold text-green-700 mt-3 block hover:text-green-800">
              Watch full video
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
