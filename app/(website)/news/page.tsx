import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { getUnifiedNewsItems, getTagFromType, NewsItem } from "@/lib/cms/service";
import { initCms } from "@/lib/cms/init";
import { title } from "process";

export const dynamic = 'force-dynamic';

type ClientNewsItem = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  tag: "Press Release" | "Blog" | "News";
  image: string;
  author: string;
  region: string;
};

async function getNewsData(searchParams: { type?: string; region?: string } = {}) {
  await initCms();
  
  const opts: any = { 
    status: 'published' as const, 
    limit: 20,
    region: searchParams.region === 'all' ? undefined : searchParams.region,
  };
  
  // Filter by type if specified (maps to our CMS types)
  if (searchParams.type === 'news') {
    opts.contentType = 'news';
  } else if (searchParams.type === 'blog') {
    opts.contentType = 'blog';
  } else if (searchParams.type === 'press') {
    opts.contentType = 'press_briefing';
  }
  
  const allItems = await getUnifiedNewsItems(opts);
  
  return allItems.map((item: NewsItem) => ({
    slug: item.slug,
    title: item.title,
    excerpt: item.excerpt,
    date: item.publishedAt ? new Date(item.publishedAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }) : '',
    tag: getTagFromType(item.type),
    image: item.coverImage || '/our-work/work1.avif',
    author: item.createdBy.name,
    region: item.region,
  })) as ClientNewsItem[];
}

function Tag({ value }: { value: ClientNewsItem["tag"] }) {
  const styles: Record<ClientNewsItem["tag"], string> = {
    "Press Release": "bg-[#1a2e1a] text-white",
    Blog: "bg-[#2d4a2d] text-white",
    News: "bg-[#1a5a1a] text-white",
  };

  return (
    <span className={`inline-flex items-center px-3 py-1 text-xs font-bold uppercase tracking-wide rounded-sm ${styles[value]}`}>
      {value}
    </span>
  );
}

interface NewsPageProps {
  searchParams: {
    type?: string;
    region?: string;
  };
}

function NewsList({ items, className = "" }: { items: ClientNewsItem[]; className?: string }) {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
      {items.map((story) => (
        <article
          key={story.slug}
          className="bg-white border border-[#ede8d8] rounded-md overflow-hidden shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="relative h-52">
            <Image src={story.image} alt={story.title} fill className="object-cover" />
          </div>
          <div className="p-5">
            <Tag value={story.tag} />
            <h3 className="mt-3 text-xl font-bold text-[#1a2e1a] leading-snug line-clamp-2">{story.title}</h3>
            <p className="mt-3 text-sm text-[#4a5a4a] leading-relaxed line-clamp-3">{story.excerpt}</p>
            <div className="mt-4 text-xs text-[#6a7a6a] flex flex-wrap gap-2 items-center">
              <span>{story.date}</span>
              <span>•</span>
              <span>{story.author}</span>
              {story.region && (
                <>
                  <span>•</span>
                  <span className="capitalize">{story.region}</span>
                </>
              )}
            </div>
            <Link href={`/news/${story.slug}`} className="inline-block mt-4 text-green-700 font-semibold text-sm hover:text-green-800">
              Continue reading →
            </Link>
          </div>
        </article>
      ))}
    </div>
  );
}

export default async function NewsroomPage({ searchParams }: NewsPageProps) {
  const resolvedParams = await searchParams;
  const rawItems = await getNewsData(resolvedParams);
  
  const featured = rawItems[0];
  const stories = rawItems.slice(1, 9);
  
  // Dynamic categories based on data
  const categories = [
    { label: "All Stories", count: rawItems.length, href: "?type=all&region=all", active: !resolvedParams.type && !resolvedParams.region },
    { label: "News", count: rawItems.filter(i => i.tag === 'News').length, href: "?type=news", active: resolvedParams.type === 'news' },
    { label: "Blogs", count: rawItems.filter(i => i.tag === 'Blog').length, href: "?type=blog", active: resolvedParams.type === 'blog' },
    { label: "Press Releases", count: rawItems.filter(i => i.tag === 'Press Release').length, href: "?type=press", active: resolvedParams.type === 'press' },
  ];

  const regions = [
    { label: "National", value: "national", count: rawItems.filter(i => i.region === 'national').length },
    { label: "Northern", value: "northern", count: rawItems.filter(i => i.region === 'northern').length },
    { label: "Central", value: "central", count: rawItems.filter(i => i.region === 'central').length },
    { label: "Southern", value: "southern", count: rawItems.filter(i => i.region === 'southern').length },
    { label: "Eastern", value: "eastern", count: rawItems.filter(i => i.region === 'eastern').length },
  ];

  return (
    <main className="bg-[#f7f3ea] min-h-screen pt-0.5">
      <section className="bg-[#1a2e1a] text-white">
        <div className="max-w-7xl mx-auto px-6 py-16 md:py-20">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#d4a017]">Newsroom</p>
          <h1 className="text-4xl md:text-5xl font-bold mt-4 max-w-3xl leading-tight">
            Stories, Press Releases, and Youth Conservation Updates
          </h1>
          <p className="mt-5 text-white/80 max-w-2xl text-base">
            Follow YASCON&apos;s latest activities across Malawi, from policy announcements to grassroots impact stories.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-8">
            {featured && (
              <div className="bg-white border border-[#ede8d8] rounded-md overflow-hidden shadow-sm">
                <div className="relative h-64 md:h-80">
                  <Image src={featured.image} alt={featured.title} fill className="object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent" />
                </div>
                <div className="p-6 md:p-8">
                  <Tag value={featured.tag} />
                  <h2 className="mt-4 text-2xl md:text-3xl font-bold text-[#1a2e1a] leading-tight">
                    {featured.title}
                  </h2>
                  <p className="mt-4 text-[#4a5a4a] leading-relaxed">{featured.excerpt}</p>
                  <div className="mt-5 text-sm text-[#6a7a6a]">
                    <span>{featured.date}</span>
                    <span className="mx-2">|</span>
                    <span>{featured.author}</span>
                  </div>
                  <Link
                    href={`/news/${featured.slug}`}
                    className="inline-block mt-6 bg-green-600 text-white font-semibold px-6 py-3 rounded-sm hover:bg-green-700 transition-colors"
                  >
                    Read full story
                  </Link>
                </div>
              </div>
            )}
          </div>

          <aside className="lg:col-span-4 space-y-6">
            {/* Category filter */}
            <div className="bg-white border border-[#ede8d8] rounded-md p-6">
              <h3 className="text-lg font-bold text-[#1a2e1a] mb-4">Filter by Category</h3>
              <ul className="space-y-2">
                {categories.map((cat) => (
                  <li key={cat.label}>
                    <Link 
                      href={cat.href}
                      className={`block p-2 rounded-sm text-sm flex items-center justify-between w-full hover:bg-[#f7f3ea] transition-colors ${
                        cat.active ? 'bg-[#d4a017]/20 font-semibold' : ''
                      }`}
                    >
                      <span>{cat.label}</span>
                      <span className="bg-[#f2f6f3] text-[#1a2e1a] font-semibold px-2 py-1 rounded-sm text-xs">
                        {cat.count}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Region filter */}
            {rawItems.length > 0 && (
              <div className="bg-white border border-[#ede8d8] rounded-md p-6">
                <h4 className="text-md font-bold text-[#1a2e1a] mb-3">By Region</h4>
                <ul className="space-y-1">
                  {regions.map((reg) => (
                    <li key={reg.value}>
                      <Link 
                        href={`?region=${reg.value}&type=${resolvedParams.type || 'all'}`}
                        className="block p-2 rounded-sm text-sm hover:bg-[#f7f3ea] transition-colors flex items-center justify-between"
                      >
                        <span className="capitalize">{reg.label}</span>
                        <span className="text-xs text-gray-500">{reg.count}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </aside>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 pb-16 md:pb-24">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-[#1a2e1a]">Recent Stories</h2>
          <div className="w-12 h-[3px] bg-[#d4a017] rounded-sm" />
        </div>
        {stories.length > 0 ? (
          <NewsList items={stories} />
        ) : (
          <div className="text-center py-20">
            <p className="text-lg text-[#6a7a6a]">No stories match the current filters. Try adjusting the category or region above.</p>
          </div>
        )}
      </section>
    </main>
  );
}

