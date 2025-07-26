"use client";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

const ThemeSwitch = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="flex">
      <div className="flex group items-center">
        {theme === "dark" && (
          <Sun
            className="group-hover:text-yellow-600 cursor-pointer text-foreground mr-1 w-5 group-hover:rotate-180 transition-all duration-300 ease-in-out"
            onClick={() => setTheme("light")}
          />
        )}
        {theme === "light" && (
          <Moon
            className="group-hover:text-blue-400 cursor-pointer text-foreground mr-1 w-5 group-hover:rotate-180 transition-all duration-300 ease-in-out"
            onClick={() => setTheme("dark")}
          />
        )}
      </div>
      {/* <Switch checked={theme === "dark"} /> */}
    </div>
  );
};

export default ThemeSwitch;
