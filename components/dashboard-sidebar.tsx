"use client"

import type React from "react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  LayoutDashboard,
  Calendar,
  BookOpen,
  MessageSquare,
  TrendingUp,
  Users,
  Settings,
  LogOut,
  User,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  userRole?: string
}

export function DashboardSidebar({ className, userRole }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/")
  }

  const navigation = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
      roles: ["student", "mentor", "counselor", "admin"],
    },
    {
      name: "Bookings",
      href: "/dashboard/bookings",
      icon: Calendar,
      roles: ["student", "mentor", "counselor"],
    },
    {
      name: "Curriculum",
      href: "/dashboard/curriculum",
      icon: BookOpen,
      roles: ["student", "counselor", "admin"],
    },
    {
      name: "AI Chat",
      href: "/dashboard/chat",
      icon: MessageSquare,
      roles: ["student", "mentor", "counselor"],
    },
    {
      name: "Progress",
      href: "/dashboard/progress",
      icon: TrendingUp,
      roles: ["student", "counselor"],
    },
    {
      name: "Mentors",
      href: "/dashboard/mentors",
      icon: Users,
      roles: ["student", "counselor"],
    },
    {
      name: "Profile",
      href: "/dashboard/profile",
      icon: User,
      roles: ["student", "mentor", "counselor"],
    },
    {
      name: "Settings",
      href: "/dashboard/settings",
      icon: Settings,
      roles: ["student", "mentor", "counselor", "admin"],
    },
  ]

  const filteredNavigation = navigation.filter((item) => !userRole || item.roles.includes(userRole))

  return (
    <div className={cn("pb-12 w-64", className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">CareerPath AI</h2>
          <div className="space-y-1">
            <ScrollArea className="h-[calc(100vh-8rem)]">
              {filteredNavigation.map((item) => (
                <Button
                  key={item.href}
                  variant={pathname === item.href ? "secondary" : "ghost"}
                  className="w-full justify-start"
                  asChild
                >
                  <Link href={item.href}>
                    <item.icon className="mr-2 h-4 w-4" />
                    {item.name}
                  </Link>
                </Button>
              ))}
              <Button
                variant="ghost"
                className="w-full justify-start text-destructive hover:text-destructive"
                onClick={handleSignOut}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </Button>
            </ScrollArea>
          </div>
        </div>
      </div>
    </div>
  )
}
