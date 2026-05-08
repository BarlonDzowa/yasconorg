import type {
  CmsLevel,
  CmsRegion,
  CmsRole,
  CmsUserRecord,
} from "./constants";

export type ContentScope = {
  level: CmsLevel;
  region: CmsRegion | null;
};

export function isSuperAdmin(user: CmsUserRecord) {
  return user.role === "super_admin";
}

export function canAccessContentScope(
  user: CmsUserRecord,
  scope: ContentScope
): boolean {
  if (isSuperAdmin(user)) {
    return true;
  }

  return scope.level === "regional" && scope.region === user.region;
}

export function getForcedScopeForUser(user: CmsUserRecord): ContentScope | null {
  if (isSuperAdmin(user)) {
    return null;
  }

  if (user.region === "national") {
    return { level: "national", region: null };
  }

  return { level: "regional", region: user.region };
}

export function canManageUsers(user: CmsUserRecord) {
  return isSuperAdmin(user);
}

export function canReadUserRecord(
  actor: CmsUserRecord,
  target: { role: CmsRole; region: CmsRegion }
) {
  if (isSuperAdmin(actor)) {
    return true;
  }
  return target.region === actor.region && target.role !== "super_admin";
}

export function canCreateOrEditContent(user: CmsUserRecord): boolean {
  // Super admins can create/edit anything
  if (isSuperAdmin(user)) {
    return true;
  }

  // Regional admins can create/edit content in their region
  return user.role === "regional_admin";
}

