"use client";

import Image from "next/image";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { formatDate } from "@/lib/cms/utils";

interface BlogItem {
  id: number;
  title: string;
  excerpt: string;
  coverImage: string | null;
  publishedAt: string | null;
  slug: string;
}

const FALLBACK: BlogItem[] = [
  { id: -1, title: "Conservation Best Practices for Youth Clubs", excerpt: "Tips and field methods for youth clubs running conservation programs in Malawi's diverse ecosystems.", coverImage: "/blog/blog-1.svg", publishedAt: "2026-01-10", slug: "conservation-best-practices" },
  { id: -2, title: "How to Start an Eco-Club at Your School", excerpt: "A practical guide to mobilising students around environmental action and connecting to YASCON's national network.", coverImage: "/blog/blog-2.svg", publishedAt: "2026-02-05", slug: "start-eco-club" },
  { id: -3, title: "Understanding Malawi's Forest Degradation Crisis", excerpt: "A look at the causes, consequences, and youth-led solutions to deforestation in Malawi's major ecosystems.", coverImage: "/blog/blog-3.svg", publishedAt: "2026-03-01", slug: "forest-degradation-crisis" },
];

export default function BlogsDisplay({ region = "national", limit = 3 }: { region?: string; limit?: number }) {
  const { data, isLoading } = useQuery<BlogItem[]>({
    queryKey: ["blogs", region, limit],
    queryFn: async () => {
      const res = await fetch(`/api/cms/blogs?region=${region}&status=published&limit=${limit}`);
      if (!res.ok) throw new Error("fetch failed");
      return res.json();
    },
    staleTime: 5 * 60 * 1000,
  });

  const posts = data && data.length > 0 ? data : isLoading ? [] : FALLBACK.slice(0, limit);

  if (isLoading) {
    return (
      <div className="grid md:grid-cols-3 gap-6 mt-6">
        {Array.from({ length: limit }).map((_, i) => (
          <div key={i} className="animate-pulse border border-gray-200 rounded-xl bg-white h-64" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-3 gap-6 mt-6">
      {posts.map((post) => (
        <article key={post.id} className="border border-gray-200 rounded-xl bg-white overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
          {post.coverImage && (
            <div className="relative w-full h-40">
              <Image src={post.coverImage} alt={post.title} fill className="object-cover" sizes="(max-width:768px) 100vw, 33vw" />
            </div>
          )}
          <div className="p-5">
            {post.publishedAt && (
              <p className="text-xs font-semibold text-green-700">{formatDate(post.publishedAt)}</p>
            )}
            <p className="font-semibold text-[#1a2e1a] mt-2 line-clamp-2">{post.title}</p>
            <p className="text-sm text-[#2e3d35] mt-2 line-clamp-3">{post.excerpt}</p>
            <Link href={`/news/${post.slug}`} className="text-sm font-semibold text-green-700 mt-3 block hover:text-green-800">
              Read more
            </Link>
          </div>
        </article>
      ))}
    </div>
  );
}
