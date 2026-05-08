"use client";

import Image from "next/image";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { formatDate } from "@/lib/cms/utils";

interface AnnouncementItem {
  id: number;
  title: string;
  excerpt: string;
  coverImage: string | null;
  publishedAt: string | null;
  slug: string;
}

export default function AnnouncementsDisplay({ region = "national", limit = 5 }: { region?: string; limit?: number }) {
  const { data, isLoading } = useQuery<AnnouncementItem[]>({
    queryKey: ["announcements", region, limit],
    queryFn: async () => {
      const res = await fetch(`/api/cms/announcements?region=${region}&status=published&limit=${limit}`);
      if (!res.ok) throw new Error("fetch failed");
      return res.json();
    },
    staleTime: 5 * 60 * 1000,
  });

  if (isLoading) return <div className="animate-pulse h-32 bg-orange-50 rounded-lg mt-6" />;
  if (!data || data.length === 0) return null;

  return (
    <div className="space-y-4 mt-6">
      {data.map((item) => (
        <div key={item.id} className="flex gap-4 p-4 border border-orange-200 bg-orange-50 rounded-lg hover:shadow-md transition-shadow">
          {item.coverImage && (
            <div className="relative w-24 h-24 flex-shrink-0">
              <Image src={item.coverImage} alt={item.title} fill className="object-cover rounded" sizes="96px" />
            </div>
          )}
          <div className="flex-1">
            {item.publishedAt && (
              <p className="text-xs font-semibold text-orange-600 mb-1">{formatDate(item.publishedAt)}</p>
            )}
            <p className="font-semibold text-[#1a2e1a] line-clamp-2">{item.title}</p>
            <p className="text-sm text-[#2e3d35] mt-2 line-clamp-2">{item.excerpt}</p>
            <Link href={`/news/${item.slug}`} className="text-xs font-semibold text-orange-700 mt-2 block hover:text-orange-800">
              Read more
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
