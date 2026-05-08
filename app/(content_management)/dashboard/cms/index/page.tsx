import Link from "next/link";
import { getCurrentDashboardUser } from "@/lib/cms/auth";
import { CmsUserRecord } from "@/lib/cms/constants";

interface ContentTypeOption {
  name: string;
  href: string;
  description: string;
  icon: string;
  color: string;
}

const contentTypes: ContentTypeOption[] = [
  {
    name: "Announcements",
    href: "/dashboard/cms/announcements",
    description: "Create urgent announcements and updates",
    icon: "📢",
    color: "orange",
  },
  {
    name: "News",
    href: "/dashboard/cms/news",
    description: "Publish news articles and updates",
    icon: "📰",
    color: "blue",
  },
  {
    name: "Press Briefings",
    href: "/dashboard/cms/press-briefings",
    description: "Release official press briefings",
    icon: "📝",
    color: "purple",
  },
  {
    name: "Videos",
    href: "/dashboard/cms/videos",
    description: "Upload and manage video content",
    icon: "🎥",
    color: "red",
  },
  {
    name: "Blogs",
    href: "/dashboard/cms/blogs",
    description: "Write detailed blog posts",
    icon: "✍️",
    color: "green",
  },
  {
    name: "Teams & Board",
    href: "/dashboard/cms/teams",
    description: "Manage management team and board of trustees members",
    icon: "👥",
    color: "indigo",
  },
  {
    name: "Gallery",
    href: "/dashboard/cms/media?type=gallery",
    description: "Upload images for photo gallery",
    icon: "🖼️",
    color: "pink",
  },
  {
    name: "Documents",
    href: "/dashboard/cms/media?type=document",
    description: "Manage reports, PDFs, and downloadable documents",
    icon: "📄",
    color: "gray",
  },
];

export default async function CmsContentHubPage() {
  const user = await getCurrentDashboardUser();

  if (!user) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-8">
        <p className="text-red-600">Not authenticated</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-[#1a2e1a] mb-3">
          Content Management System
        </h1>
        <p className="text-[#2e3d35] text-lg">
          Welcome back, {user.name}! Create and manage content for your region.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-[#1a2e1a] mb-6">
          What would you like to create?
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {contentTypes.map((type) => (
            <Link
              key={type.name}
              href={type.href}
              className="group relative overflow-hidden rounded-xl border-2 border-gray-200 p-6 transition-all hover:border-green-500 hover:shadow-lg hover:-translate-y-1"
            >
              <div className="flex items-start justify-between mb-4">
                <span className="text-4xl">{type.icon}</span>
              </div>
              <h3 className="text-xl font-bold text-[#1a2e1a] mb-2">
                {type.name}
              </h3>
              <p className="text-sm text-[#2e3d35] mb-4">
                {type.description}
              </p>
              <div className="inline-block px-4 py-2 bg-green-100 text-green-700 rounded-lg text-sm font-semibold group-hover:bg-green-600 group-hover:text-white transition-colors">
                Create New →
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Content Stats */}
      <div className="grid md:grid-cols-4 gap-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <p className="text-sm font-semibold text-blue-600 mb-2">
            YOUR REGION
          </p>
          <p className="text-2xl font-bold text-[#1a2e1a] capitalize">
            {user.region}
          </p>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <p className="text-sm font-semibold text-green-600 mb-2">YOUR ROLE</p>
          <p className="text-2xl font-bold text-[#1a2e1a] capitalize">
            {user.role.replace("_", " ")}
          </p>
        </div>
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
          <p className="text-sm font-semibold text-purple-600 mb-2">
            MEMBER SINCE
          </p>
          <p className="text-2xl font-bold text-[#1a2e1a]">
            {new Date(user.created_at).getFullYear()}
          </p>
        </div>
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
          <p className="text-sm font-semibold text-orange-600 mb-2">
            ACCOUNT STATUS
          </p>
          <p className="text-2xl font-bold text-green-600">Active</p>
        </div>
      </div>
    </div>
  );
}
