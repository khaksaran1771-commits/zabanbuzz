import type { Role } from "@/generated/prisma/client";

export const ROLES: readonly Role[] = ["STUDENT", "TEACHER", "ADMIN"];

export const ROLE_LABELS: Record<Role, string> = {
  STUDENT: "دانش‌آموز",
  TEACHER: "مدرس",
  ADMIN: "ادمین",
};

const PANEL_PATHS: Record<Role, string> = {
  STUDENT: "/student",
  TEACHER: "/teacher",
  ADMIN: "/admin",
};

export function panelPath(role: Role) {
  return PANEL_PATHS[role];
}

export function isRole(value: unknown): value is Role {
  return ROLES.includes(value as Role);
}
