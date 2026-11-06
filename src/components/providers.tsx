"use client";

import { I18nProvider } from "@heroui/react";

// Without this, React Aria takes the direction from the browser language,
// and popovers open left-to-right on a browser set to English.
export function Providers({ children }: { children: React.ReactNode }) {
  return <I18nProvider locale="fa-IR">{children}</I18nProvider>;
}
