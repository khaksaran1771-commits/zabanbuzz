import type { Metadata } from "next";
import Link from "next/link";
import { RegisterForm } from "../forms";

export const metadata: Metadata = { title: "ثبت‌نام | Zabanbuzz" };

export default function RegisterPage() {
  return (
    <>
      <h1 className="text-2xl font-bold">ساخت حساب</h1>
      <RegisterForm />
      <p className="text-sm text-muted">
        قبلاً ثبت‌نام کرده‌ای؟{" "}
        <Link href="/login" className="font-medium text-link">
          وارد شو
        </Link>
      </p>
    </>
  );
}
