"use client";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "./ThemeProvider";

export default function DarkModeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full hover:bg-amber-100 dark:hover:bg-zinc-700 transition"
      aria-label="Toggle dark mode"
    >
      {theme === "dark"
        ? <Sun className="w-5 h-5 text-amber-400" />
        : <Moon className="w-5 h-5 text-gray-500" />}
    </button>
  );
}
