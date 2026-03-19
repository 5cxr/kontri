"use client";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "./ThemeProvider";

export default function DarkModeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full hover:bg-white/10 transition"
      aria-label="Toggle dark mode"
    >
      {theme === "dark"
        ? <Sun className="w-5 h-5 text-yellow-300" />
        : <Moon className="w-5 h-5 text-blue-200" />}
    </button>
  );
}
