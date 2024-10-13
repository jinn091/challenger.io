import { useState, useEffect } from "react";
import { Theme } from "../icons";

export default function ThemeToggle({ className }: { className: string }) {
  const [dark, setDark] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      // equivalent to browser in Svelte
      const storedTheme = window.localStorage.getItem("theme");
      if (!storedTheme) {
        const prefersDark = window.matchMedia(
          "(prefers-color-scheme: dark)"
        ).matches;
        document.documentElement.classList.toggle("dark", prefersDark);
        setDark(prefersDark);
      } else {
        const isDark = storedTheme === "dark";
        document.documentElement.classList.toggle("dark", isDark);
        setDark(isDark);
      }
    }
  }, []);

  const toggleTheme = () => {
    const newDarkMode = !dark;
    setDark(newDarkMode);

    if (newDarkMode) {
      window.localStorage.setItem("theme", "dark");
      document.documentElement.classList.add("dark");
    } else {
      window.localStorage.setItem("theme", "light");
      document.documentElement.classList.remove("dark");
    }
  };

  return (
    <button className={className} onClick={toggleTheme}>
      <p>Switch to {dark ? "Light View" : "Dark View"}</p>
      <Theme width={20} height={20} />
    </button>
  );
}
