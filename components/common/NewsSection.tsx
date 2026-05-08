"use client";
import Image from "next/image";
import Link from "next/link";

const news = [
  {
    type: "PRESS RELEASE",
    date: "January 16, 2026",
    title: "Launch of the National Tree Planting Season: Our Call to Action",
    excerpt:
      "YASCON joins the Government in the official launch of the National Tree Planting Season, presided over in Phalombe District by the Second Vice President.",
    image: "/our-work/work1.avif",
    href: "/news/tree-planting-season-2026",
  },
  {
    type: "BLOG",
    date: "February 10, 2026",
    title: "Youth Clubs Across Malawi Embrace Conservation Theatre",
    excerpt:
      "Youth clubs are using theatre and performing arts to share conservation messages in communities across all 28 districts.",
    image: "/our-work/work2.avif",
    href: "/news/youth-clubs-theatre",
  },
  {
    type: "IMPACT STORY",
    date: "January 28, 2026",
    title: "How Chipata Community Forest Was Restored in 6 Months",
    excerpt:
      "A remarkable story of how one youth club turned a degraded hillside into a thriving community forest.",
    image: "/our-work/work3.avif",
    href: "/news/chipata-forest-restoration",
  },
];

const tagStyle: Record<string, { bg: string; color: string }> = {
  "PRESS RELEASE": { bg: "#1a2e1a", color: "white" },
  BLOG:            { bg: "#2d4a2d", color: "white" },
  "IMPACT STORY":  { bg: "#d4a017", color: "#0f1a0f" },
};

export default function NewsSection() {
  return (
    <section className="py-20 md:py-24 bg-gray-50" id="news">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="text-xs md:text-sm font-bold uppercase tracking-[0.2em] text-[#d4a017]">
            Latest Updates
          </span>
          <h2
            className="mt-4 text-3xl sm:text-4xl md:text-5xl font-bold text-[#1a2e1a]"
          >
            YASCON in the News
          </h2>
          <div className="w-12 h-1 bg-[#d4a017] mx-auto mt-6 rounded-full" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {news.map((item, idx) => (
            <Link key={idx} href={item.href} className="group block">
              <div className="bg-white rounded-md overflow-hidden border border-[#ede8d8] shadow-sm transition-all duration-300 group-hover:shadow-md group-hover:scale-[1.02]">
                <div className="relative h-48 sm:h-56 overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent" />
                  <span
                    className="absolute top-4 left-4 text-xs font-bold px-3 py-1 rounded-sm"
                    style={{
                      backgroundColor: tagStyle[item.type]?.bg || "#2d4a2d",
                      color: tagStyle[item.type]?.color || "white",
                    }}
                  >
                    {item.type}
                  </span>
                </div>

                <div className="p-6">
                  <time className="text-xs text-gray-500 block mb-2">{item.date}</time>
                  <h3
                    className="text-lg md:text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-green-700 transition-colors"
                  >
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-600 line-clamp-3 mb-4">{item.excerpt}</p>
                  <span className="text-sm font-medium text-green-600 group-hover:text-green-700 transition-colors">
                    Read more →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-12 md:mt-16">
          <Link
            href="/news"
            className="inline-block border-2 border-green-600 text-green-600 font-semibold px-8 py-4 rounded-md hover:bg-green-700 hover:text-white transition-all duration-300"
          >
            View All News & Stories
          </Link>
        </div>
      </div>
    </section>
  );
}

