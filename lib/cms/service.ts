

import { getPrismaClient } from "./db";

// ─── Types ─────────────────────────────────────────────────────────────────
export type ContentStatus = "draft" | "published" | "archived";
export type ContentRegion = "national" | "northern" | "central" | "southern" | "eastern";
export type CmsContentType = "news" | "announcement" | "press_briefing" | "blog" | "video";

export interface ListOptions {
  region?: ContentRegion | "all";
  status?: ContentStatus | "all";
  limit?: number;
  skip?: number;
}

export interface ContentListOptions extends ListOptions {
  contentType?: CmsContentType | null;
}

// ─── Unified Content ────────────────────────────────────────────────────────

export async function getContent(opts: ContentListOptions = {}) {
  const prisma = getPrismaClient();
  const where: Record<string, unknown> = {};

  if (opts.contentType) where.contentType = opts.contentType;
  if (opts.region && opts.region !== "all") where.region = opts.region;
  where.status = opts.status && opts.status !== "all" ? opts.status : "published";

  return prisma.cmsContent.findMany({
    where,
    include: { createdBy: { select: { id: true, name: true } } },
    orderBy: { publishedAt: "desc" },
    take: opts.limit ?? 50,
    skip: opts.skip ?? 0,
  });
}

export async function getContentBySlug(slug: string) {
  const prisma = getPrismaClient();
  return prisma.cmsContent.findFirst({
    where: { slug, status: "published" },
    include: { createdBy: { select: { id: true, name: true } } },
  });
}

export interface NewsItem {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  richContent: string;
  coverImage: string | null;
  videoUrl: string | null;
  videoDuration: number | null;
  contentType: CmsContentType;
  type: CmsContentType;
  region: ContentRegion;
  level: "national" | "regional";
  status: ContentStatus;
  publishedAt: Date | null;
  createdBy: { id: number; name: string };
}

function unifyNewsItem(item: Awaited<ReturnType<typeof getContentBySlug>>): NewsItem | null {
  if (!item) return null;
  return {
    ...item,
    type: item.contentType,
  };
}

export async function getUnifiedNewsItems(opts: ContentListOptions = {}) {
  const items = await getContent(opts);
  return items.map((item) => ({
    ...item,
    type: item.contentType,
  })) as NewsItem[];
}

export async function getUnifiedNewsBySlug(slug: string) {
  const item = await getContentBySlug(slug);
  return unifyNewsItem(item);
}

export function getTagFromType(type: CmsContentType) {
  switch (type) {
    case "blog":
      return "Blog";
    case "press_briefing":
    case "announcement":
      return "Press Release";
    case "news":
    case "video":
    default:
      return "News";
  }
}

export async function getContentById(id: number) {
  const prisma = getPrismaClient();
  return prisma.cmsContent.findUnique({
    where: { id },
    include: { createdBy: { select: { id: true, name: true } } },
  });
}

function normalizeNullableStringField(value: unknown): string | null {
  if (typeof value === "string") {
    return value || null;
  }
  if (value && typeof value === "object" && "url" in value) {
    const maybeUrl = (value as { url?: unknown }).url;
    return typeof maybeUrl === "string" ? maybeUrl || null : null;
  }
  return null;
}

export async function createContent(data: {
  title: string;
  slug: string;
  excerpt: string;
  richContent: string;
  coverImage?: { url: string } | string | null;
  videoUrl?: { url: string } | string | null;
  videoDuration?: number | null;
  contentType: CmsContentType;
  region: ContentRegion;
  level?: "national" | "regional";
  status: ContentStatus;
  createdById: number;
}) {
  const prisma = getPrismaClient();
  console.log("Creating content with data:", data);
  return prisma.cmsContent.create({
    data: {
      ...data,
      coverImage: normalizeNullableStringField(data.coverImage?.url),
      videoUrl: normalizeNullableStringField(data.videoUrl?.url),
      level: data.level ?? "national",
      publishedAt: data.status === "published" ? new Date() : null,
      updatedById: data.createdById,
    },
    include: { createdBy: { select: { id: true, name: true } } },
  });
}

export async function updateContent(
  id: number,
  data: Partial<{
    title: string;
    slug: string;
    excerpt: string;
    richContent: string;
    coverImage?: { url: string } | string | null;
    videoUrl?: { url: string } | string | null;
    videoDuration?: number | null;
    region: ContentRegion;
    level: "national" | "regional";
    status: ContentStatus;
  }>,
  updatedById: number
) {
  const prisma = getPrismaClient();
  const existing = await prisma.cmsContent.findUnique({ where: { id } });
  const wasPublished = existing?.status !== "published" && data.status === "published";

  const normalizedData = {
    ...data,
    coverImage: normalizeNullableStringField(data.coverImage?.url),
    videoUrl: normalizeNullableStringField(data.videoUrl?.url),
  };

  return prisma.cmsContent.update({
    where: { id },
    data: {
      ...normalizedData,
      updatedById,
      ...(wasPublished ? { publishedAt: new Date() } : {}),
      updatedAt: new Date(),
    },
    include: { createdBy: { select: { id: true, name: true } } },
  });
}

export async function deleteContent(id: number) {
  const prisma = getPrismaClient();
  await prisma.cmsContent.delete({ where: { id } });
}

// ─── Convenience wrappers (used by public-facing website pages) ─────────────
// These keep public page imports simple — they just call getContent with a filter.

export function getNews(opts: ListOptions = {}) {
  return getContent({ ...opts, contentType: "news" });
}

export function getAnnouncements(opts: ListOptions = {}) {
  return getContent({ ...opts, contentType: "announcement" });
}

export function getBlogs(opts: ListOptions = {}) {
  return getContent({ ...opts, contentType: "blog" });
}

export function getPressBriefings(opts: ListOptions = {}) {
  return getContent({ ...opts, contentType: "press_briefing" });
}

export function getVideos(opts: ListOptions = {}) {
  return getContent({ ...opts, contentType: "video" });
}

export async function getNewsBySlug(slug: string) {
  return getContentBySlug(slug);
}

// ─── Team Members ──────────────────────────────────────────────────────────

export interface TeamMember {
  id: number;
  name: string;
  role: string;
  joined?: string | null;
  avatar: string | null;
  focus: string;
  teamType: "management" | "board";
  region: ContentRegion | null;
  status: ContentStatus;
  publishedAt: string | null;
  createdBy: { name: string };
}

export async function getTeamMembers(
  opts: ListOptions & { type?: "management" | "board" | "all" } = {}
) {
  const prisma = getPrismaClient();
  const where: Record<string, unknown> = {};
  if (opts.region && opts.region !== "all") where.region = opts.region;
  if (opts.type && opts.type !== "all") where.teamType = opts.type;
  where.status = opts.status && opts.status !== "all" ? opts.status : "published";

  const data = await prisma.cmsTeamMember.findMany({
    where,
    include: { createdBy: { select: { id: true, name: true } } },
    orderBy: { publishedAt: "desc" },
    take: opts.limit ?? 50,
    skip: opts.skip ?? 0,
  });
  return data as TeamMember[];
}

export async function getTeamMemberById(id: number) {
  const prisma = getPrismaClient();
  return prisma.cmsTeamMember.findUnique({
    where: { id },
    include: { createdBy: { select: { name: true } } },
  });
}

export async function createTeamMember(data: {
  name: string;
  slug: string;
  role: string;
  joined?: string | null;
  avatar?: { url: string } | string | null;
  focus: string;
  teamType: "management" | "board";
  region?: ContentRegion | null;
  status: ContentStatus;
  createdById: number;
}) {
  const prisma = getPrismaClient();
  return prisma.cmsTeamMember.create({
    data: {
      ...data,
      avatar: typeof data.avatar === "string" ? data.avatar : data.avatar?.url,
      publishedAt: data.status === "published" ? new Date() : null,
      updatedById: data.createdById,
    },
  });
}

export async function updateTeamMember(
  id: number,
  data: Partial<{
    name: string;
    role: string;
    joined: string | null;
    avatar: { url: string } | string | null;
    focus: string;
    teamType: "management" | "board";
    region: ContentRegion | null;
    status: ContentStatus;
  }>,
  updatedById: number
) {
  const prisma = getPrismaClient();
  const existing = await prisma.cmsTeamMember.findUnique({ where: { id } });
  const wasPublished = existing?.status !== "published" && data.status === "published";
  return prisma.cmsTeamMember.update({
    where: { id },
    data: {
      ...data,
      updatedById,
      avatar: typeof data.avatar === "string" ? data.avatar : data.avatar?.url,
      ...(wasPublished ? { publishedAt: new Date() } : {}),
      updatedAt: new Date(),
    },
  });
}

export async function deleteTeamMember(id: number) {
  const prisma = getPrismaClient();
  await prisma.cmsTeamMember.delete({ where: { id } });
}

// ─── Media Items ───────────────────────────────────────────────────────────

export interface MediaItem {
  id: number;
  title: string;
  slug: string;
  description: string | null;
  mediaType: "gallery" | "document";
  fileUrl: string;
  coverImage: string | null;
  region: ContentRegion | null;
  status: ContentStatus;
  publishedAt: string | null;
  createdBy: { name: string };
}

export async function getMediaItems(
  opts: ListOptions & { type?: "gallery" | "document" | "all" } = {}
) {
  const prisma = getPrismaClient();
  const where: Record<string, unknown> = {};
  if (opts.region && opts.region !== "all") where.region = opts.region;
  if (opts.type && opts.type !== "all") where.mediaType = opts.type;
  where.status = opts.status && opts.status !== "all" ? opts.status : "published";

  const data = await prisma.cmsMediaItem.findMany({
    where,
    include: { createdBy: { select: { id: true, name: true } } },
    orderBy: { publishedAt: "desc" },
    take: opts.limit ?? 50,
    skip: opts.skip ?? 0,
  });
  return data as MediaItem[];
}

export async function getMediaItemById(id: number) {
  const prisma = getPrismaClient();
  return prisma.cmsMediaItem.findUnique({
    where: { id },
    include: { createdBy: { select: { name: true } } },
  });
}

export async function createMediaItem(data: {
  title: string;
  slug: string;
  description?: string | null;
  mediaType: "gallery" | "document";
  fileUrl: string;
  coverImage?: string | null;
  region?: ContentRegion | null;
  status: ContentStatus;
  createdById: number;
}) {
  const prisma = getPrismaClient();
  return prisma.cmsMediaItem.create({
    data: {
      ...data,
      publishedAt: data.status === "published" ? new Date() : null,
      updatedById: data.createdById,
    },
  });
}

export async function updateMediaItem(
  id: number,
  data: Partial<{
    title: string;
    slug: string;
    description: string | null;
    mediaType: "gallery" | "document";
    fileUrl: string;
    coverImage: string | null;
    region: ContentRegion | null;
    status: ContentStatus;
  }>,
  updatedById: number
) {
  const prisma = getPrismaClient();
  const existing = await prisma.cmsMediaItem.findUnique({ where: { id } });
  const wasPublished = existing?.status !== "published" && data.status === "published";
  return prisma.cmsMediaItem.update({
    where: { id },
    data: {
      ...data,
      updatedById,
      ...(wasPublished ? { publishedAt: new Date() } : {}),
      updatedAt: new Date(),
    },
  });
}

export async function deleteMediaItem(id: number) {
  const prisma = getPrismaClient();
  await prisma.cmsMediaItem.delete({ where: { id } });
}

// ─── Hero Slides (stored as a JSON blob in CmsContent) ─────────────────────

export interface HeroSlide {
  id: string;
  label: string;
  heading: string;
  sub: string;
  bg: string;
  cta1Label: string;
  cta1Href: string;
  cta2Label: string;
  cta2Href: string;
  order: number;
  active: boolean;
}

const HERO_SLUG = "hero-slides-config";

export async function getHeroSlides(): Promise<HeroSlide[]> {
  const prisma = getPrismaClient();
  try {
    const record = await prisma.cmsContent.findUnique({ where: { slug: HERO_SLUG } });
    if (!record?.richContent) return [];
    const slides: HeroSlide[] = JSON.parse(record.richContent);
    return slides.filter((s) => s.active).sort((a, b) => a.order - b.order);
  } catch {
    return [];
  }
}

export async function saveHeroSlides(slides: HeroSlide[], userId: number) {
  const prisma = getPrismaClient();
  const body = JSON.stringify(slides);
  const existing = await prisma.cmsContent.findUnique({ where: { slug: HERO_SLUG } });
  if (existing) {
    await prisma.cmsContent.update({
      where: { slug: HERO_SLUG },
      data: { richContent: body, updatedById: userId },
    });
  } else {
    await prisma.cmsContent.create({
      data: {
        title: "Hero Slides Configuration",
        slug: HERO_SLUG,
        contentType: "blog",
        region: "national",
        level: "national",
        richContent: body,
        createdById: userId,
        updatedById: userId,
      },
    });
  }
}