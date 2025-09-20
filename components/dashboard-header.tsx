"use client"

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { BellIcon, SearchIcon } from "@/components/icons"
import { Input } from "@/components/ui/input"
import { ThemeToggle } from "@/components/theme-toggle"

interface DashboardHeaderProps {
  user?: {
    full_name?: string
    email?: string
    avatar_url?: string
  }
}

export function DashboardHeader({ user }: DashboardHeaderProps) {
  const initials =
    user?.full_name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase() || "U"

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex flex-1">
          <div className="relative w-full max-w-sm">
            <SearchIcon className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search mentors, courses..." className="pl-8" />
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon">
            <BellIcon className="h-4 w-4" />
          </Button>
          <ThemeToggle />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.avatar_url || "/placeholder.svg"} alt={user?.full_name} />
                  <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user?.full_name}</p>
                  <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Sign out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
