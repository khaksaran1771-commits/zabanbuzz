import { CardRoot } from "@heroui/react";
import type { Metadata } from "next";
import { Suspense } from "react";
import { ROLE_LABELS } from "@/lib/auth/roles";
import { requireRole } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { RoleForm } from "./role-form";

export const metadata: Metadata = { title: "پنل ادمین | Zabanbuzz" };

async function Users() {
  const admin = await requireRole("ADMIN");
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
    select: { id: true, name: true, email: true, phone: true, role: true },
  });

  return (
    <CardRoot className="p-0">
      <ul className="flex flex-col divide-y divide-border">
        {users.map((user) => (
          <li key={user.id} className="flex flex-wrap items-center justify-between gap-3 p-4">
            <div className="min-w-0">
              <p className="font-medium">{user.name}</p>
              <p dir="ltr" className="truncate text-end text-sm text-muted">
                {user.email ?? user.phone}
              </p>
            </div>
            {user.id === admin.id ? (
              <span className="text-sm text-muted">{ROLE_LABELS[user.role]} (خودت)</span>
            ) : (
              // The key remounts the uncontrolled select so it shows the saved role.
              <RoleForm key={user.role} userId={user.id} name={user.name} role={user.role} />
            )}
          </li>
        ))}
      </ul>
    </CardRoot>
  );
}

export default function AdminPage() {
  return (
    <>
      <h1 className="text-2xl font-bold">کاربران</h1>
      <Suspense fallback={<p className="text-muted">در حال بارگذاری…</p>}>
        <Users />
      </Suspense>
    </>
  );
}
