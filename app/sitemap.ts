import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.yascon.org";
  const lastModified = new Date("2026-03-24");

  const staticPaths = [
    { path: "/", changeFrequency: "weekly", priority: 1.0 },
    { path: "/about", changeFrequency: "monthly", priority: 0.9 },
    { path: "/about/mission", changeFrequency: "yearly", priority: 0.7 },
    { path: "/about/objectives", changeFrequency: "yearly", priority: 0.7 },
    { path: "/about/our-story", changeFrequency: "yearly", priority: 0.7 },
    { path: "/about/work", changeFrequency: "yearly", priority: 0.7 },
    { path: "/about/location", changeFrequency: "yearly", priority: 0.6 },
    { path: "/about/management", changeFrequency: "yearly", priority: 0.6 },
    { path: "/contact", changeFrequency: "yearly", priority: 0.6 },
    { path: "/donate", changeFrequency: "monthly", priority: 0.8 },
    { path: "/partner-us", changeFrequency: "monthly", priority: 0.7 },
    { path: "/news", changeFrequency: "weekly", priority: 0.8 },
    { path: "/impact/central", changeFrequency: "yearly", priority: 0.5 },
    { path: "/impact/eastern", changeFrequency: "yearly", priority: 0.5 },
    { path: "/impact/national", changeFrequency: "yearly", priority: 0.5 },
    { path: "/impact/northern", changeFrequency: "yearly", priority: 0.5 },
    { path: "/impact/southern", changeFrequency: "yearly", priority: 0.5 },
  ] as const;

  const newsSlugs = [
    "tree-planting-season-2026",
    "Social Enterprise training",
    "youth-clubs-theatre",
    "chipata-forest-restoration",
    "district-climate-dialogues",
    "schools-green-innovation",
    "wetland-guardians",
    "national-youth-conservation-week",
  ];

  const newsPaths = newsSlugs.map((slug) => ({
    path: `/news/${slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticPaths].map((entry) => ({
    url: encodeURI(`${baseUrl}${entry.path}`),
    lastModified,
    changeFrequency: entry.changeFrequency,
    priority: entry.priority,
  }));
}

