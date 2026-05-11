"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return <div className="w-14 h-7" />;

  const isDark = theme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label="Toggle theme"
      className={`relative w-14 h-7 rounded-full border transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
        isDark
          ? "bg-primary/20 border-primary/40"
          : "bg-primary/10 border-primary/30"
      }`}
    >
      {/* Track icons */}
      <Sun className="absolute left-1.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-amber-400 transition-opacity duration-300"
        style={{ opacity: isDark ? 0.3 : 1 }}
      />
      <Moon className="absolute right-1.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-primary transition-opacity duration-300"
        style={{ opacity: isDark ? 1 : 0.3 }}
      />
      {/* Thumb */}
      <span
        className={`absolute top-0.5 w-6 h-6 rounded-full shadow-md transition-all duration-300 flex items-center justify-center ${
          isDark
            ? "translate-x-7 bg-primary"
            : "translate-x-0.5 bg-white border border-primary/20"
        }`}
      />
    </button>
  );
}
