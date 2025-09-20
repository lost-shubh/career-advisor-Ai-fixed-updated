import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, MessageSquare, TrendingUp, Users, BookOpen } from "lucide-react"
import Link from "next/link"

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user?.id).single()

  // Get recent bookings
  const { data: recentBookings } = await supabase
    .from("bookings")
    .select(`
      *,
      mentor:mentors(
        id,
        profile:profiles(full_name, specialization)
      )
    `)
    .eq("student_id", user?.id)
    .order("created_at", { ascending: false })
    .limit(3)

  // Get curriculum progress
  const { data: curriculum } = await supabase.from("curriculum").select("*").limit(4)

  const getRoleSpecificCards = () => {
    switch (profile?.role) {
      case "student":
        return [
          {
            title: "Upcoming Sessions",
            description: "Your scheduled mentoring sessions",
            value: recentBookings?.length || 0,
            icon: Calendar,
            href: "/dashboard/bookings",
          },
          {
            title: "AI Chat Sessions",
            description: "Get instant career guidance",
            value: "Available",
            icon: MessageSquare,
            href: "/dashboard/chat",
          },
          {
            title: "Learning Progress",
            description: "Track your skill development",
            value: "75%",
            icon: TrendingUp,
            href: "/dashboard/progress",
          },
          {
            title: "Available Mentors",
            description: "Connect with industry experts",
            value: "50+",
            icon: Users,
            href: "/dashboard/mentors",
          },
        ]
      case "mentor":
        return [
          {
            title: "Student Sessions",
            description: "Your mentoring appointments",
            value: "12",
            icon: Calendar,
            href: "/dashboard/bookings",
          },
          {
            title: "Messages",
            description: "Student conversations",
            value: "8",
            icon: MessageSquare,
            href: "/dashboard/chat",
          },
          {
            title: "Rating",
            description: "Your mentor rating",
            value: "4.8",
            icon: TrendingUp,
            href: "/dashboard/profile",
          },
          {
            title: "Total Students",
            description: "Students you've helped",
            value: "156",
            icon: Users,
            href: "/dashboard/students",
          },
        ]
      case "counselor":
        return [
          {
            title: "Active Students",
            description: "Students under guidance",
            value: "24",
            icon: Users,
            href: "/dashboard/students",
          },
          {
            title: "Curriculum Plans",
            description: "Learning paths created",
            value: "8",
            icon: BookOpen,
            href: "/dashboard/curriculum",
          },
          {
            title: "Sessions This Week",
            description: "Counseling appointments",
            value: "18",
            icon: Calendar,
            href: "/dashboard/bookings",
          },
          {
            title: "Progress Reports",
            description: "Student assessments",
            value: "12",
            icon: TrendingUp,
            href: "/dashboard/reports",
          },
        ]
      default:
        return []
    }
  }

  const cards = getRoleSpecificCards()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Welcome back, {profile?.full_name}!</h1>
        <p className="text-muted-foreground">Here&apos;s what&apos;s happening with your career journey today.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {cards.map((card, index) => (
          <Card key={index} className="card-enhanced">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
              <card.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
              <p className="text-xs text-muted-foreground">{card.description}</p>
              <Button asChild variant="ghost" size="sm" className="mt-2 p-0 h-auto">
                <Link href={card.href}>View details →</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your latest interactions and updates</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentBookings?.map((booking) => (
              <div key={booking.id} className="flex items-center space-x-4">
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">Session with {booking.mentor?.profile?.full_name}</p>
                  <p className="text-sm text-muted-foreground">{new Date(booking.session_date).toLocaleDateString()}</p>
                </div>
                <Badge variant={booking.status === "confirmed" ? "default" : "secondary"}>{booking.status}</Badge>
              </div>
            ))}
            {(!recentBookings || recentBookings.length === 0) && (
              <p className="text-sm text-muted-foreground">No recent bookings</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recommended Courses</CardTitle>
            <CardDescription>Courses tailored to your career goals</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {curriculum?.map((course) => (
              <div key={course.id} className="flex items-center space-x-4">
                <BookOpen className="h-8 w-8 text-primary" />
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">{course.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {course.field} • {course.duration_weeks} weeks
                  </p>
                </div>
                <Badge variant="outline">{course.level}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
