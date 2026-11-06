import type { Metadata } from "next";
import Link from "next/link";
import { connection } from "next/server";
import { Suspense } from "react";
import { isOtpEnabled } from "@/lib/auth/otp";
import { LoginForm, OtpForm } from "../forms";

export const metadata: Metadata = { title: "ورود | Zabanbuzz" };

async function OtpSection() {
  // The flag is read per request, so it isn't frozen into the image at build time.
  await connection();
  if (!isOtpEnabled()) return null;

  return (
    <section className="flex flex-col gap-4 border-t border-border pt-6">
      <h2 className="font-semibold">ورود با کد یک‌بارمصرف</h2>
      <OtpForm />
    </section>
  );
}

export default function LoginPage() {
  return (
    <>
      <h1 className="text-2xl font-bold">ورود به حساب</h1>
      <LoginForm />
      <Suspense fallback={null}>
        <OtpSection />
      </Suspense>
      <p className="text-sm text-muted">
        حساب نداری؟{" "}
        <Link href="/register" className="font-medium text-link">
          ثبت‌نام کن
        </Link>
      </p>
    </>
  );
}
