"use client";

import { Button } from "@heroui/react";
import { useLayoutEffect } from "react";

function savedTheme() {
  try {
    return localStorage.getItem("theme");
  } catch {
    return null;
  }
}

function toggleTheme() {
  const root = document.documentElement;
  const next = root.dataset.theme === "dark" ? "light" : "dark";
  root.dataset.theme = next;
  try {
    localStorage.setItem("theme", next);
  } catch {
    // Storage can be blocked; the theme still applies until the page reloads.
  }
}

// Both icons render and CSS picks one, so the server and client markup always match.
export function ThemeToggle() {
  // Strict Mode's dev remount clears the attribute set by the script in layout.tsx.
  // This puts it back before paint, and changes nothing in production.
  useLayoutEffect(() => {
    const system = window.matchMedia("(prefers-color-scheme: dark)").matches;
    document.documentElement.dataset.theme = savedTheme() ?? (system ? "dark" : "light");
  }, []);

  return (
    <Button
      isIconOnly
      variant="ghost"
      size="sm"
      aria-label="تغییر تم روشن و تاریک"
      onPress={toggleTheme}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        aria-hidden="true"
        className="size-[18px] dark:hidden"
      >
        <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
      </svg>
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        aria-hidden="true"
        className="hidden size-[18px] dark:block"
      >
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
      </svg>
    </Button>
  );
}
