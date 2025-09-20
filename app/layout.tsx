import type React from "react"
import type { Metadata } from "next"
import { Inter, JetBrains_Mono } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import "./globals.css"

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
})

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "CareerPath AI - Personalized Career Advisor",
  description:
    "AI-powered career guidance platform for Indian students. Discover your career path, build skills, and prepare for the evolving job market.",
  keywords: "career guidance, AI career advisor, Indian students, skill development, job market, career counseling",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable} antialiased`} suppressHydrationWarning>
      <head>
        <meta name="google-cloud-ai" content="enabled" />
        <meta name="ai-powered" content="career-advisor" />
      </head>
      <body className="font-sans">
        <ThemeProvider defaultTheme="system" defaultColorTheme="emerald">
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
