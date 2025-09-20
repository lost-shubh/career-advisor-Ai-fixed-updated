"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"

type Theme = "light" | "dark" | "system"
type ColorTheme = "emerald" | "blue" | "purple" | "orange" | "rose" | "slate"

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
  defaultColorTheme?: ColorTheme
  storageKey?: string
}

type ThemeProviderState = {
  theme: Theme
  colorTheme: ColorTheme
  setTheme: (theme: Theme) => void
  setColorTheme: (colorTheme: ColorTheme) => void
}

const initialState: ThemeProviderState = {
  theme: "system",
  colorTheme: "emerald",
  setTheme: () => null,
  setColorTheme: () => null,
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

export function ThemeProvider({
  children,
  defaultTheme = "system",
  defaultColorTheme = "emerald",
  storageKey = "careerpath-theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(defaultTheme)
  const [colorTheme, setColorTheme] = useState<ColorTheme>(defaultColorTheme)
  const [mounted, setMounted] = useState(false) // Add mounted state to prevent hydration issues

  useEffect(() => {
    setMounted(true) // Set mounted to true after component mounts
    const root = window.document.documentElement
    const storedTheme = localStorage.getItem(storageKey) as Theme
    const storedColorTheme = localStorage.getItem(`${storageKey}-color`) as ColorTheme

    if (storedTheme) {
      setTheme(storedTheme)
    }
    if (storedColorTheme) {
      setColorTheme(storedColorTheme)
    }

    const applyTheme = (themeToApply: Theme) => {
      root.classList.remove("light", "dark")

      if (themeToApply === "system") {
        const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
        root.classList.add(systemTheme)
        root.setAttribute("data-theme", systemTheme)
      } else {
        root.classList.add(themeToApply)
        root.setAttribute("data-theme", themeToApply)
      }
    }

    applyTheme(storedTheme || defaultTheme)
    applyColorTheme(storedColorTheme || defaultColorTheme)

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
    const handleChange = () => {
      if ((storedTheme || defaultTheme) === "system") {
        applyTheme("system")
      }
    }

    mediaQuery.addEventListener("change", handleChange)
    return () => mediaQuery.removeEventListener("change", handleChange)
  }, [defaultTheme, defaultColorTheme, storageKey])

  const applyColorTheme = (colorTheme: ColorTheme) => {
    const root = window.document.documentElement

    const colorThemes = {
      emerald: {
        primary: "#059669",
        secondary: "#10b981",
        accent: "#34d399",
        muted: "#f0fdf4",
      },
      blue: {
        primary: "#3b82f6",
        secondary: "#60a5fa",
        accent: "#93c5fd",
        muted: "#eff6ff",
      },
      purple: {
        primary: "#8b5cf6",
        secondary: "#a78bfa",
        accent: "#c4b5fd",
        muted: "#faf5ff",
      },
      orange: {
        primary: "#f97316",
        secondary: "#fb923c",
        accent: "#fdba74",
        muted: "#fff7ed",
      },
      rose: {
        primary: "#f43f5e",
        secondary: "#fb7185",
        accent: "#fda4af",
        muted: "#fff1f2",
      },
      slate: {
        primary: "#64748b",
        secondary: "#94a3b8",
        accent: "#cbd5e1",
        muted: "#f8fafc",
      },
    }

    const colors = colorThemes[colorTheme]
    root.style.setProperty("--primary", colors.primary)
    root.style.setProperty("--secondary", colors.secondary)
    root.style.setProperty("--accent", colors.accent)
    root.style.setProperty("--muted", colors.muted)
  }

  const value = {
    theme,
    colorTheme,
    setTheme: (theme: Theme) => {
      localStorage.setItem(storageKey, theme)
      setTheme(theme)

      const root = window.document.documentElement
      root.classList.remove("light", "dark")

      if (theme === "system") {
        const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
        root.classList.add(systemTheme)
        root.setAttribute("data-theme", systemTheme) // Add data-theme attribute
      } else {
        root.classList.add(theme)
        root.setAttribute("data-theme", theme) // Add data-theme attribute
      }
    },
    setColorTheme: (colorTheme: ColorTheme) => {
      localStorage.setItem(`${storageKey}-color`, colorTheme)
      setColorTheme(colorTheme)
      applyColorTheme(colorTheme)
    },
  }

  if (!mounted) {
    return <div style={{ visibility: "hidden" }}>{children}</div>
  }

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)

  if (context === undefined) throw new Error("useTheme must be used within a ThemeProvider")

  return context
}
