import type { Metadata } from "next";
import "@fontsource-variable/vazirmatn";
import { Providers } from "@/components/providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "Zabanbuzz | تمرین سؤال‌های زبان کنکور",
  description: "تمرین سؤال‌های زبان کنکور با آزمون و تدریس.",
};

// Runs before first paint so a dark-mode user never sees a flash of the light theme.
// With no saved choice, the site follows the system setting.
const themeScript = `(function () {
  var root = document.documentElement;
  var system = window.matchMedia("(prefers-color-scheme: dark)");
  function saved() {
    try { return localStorage.getItem("theme"); } catch (e) { return null; }
  }
  root.dataset.theme = saved() || (system.matches ? "dark" : "light");
  system.addEventListener("change", function (e) {
    if (!saved()) root.dataset.theme = e.matches ? "dark" : "light";
  });
})();`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // The script changes data-theme before React hydrates.
    <html lang="fa" dir="rtl" className="h-full antialiased" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-full flex flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
