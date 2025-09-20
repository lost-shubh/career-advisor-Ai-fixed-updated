"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Palette, Check, Sun, Moon, Laptop } from "lucide-react"
import { useTheme } from "./theme-provider"

interface ThemeSelectorProps {
  onThemeChange?: (theme: string) => void
  currentTheme?: string
}

export function ThemeSelector({ onThemeChange, currentTheme }: ThemeSelectorProps) {
  const { theme, colorTheme, setTheme, setColorTheme } = useTheme()

  const themes = [
    {
      id: "emerald",
      name: "Emerald Professional",
      description: "Clean and professional with emerald accents",
      primary: "#059669",
      secondary: "#f0fdf4",
      preview: "bg-gradient-to-br from-emerald-50 to-emerald-100",
    },
    {
      id: "blue",
      name: "Ocean Blue",
      description: "Calming blue tones for focus and clarity",
      primary: "#3b82f6",
      secondary: "#eff6ff",
      preview: "bg-gradient-to-br from-blue-50 to-blue-100",
    },
    {
      id: "purple",
      name: "Creative Purple",
      description: "Inspiring purple for creative minds",
      primary: "#8b5cf6",
      secondary: "#faf5ff",
      preview: "bg-gradient-to-br from-purple-50 to-purple-100",
    },
    {
      id: "orange",
      name: "Energetic Orange",
      description: "Vibrant orange for motivation and energy",
      primary: "#f97316",
      secondary: "#fff7ed",
      preview: "bg-gradient-to-br from-orange-50 to-orange-100",
    },
    {
      id: "rose",
      name: "Warm Rose",
      description: "Gentle rose tones for a welcoming feel",
      primary: "#f43f5e",
      secondary: "#fff1f2",
      preview: "bg-gradient-to-br from-rose-50 to-rose-100",
    },
    {
      id: "slate",
      name: "Professional Slate",
      description: "Neutral slate for a corporate look",
      primary: "#64748b",
      secondary: "#f8fafc",
      preview: "bg-gradient-to-br from-slate-50 to-slate-100",
    },
  ]

  const [selectedLanguage, setSelectedLanguage] = useState("en")

  const handleThemeSelect = (themeId: string) => {
    setColorTheme(themeId as any)
    onThemeChange?.(themeId)
  }

  const handleModeChange = (mode: "light" | "dark" | "system") => {
    setTheme(mode)
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Palette className="w-5 h-5" />
          Platform Theme
        </CardTitle>
        <CardDescription>
          Customize your CareerPath AI experience with different color themes and display modes
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Color Theme Options */}
        <div>
          <h4 className="font-medium mb-3">Color Theme</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {themes.map((themeOption) => (
              <div
                key={themeOption.id}
                className={`relative cursor-pointer rounded-lg border-2 transition-all hover:shadow-md ${
                  colorTheme === themeOption.id
                    ? "border-primary shadow-md ring-2 ring-primary/20"
                    : "border-border hover:border-muted-foreground"
                }`}
                onClick={() => handleThemeSelect(themeOption.id)}
              >
                <div className={`h-20 rounded-t-lg ${themeOption.preview} relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                </div>
                <div className="p-3">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-medium text-sm">{themeOption.name}</h4>
                    {colorTheme === themeOption.id && <Check className="w-4 h-4 text-primary" />}
                  </div>
                  <p className="text-xs text-muted-foreground">{themeOption.description}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <div
                      className="w-3 h-3 rounded-full border shadow-sm"
                      style={{ backgroundColor: themeOption.primary }}
                    />
                    <div
                      className="w-3 h-3 rounded-full border shadow-sm"
                      style={{ backgroundColor: themeOption.secondary }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dark Mode Toggle */}
        <div className="border-t pt-4">
          <h4 className="font-medium mb-3">Display Mode</h4>
          <div className="flex gap-2">
            <Button
              variant={theme === "light" ? "default" : "outline"}
              size="sm"
              className="flex items-center gap-2"
              onClick={() => handleModeChange("light")}
            >
              <Sun className="w-4 h-4" />
              Light
            </Button>
            <Button
              variant={theme === "dark" ? "default" : "outline"}
              size="sm"
              className="flex items-center gap-2"
              onClick={() => handleModeChange("dark")}
            >
              <Moon className="w-4 h-4" />
              Dark
            </Button>
            <Button
              variant={theme === "system" ? "default" : "outline"}
              size="sm"
              className="flex items-center gap-2"
              onClick={() => handleModeChange("system")}
            >
              <Laptop className="w-4 h-4" />
              System
            </Button>
          </div>
        </div>

        {/* Language Selection */}
        <div className="border-t pt-4">
          <h4 className="font-medium mb-3">Language</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {[
              { code: "en", name: "English", flag: "🇺🇸" },
              { code: "hi", name: "हिंदी", flag: "🇮🇳" },
              { code: "ta", name: "தமிழ்", flag: "🇮🇳" },
              { code: "te", name: "తెలుగు", flag: "🇮🇳" },
              { code: "bn", name: "বাংলা", flag: "🇮🇳" },
              { code: "mr", name: "मराठी", flag: "🇮🇳" },
            ].map((lang) => (
              <Button
                key={lang.code}
                variant={selectedLanguage === lang.code ? "default" : "outline"}
                size="sm"
                className="justify-start"
                onClick={() => setSelectedLanguage(lang.code)}
              >
                <span className="mr-2">{lang.flag}</span>
                {lang.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Preview Section */}
        <div className="border-t pt-4">
          <h4 className="font-medium mb-3">Preview</h4>
          <div className="p-4 rounded-lg border bg-card">
            <div className="flex items-center justify-between mb-3">
              <h5 className="font-semibold text-card-foreground">Sample Dashboard</h5>
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-primary"></div>
                <div className="w-3 h-3 rounded-full bg-secondary"></div>
                <div className="w-3 h-3 rounded-full bg-accent"></div>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              This is how your interface will look with the selected theme.
            </p>
            <div className="flex gap-2">
              <Button size="sm">Primary Button</Button>
              <Button size="sm" variant="secondary">
                Secondary
              </Button>
              <Button size="sm" variant="outline">
                Outline
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
