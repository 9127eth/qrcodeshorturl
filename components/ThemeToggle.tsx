"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Moon, Sun } from "lucide-react"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light")
  }

  return (
    <div className="flex items-center space-x-2">
      <Switch
        id="dark-mode"
        checked={theme === "dark"}
        onCheckedChange={toggleTheme}
        className="relative inline-flex h-[24px] w-[44px] items-center rounded-full"
      >
        <span className="sr-only">Toggle dark mode</span>
        <span
          className={`${
            theme === "dark" ? "translate-x-5" : "translate-x-0"
          } inline-block h-5 w-5 transform rounded-full bg-white transition flex items-center justify-center`}
        >
          {theme === "dark" ? (
            <Moon className="h-3 w-3 text-gray-800" />
          ) : (
            <Sun className="h-3 w-3 text-yellow-500" />
          )}
        </span>
      </Switch>
      <Label htmlFor="dark-mode" className="text-sm font-medium">
        Dark mode
      </Label>
    </div>
  )
}
