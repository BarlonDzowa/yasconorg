"use client";

import Image from "next/image";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { formatDate } from "@/lib/cms/utils";

interface NewsItem {
  id: number;
  title: string;
  excerpt: string;
  coverImage: string | null;
  publishedAt: string | null;
  slug: string;
  region: string;
  createdBy: { name: string };
}

// Fallback hardcoded news for when CMS is empty
const FALLBACK: NewsItem[] = [
  {
    id: -1,
    title: "Launch of the National Tree Planting Season",
    excerpt: "YASCON joined national stakeholders in launching the 2026 tree planting season, mobilizing youth clubs across Malawi to restore degraded landscapes.",
    coverImage: "/our-work/work1.avif",
    publishedAt: "2026-01-16",
    slug: "tree-planting-season-2026",
    region: "national",
    createdBy: { name: "YASCON Communications" },
  },
  {
    id: -2,
    title: "YASCON Attends Social Enterprise Training",
    excerpt: "YASCON attended a two-day Social Enterprise Training at Crossroads Hotel in Blantyre, organized by CONGOMA and NGORA.",
    coverImage: "/our-work/work4.jpg",
    publishedAt: "2026-03-11",
    slug: "social-enterprise-training",
    region: "southern",
    createdBy: { name: "National Office Team" },
  },
  {
    id: -3,
    title: "Youth Clubs Across Malawi Embrace Conservation Theatre",
    excerpt: "Through drama and creative arts, youth clubs are communicating urgent environmental messages in local communities.",
    coverImage: "/our-work/work5.jpg",
    publishedAt: "2026-02-10",
    slug: "youth-clubs-theatre",
    region: "national",
    createdBy: { name: "Field Programs Team" },
  },
];

export default function NewsDisplay({ region = "national", limit = 3 }: { region?: string; limit?: number }) {
  const { data, isLoading } = useQuery<NewsItem[]>({
    queryKey: ["news", region, limit],
    queryFn: async () => {
      const res = await fetch(`/api/cms/news?region=${region}&status=published&limit=${limit}`);
      if (!res.ok) throw new Error("fetch failed");
      return res.json();
    },
    staleTime: 5 * 60 * 1000,
  });

  const news = data && data.length > 0 ? data : isLoading ? [] : FALLBACK.slice(0, limit);

  if (isLoading) {
    return (
      <div className="grid md:grid-cols-3 gap-6 mt-6 px-8">
        {Array.from({ length: limit }).map((_, i) => (
          <div key={i} className="animate-pulse border border-gray-200 rounded-xl bg-white overflow-hidden h-64" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-3 gap-6 mt-6 px-8">
      {news.map((item) => (
        <article key={item.id} className="border border-gray-200 rounded-xl bg-white overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
          {item.coverImage && (
            <div className="relative w-full h-40">
              <Image src={item.coverImage} alt={item.title} fill className="object-cover" sizes="(max-width:768px) 100vw, 33vw" />
            </div>
          )}
          <div className="p-5">
            <p className="max-w-max text-xs font-semibold text-white uppercase bg-green-950 px-2 py-1 rounded-sm">
              News
            </p>
            <p className="font-semibold text-[#1a2e1a] mt-2 line-clamp-2">{item.title}</p>
            <p className="text-sm text-[#2e3d35] mt-2 line-clamp-3">{item.excerpt}</p>
            <p className="font-semibold text-gray-400 mt-2 text-sm capitalize">YASCON-{item.region}</p>
            {item.publishedAt && (
              <p className="text-xs text-gray-400 mt-1">{formatDate(item.publishedAt)}</p>
            )}
            <Link href={`/news/${item.slug}`} className="text-sm font-semibold text-green-700 mt-3 block hover:text-green-800">
              Read more
            </Link>
          </div>
        </article>
      ))}
    </div>
  );
}
