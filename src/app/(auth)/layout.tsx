import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { ThemeToggle } from "@/components/theme-toggle";
import { panelPath } from "@/lib/auth/roles";
import { getCurrentUser } from "@/lib/auth/session";

async function RedirectIfSignedIn() {
  const user = await getCurrentUser();
  if (user) redirect(panelPath(user.role));
  return null;
}

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center gap-6 px-4 py-12">
      <Suspense fallback={null}>
        <RedirectIfSignedIn />
      </Suspense>
      <div className="flex items-center justify-between gap-3">
        <Link href="/" className="text-lg font-extrabold tracking-tight">
          Zabanbuzz
        </Link>
        <ThemeToggle />
      </div>
      {children}
    </main>
  );
}
