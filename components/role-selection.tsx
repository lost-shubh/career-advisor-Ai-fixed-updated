"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  GraduationCapIcon,
  UsersIcon,
  BookOpenIcon,
  TargetIcon,
  PaletteIcon,
  LogInIcon,
  LogOutIcon,
} from "@/components/icons"
import { OnboardingForm } from "./onboarding-form"
import { ThemeSelector } from "./theme-selector"
import { LoginForm } from "./auth/login-form"
import { Dashboard } from "./dashboard"

const roles = [
  {
    id: "student",
    title: "Student",
    description: "Discover your career path and build essential skills",
    icon: GraduationCapIcon,
    color: "bg-primary text-primary-foreground",
  },
  {
    id: "parent",
    title: "Parent",
    description: "Guide your child's career journey with insights",
    icon: UsersIcon,
    color: "bg-secondary text-secondary-foreground",
  },
  {
    id: "teacher",
    title: "Teacher",
    description: "Support students with personalized career guidance",
    icon: BookOpenIcon,
    color: "bg-accent text-accent-foreground",
  },
  {
    id: "counselor",
    title: "Career Counselor",
    description: "Access advanced tools for professional guidance",
    icon: TargetIcon,
    color: "bg-muted text-muted-foreground",
  },
]

export function RoleSelection() {
  const [selectedRole, setSelectedRole] = useState<string | null>(null)
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [showThemeSelector, setShowThemeSelector] = useState(false)
  const [showLogin, setShowLogin] = useState(false)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [currentTheme, setCurrentTheme] = useState("emerald")

  useEffect(() => {
    const savedUser = localStorage.getItem("careerpath_current_user")
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser))
    }
  }, [])

  const handleRoleSelect = (roleId: string) => {
    if (!currentUser) {
      setShowLogin(true)
      return
    }
    setSelectedRole(roleId)
    setShowOnboarding(true)
  }

  const handleLogin = (userData: any) => {
    setCurrentUser(userData)
    setShowLogin(false)
    if (userData.isNewUser) {
      setSelectedRole("student")
      setShowOnboarding(true)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("careerpath_current_user")
    setCurrentUser(null)
    setSelectedRole(null)
    setShowOnboarding(false)
  }

  const handleThemeChange = (theme: string) => {
    setCurrentTheme(theme)
  }

  if (currentUser && !currentUser.isNewUser && !showOnboarding) {
    return <Dashboard userData={currentUser} onLogout={handleLogout} />
  }

  if (showLogin) {
    return <LoginForm onLogin={handleLogin} onBack={() => setShowLogin(false)} />
  }

  if (showOnboarding && selectedRole) {
    return <OnboardingForm role={selectedRole} userData={currentUser} />
  }

  if (showThemeSelector) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <Button variant="outline" onClick={() => setShowThemeSelector(false)} className="mb-4">
              ← Back to Home
            </Button>
          </div>
          <ThemeSelector onThemeChange={handleThemeChange} currentTheme={currentTheme} />
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="absolute top-4 right-4 flex gap-2">
        {currentUser ? (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Welcome, {currentUser.name}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="flex items-center gap-2 bg-transparent"
            >
              <LogOutIcon className="w-4 h-4" />
              Logout
            </Button>
          </div>
        ) : (
          <Button variant="outline" size="sm" onClick={() => setShowLogin(true)} className="flex items-center gap-2">
            <LogInIcon className="w-4 h-4" />
            Login
          </Button>
        )}
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowThemeSelector(true)}
          className="flex items-center gap-2"
        >
          <PaletteIcon className="w-4 h-4" />
          Themes
        </Button>
      </div>

      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-balance mb-4">Welcome to CareerPath AI</h1>
        <p className="text-xl text-muted-foreground text-pretty max-w-2xl mx-auto">
          Your personalized AI career advisor for navigating India's evolving job market. Choose your role to get
          started with tailored guidance.
        </p>
        <div className="mt-6 flex justify-center">
          <div className="bg-blue-50 border border-blue-200 rounded-full px-4 py-2 flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
            <span className="text-sm font-medium text-blue-700">Powered by DeepSeek AI</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
        {roles.map((role) => {
          const Icon = role.icon
          return (
            <Card
              key={role.id}
              className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105"
              onClick={() => handleRoleSelect(role.id)}
            >
              <CardHeader className="text-center">
                <div className={`w-16 h-16 rounded-full ${role.color} flex items-center justify-center mx-auto mb-4`}>
                  <Icon className="w-8 h-8" />
                </div>
                <CardTitle className="text-xl">{role.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center text-pretty">{role.description}</CardDescription>
                <Button className="w-full mt-4 bg-transparent" variant="outline">
                  Get Started
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="mt-16 text-center">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <TargetIcon className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">Personalized Guidance</h3>
            <p className="text-sm text-muted-foreground text-pretty">
              AI-powered recommendations based on your unique profile and interests
            </p>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center mb-4">
              <BookOpenIcon className="w-6 h-6 text-secondary" />
            </div>
            <h3 className="font-semibold mb-2">Skill Development</h3>
            <p className="text-sm text-muted-foreground text-pretty">
              Interactive assessments and learning roadmaps for career success
            </p>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mb-4">
              <UsersIcon className="w-6 h-6 text-accent" />
            </div>
            <h3 className="font-semibold mb-2">Community Support</h3>
            <p className="text-sm text-muted-foreground text-pretty">
              Connect with mentors, peers, and industry professionals
            </p>
          </div>
        </div>
      </div>

      <div className="mt-20 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-2xl p-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-4">Complete Career Development Platform</h2>
          <p className="text-muted-foreground">Everything you need for career success in one place</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { title: "Skills Assessment", desc: "AI-powered skill mapping and gap analysis", icon: "🎯" },
            { title: "Career Matching", desc: "Personalized career recommendations", icon: "🚀" },
            { title: "Learning Paths", desc: "Curated roadmaps for skill development", icon: "📚" },
            { title: "Resume Builder", desc: "ATS-optimized resume creation", icon: "📄" },
            { title: "Interview Coach", desc: "AI-powered interview preparation", icon: "🎤" },
            { title: "Mentorship", desc: "Connect with industry professionals", icon: "👥" },
          ].map((feature, index) => (
            <div key={index} className="bg-background/50 backdrop-blur-sm rounded-lg p-4 text-center">
              <div className="text-2xl mb-2">{feature.icon}</div>
              <h4 className="font-semibold mb-1">{feature.title}</h4>
              <p className="text-sm text-muted-foreground">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
