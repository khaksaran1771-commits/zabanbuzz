import { CardDescription, CardHeader, CardRoot, CardTitle, ChipRoot } from "@heroui/react";
import { buttonVariants } from "@heroui/styles";
import Link from "next/link";
import { SampleQuestion } from "@/components/sample-question";
import { ThemeToggle } from "@/components/theme-toggle";

const TOPICS = [
  {
    en: "Vocabulary",
    fa: "واژگان",
    text: "واژه‌ها را داخل جمله و تست تمرین کن، نه فقط از روی فهرست.",
  },
  {
    en: "Grammar",
    fa: "گرامر",
    text: "قاعده را همراه همان الگویی ببین که در سؤال‌ها تکرار می‌شود.",
  },
  {
    en: "Cloze Test",
    fa: "کلوز تست",
    text: "جای خالی متن را با نگاه به کل جمله و ارتباط جمله‌ها پر کن.",
  },
  {
    en: "Reading",
    fa: "درک مطلب",
    text: "متن را با هدف بخوان و پاسخ هر سؤال را در خود متن پیدا کن.",
  },
];

const STEPS = [
  {
    title: "آزمون بده",
    text: "سؤال‌های زبان را مبحثی یا در قالب یک آزمون کامل حل کن.",
  },
  {
    title: "اشکالت را پیدا کن",
    text: "ببین در کدام مبحث بیشتر اشتباه می‌کنی و چرا.",
  },
  {
    title: "با تدریس مرور کن",
    text: "همان مبحث را از مدرس یاد بگیر و دوباره سراغ تست برو.",
  },
];

export default function Home() {
  return (
    <>
      <header className="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-3">
          <Link href="/" className="text-lg font-extrabold tracking-tight">
            Zabanbuzz
          </Link>
          <nav className="flex items-center gap-1 sm:gap-2">
            <a
              href="#topics"
              className="hidden px-2 text-sm text-muted hover:text-foreground sm:block"
            >
              مباحث
            </a>
            <a
              href="#how"
              className="hidden px-2 text-sm text-muted hover:text-foreground sm:block"
            >
              روش کار
            </a>
            <Link href="/login" className={buttonVariants({ variant: "ghost", size: "sm" })}>
              ورود
            </Link>
            <ThemeToggle />
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <section className="relative overflow-hidden">
          <div aria-hidden="true" className="dot-grid absolute inset-0" />
          <div className="relative mx-auto grid w-full max-w-6xl items-center gap-10 px-4 py-14 lg:grid-cols-[1.1fr_1fr] lg:gap-16 lg:py-24">
            <div className="flex flex-col items-start gap-6">
              <ChipRoot variant="soft">ویژه‌ی داوطلبان کنکور</ChipRoot>
              <h1 className="text-4xl leading-tight font-extrabold tracking-tight sm:text-6xl sm:leading-[1.15]">
                زبان کنکور را
                <br />
                <span className="relative inline-block">
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-0 bottom-1 h-4 rounded-sm bg-accent/70 sm:bottom-2 sm:h-5"
                  />
                  <span className="relative">تست‌به‌تست</span>
                </span>{" "}
                یاد بگیر.
              </h1>
              <p className="max-w-xl text-lg leading-8 text-muted">
                با Zabanbuzz سؤال‌های زبان را تمرین می‌کنی، اشکالت را می‌بینی و همان مبحث را با
                تدریس مرور می‌کنی.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href="/register" className={buttonVariants({ size: "lg" })}>
                  شروع کن
                </Link>
                <a href="#topics" className={buttonVariants({ variant: "outline", size: "lg" })}>
                  مباحث را ببین
                </a>
              </div>
            </div>
            <SampleQuestion />
          </div>
        </section>

        <section id="topics" className="scroll-mt-16 border-t border-border">
          <div className="mx-auto w-full max-w-6xl px-4 py-16 lg:py-24">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              هر بخش از سؤال‌های زبان، جدا
            </h2>
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {TOPICS.map((topic) => (
                <CardRoot key={topic.en} className="p-6">
                  <CardHeader className="gap-3">
                    <span dir="ltr" className="text-end text-sm font-semibold text-link">
                      {topic.en}
                    </span>
                    <CardTitle className="text-xl font-bold">{topic.fa}</CardTitle>
                    <CardDescription className="leading-7">{topic.text}</CardDescription>
                  </CardHeader>
                </CardRoot>
              ))}
            </div>
          </div>
        </section>

        <section id="how" className="scroll-mt-16 border-t border-border bg-surface">
          <div className="mx-auto w-full max-w-6xl px-4 py-16 lg:py-24">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              تمرین، اشکال‌یابی، مرور
            </h2>
            <ol className="mt-10 grid gap-8 md:grid-cols-3">
              {STEPS.map((step, index) => (
                <li key={step.title} className="flex flex-col gap-3 border-t-2 border-accent pt-5">
                  <span className="text-sm font-semibold text-link">
                    {(index + 1).toLocaleString("fa-IR")}
                  </span>
                  <h3 className="text-xl font-bold">{step.title}</h3>
                  <p className="leading-7 text-muted">{step.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="border-t border-border">
          <div className="mx-auto flex w-full max-w-6xl flex-col items-start gap-6 px-4 py-16 lg:py-24">
            <h2 className="max-w-2xl text-3xl font-bold tracking-tight sm:text-4xl">
              از همین امروز تمرین زبان را شروع کن.
            </h2>
            <Link href="/register" className={buttonVariants({ size: "lg" })}>
              ساخت حساب
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto w-full max-w-6xl px-4 py-6 text-sm text-muted">Zabanbuzz</div>
      </footer>
    </>
  );
}
