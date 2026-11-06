import type { Metadata } from "next";
import { Suspense } from "react";
import { requireRole } from "@/lib/auth/session";

export const metadata: Metadata = { title: "پنل مدرس | Zabanbuzz" };

async function Content() {
  const user = await requireRole("TEACHER");
  return (
    <>
      <h1 className="text-2xl font-bold">سلام {user.name}</h1>
      <p className="text-muted">ساخت آزمون و تدریس به‌زودی اینجا اضافه می‌شود.</p>
    </>
  );
}

export default function TeacherPage() {
  return (
    <Suspense fallback={<p className="text-muted">در حال بارگذاری…</p>}>
      <Content />
    </Suspense>
  );
}
