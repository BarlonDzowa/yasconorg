import { redirect } from "next/navigation";
import CmsClient from "./CmsClient";
import { getCurrentUserServerOnly } from "@/lib/cms/auth";
import type { CmsUserRecord } from "@/lib/cms/constants";

export default async function CmsDashboardPage() {
  const initialUser = await getCurrentUserServerOnly();

  if (!initialUser) {
    redirect("/dashboard/login");
  }

  return <CmsClient initialUser={initialUser} />;
}

