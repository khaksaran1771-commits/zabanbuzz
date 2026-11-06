import type { Metadata } from "next";
import { Suspense } from "react";
import { requireRole } from "@/lib/auth/session";

export const metadata: Metadata = { title: "پنل دانش‌آموز | Zabanbuzz" };

async function Content() {
  const user = await requireRole("STUDENT");
  return (
    <>
      <h1 className="text-2xl font-bold">سلام {user.name}</h1>
      <p className="text-muted">آزمون‌ها و درس‌هایت به‌زودی اینجا نمایش داده می‌شوند.</p>
    </>
  );
}

export default function StudentPage() {
  return (
    <Suspense fallback={<p className="text-muted">در حال بارگذاری…</p>}>
      <Content />
    </Suspense>
  );
}
