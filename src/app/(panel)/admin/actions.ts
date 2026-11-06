"use server";

import { revalidatePath } from "next/cache";
import { isRole } from "@/lib/auth/roles";
import { requireRole } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";

export async function setUserRole(formData: FormData) {
  const admin = await requireRole("ADMIN");
  const userId = String(formData.get("userId") ?? "");
  const role = formData.get("role");

  // Admins can't change their own role, so the last admin can't lock everyone out.
  if (!isRole(role) || userId === admin.id) return;

  await prisma.user.update({ where: { id: userId }, data: { role } });
  revalidatePath("/admin");
}
