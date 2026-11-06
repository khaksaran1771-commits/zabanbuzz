import { ButtonRoot } from "@heroui/react";
import Link from "next/link";
import { Suspense } from "react";
import { ThemeToggle } from "@/components/theme-toggle";
import { ROLE_LABELS } from "@/lib/auth/roles";
import { requireUser } from "@/lib/auth/session";
import { logout } from "../(auth)/actions";

async function UserMenu() {
  const user = await requireUser();
  return (
    <div className="flex items-center gap-3 text-sm">
      <span>
        {user.name} <span className="text-muted">({ROLE_LABELS[user.role]})</span>
      </span>
      <form action={logout}>
        <ButtonRoot type="submit" variant="ghost" size="sm">
          خروج
        </ButtonRoot>
      </form>
    </div>
  );
}

export default function PanelLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header className="border-b border-border">
        <div className="mx-auto flex w-full max-w-4xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <Link href="/" className="font-bold">
            Zabanbuzz
          </Link>
          <div className="flex items-center gap-3">
            <Suspense fallback={null}>
              <UserMenu />
            </Suspense>
            <ThemeToggle />
          </div>
        </div>
      </header>
      <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-4 px-4 py-8">
        {children}
      </main>
    </>
  );
}
