"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { themes } from "@/lib/theme-colors"
import { Palette } from "lucide-react"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

export function ThemeSwitcher() {
  const { theme: colorMode } = useTheme()
  const [currentTheme, setCurrentTheme] = useState<keyof typeof themes>("neutral")

  const applyTheme = (themeName: keyof typeof themes) => {
    const root = document.documentElement
    const theme = themes[themeName]
    const colors = colorMode === "dark" ? theme.dark : theme.light

    // Apply each color as a CSS variable
    Object.entries(colors).forEach(([key, value]) => {
      root.style.setProperty(`--${key}`, value)
    })

    // Also update sidebar colors
    const sidebarColors = {
      light: {
        "sidebar-background": "0 0% 98%",
        "sidebar-foreground": "240 5.3% 26.1%",
        "sidebar-primary": "240 5.9% 10%",
        "sidebar-primary-foreground": "0 0% 98%",
        "sidebar-accent": "240 4.8% 95.9%",
        "sidebar-accent-foreground": "240 5.9% 10%",
        "sidebar-border": "220 13% 91%",
        "sidebar-ring": "217.2 91.2% 59.8%",
      },
      dark: {
        "sidebar-background": "240 5.9% 10%",
        "sidebar-foreground": "240 4.8% 95.9%",
        "sidebar-primary": "224.3 76.3% 48%",
        "sidebar-primary-foreground": "0 0% 100%",
        "sidebar-accent": "240 3.7% 15.9%",
        "sidebar-accent-foreground": "240 4.8% 95.9%",
        "sidebar-border": "240 3.7% 15.9%",
        "sidebar-ring": "217.2 91.2% 59.8%",
      }
    }

    const sidebarTheme = colorMode === "dark" ? sidebarColors.dark : sidebarColors.light
    Object.entries(sidebarTheme).forEach(([key, value]) => {
      root.style.setProperty(`--${key}`, value)
    })

    setCurrentTheme(themeName)
    // Save to localStorage
    localStorage.setItem("app-theme", themeName)
  }

  // Load saved theme on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("app-theme") as keyof typeof themes
    if (savedTheme && themes[savedTheme]) {
      applyTheme(savedTheme)
    }
  }, [colorMode])

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Palette className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">Switch theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {Object.entries(themes).map(([themeName, theme]) => {
          const isDark = colorMode === "dark"
          const colors = isDark ? theme.dark : theme.light
          const primaryHSL = colors.primary
          
          return (
            <DropdownMenuItem
              key={themeName}
              onClick={() => applyTheme(themeName as keyof typeof themes)}
              className="capitalize"
            >
              <div className="flex items-center gap-2">
                <div 
                  className="h-4 w-4 rounded-full border"
                  style={{ 
                    backgroundColor: `hsl(${primaryHSL})`,
                    borderColor: `hsl(${colors.border})`
                  }} 
                />
                {themeName}
                {currentTheme === themeName && " ✓"}
              </div>
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}