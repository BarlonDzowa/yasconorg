export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // Remove special characters
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Replace multiple hyphens with single hyphen
    .slice(0, 100); // Limit to 100 characters
}

export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function getPublishStatus(status: string): {
  label: string;
  color: string;
} {
  const statusMap: Record<string, { label: string; color: string }> = {
    draft: { label: "Draft", color: "bg-gray-100 text-gray-700" },
    published: { label: "Published", color: "bg-green-100 text-green-700" },
    archived: { label: "Archived", color: "bg-red-100 text-red-700" },
  };

  return statusMap[status] || statusMap.draft;
}
