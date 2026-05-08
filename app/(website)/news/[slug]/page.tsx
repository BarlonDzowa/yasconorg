import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getUnifiedNewsBySlug, getTagFromType, NewsItem } from '@/lib/cms/service';
import { initCms } from '@/lib/cms/init';

export const dynamic = 'force-dynamic';

interface Props {
  params: { slug: string };
}

export default async function NewsDetailPage({ params }: Props) {
  const resolvedParams = await params;
  await initCms();
  
  const item = await getUnifiedNewsBySlug(resolvedParams.slug);
  
  if (!item) {
    notFound();
  }

  const tag = getTagFromType(item.type);
  const dateStr = item.publishedAt ? new Date(item.publishedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }) : '';

  const fallbackImage = '/our-work/work1.avif';

  return (
    <article className="bg-[#f7f3ea] min-h-screen">
      {/* Hero */}
      <section className="relative">
        <div className="relative h-[60vh] md:h-[70vh] overflow-hidden">
          <Image
            src={item.coverImage || fallbackImage}
            alt={item.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/10 to-black/40" />
        </div>
        
        <div className="absolute bottom-8 left-6 md:left-12 max-w-4xl">
          <span className="inline-flex items-center px-3 py-1 text-xs font-bold uppercase tracking-wide rounded-sm bg-white/90 backdrop-blur-sm text-[#1a2e1a]">
            {tag}
          </span>
          <h1 className="text-3xl md:text-5xl font-bold text-white mt-4 leading-tight">
            {item.title}
          </h1>
          <div className="text-white/90 mt-2 text-sm md:text-base flex flex-col sm:flex-row gap-4 sm:items-center">
            <span>By {item.createdBy.name}</span>
            {dateStr && <span>{dateStr}</span>}
            {item.region && <span className="capitalize">— {item.region.replace('_', ' ')}</span>}
          </div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-6 md:px-12 py-16 md:py-24">
        {/* Back button */}
        <Link
          href="/news"
          className="inline-flex items-center gap-2 text-green-700 hover:text-green-800 font-semibold mb-12 group"
        >
          <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Newsroom
        </Link>

        {/* Excerpt */}
        <p className="text-xl md:text-2xl text-[#4a5a4a] italic leading-relaxed mb-12 max-w-3xl">
          {item.excerpt}
        </p>

        {/* Full content */}
        <div 
          className="prose prose-lg max-w-none prose-headings:text-[#1a2e1a] prose-headings:font-bold prose-a:text-green-700 hover:prose-a:text-green-800 prose-strong:text-[#1a2e1a] prose-blockquote:border-l-green-600 prose-blockquote:text-[#4a5a4a]"
          dangerouslySetInnerHTML={{ __html: item.richContent || '<p>No content available.</p>' }}
        />

        {/* Meta footer */}
        <div className="mt-16 pt-12 border-t border-[#ede8d8] flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-sm text-[#6a7a6a]">
          <div className="flex items-center gap-2">
            <span>Published: {dateStr || 'Draft'}</span>
            {item.region && (
              <>
                <span>•</span>
                <span className="capitalize">{item.region.replace('_', ' ')}</span>
              </>
            )}
          </div>
          <div className="flex items-center gap-4">
            <span>By {item.createdBy.name}</span>
            <Link href="/news" className="text-green-700 hover:text-green-800 font-semibold">
              ← See all stories
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}

