"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Calendar, Clock, Video, MessageSquare, CheckCircle, XCircle, AlertCircle } from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"

interface Booking {
  id: string
  scheduled_at: string
  duration_minutes: number
  session_type: string
  description: string
  status: string
  total_amount: number
  created_at: string
  mentor: {
    profile: {
      full_name: string
      avatar_url?: string
    }
    specialization: string[]
  }
}

export default function BookingsPage() {
  const searchParams = useSearchParams()
  const showSuccess = searchParams.get("success") === "true"

  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("upcoming")

  useEffect(() => {
    fetchBookings()
  }, [])

  const fetchBookings = async () => {
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return

    const { data, error } = await supabase
      .from("bookings")
      .select(`
        *,
        mentor:mentors(
          profile:profiles(
            full_name,
            avatar_url
          ),
          specialization
        )
      `)
      .eq("student_id", user.id)
      .order("scheduled_at", { ascending: false })

    if (error) {
      console.error("Error fetching bookings:", error)
    } else {
      setBookings(data || [])
    }
    setLoading(false)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmed":
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case "pending":
        return <AlertCircle className="w-4 h-4 text-yellow-500" />
      case "cancelled":
        return <XCircle className="w-4 h-4 text-red-500" />
      case "completed":
        return <CheckCircle className="w-4 h-4 text-blue-500" />
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      case "completed":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const filterBookings = (status: string) => {
    const now = new Date()
    switch (status) {
      case "upcoming":
        return bookings.filter((booking) => new Date(booking.scheduled_at) > now && booking.status !== "cancelled")
      case "past":
        return bookings.filter((booking) => new Date(booking.scheduled_at) <= now || booking.status === "completed")
      case "cancelled":
        return bookings.filter((booking) => booking.status === "cancelled")
      default:
        return bookings
    }
  }

  const formatSessionType = (type: string) => {
    return type
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-muted rounded w-1/2"></div>
        </div>
        <div className="grid gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse h-32 bg-muted rounded-lg"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {showSuccess && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            Your booking has been created successfully! You'll receive a confirmation email shortly.
          </AlertDescription>
        </Alert>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Bookings</h1>
          <p className="text-muted-foreground">Manage your mentoring sessions</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/mentors">
            <Calendar className="w-4 h-4 mr-2" />
            Book New Session
          </Link>
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="upcoming">Upcoming ({filterBookings("upcoming").length})</TabsTrigger>
          <TabsTrigger value="past">Past ({filterBookings("past").length})</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled ({filterBookings("cancelled").length})</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-4">
          {filterBookings("upcoming").length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No upcoming sessions</h3>
                <p className="text-muted-foreground mb-4">Book a session with a mentor to get started</p>
                <Button asChild>
                  <Link href="/dashboard/mentors">Browse Mentors</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            filterBookings("upcoming").map((booking) => (
              <Card key={booking.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={booking.mentor.profile.avatar_url || "/placeholder.svg"} />
                      <AvatarFallback>
                        {booking.mentor.profile.full_name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-lg">{booking.mentor.profile.full_name}</h3>
                          <p className="text-muted-foreground">{formatSessionType(booking.session_type)}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(booking.status)}
                          <Badge className={getStatusColor(booking.status)}>
                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                          </Badge>
                        </div>
                      </div>

                      <div className="flex items-center gap-6 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>{format(new Date(booking.scheduled_at), "MMM dd, yyyy")}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>
                            {format(new Date(booking.scheduled_at), "hh:mm a")} ({booking.duration_minutes} min)
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="font-medium">₹{booking.total_amount.toLocaleString()}</span>
                        </div>
                      </div>

                      {booking.description && (
                        <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
                          {booking.description}
                        </p>
                      )}

                      <div className="flex items-center gap-2">
                        {booking.status === "confirmed" && (
                          <>
                            <Button size="sm">
                              <Video className="w-4 h-4 mr-1" />
                              Join Session
                            </Button>
                            <Button variant="outline" size="sm">
                              <MessageSquare className="w-4 h-4 mr-1" />
                              Message Mentor
                            </Button>
                          </>
                        )}
                        {booking.status === "pending" && (
                          <Button variant="outline" size="sm">
                            Cancel Booking
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="past" className="space-y-4">
          {filterBookings("past").length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Clock className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No past sessions</h3>
                <p className="text-muted-foreground">Your completed sessions will appear here</p>
              </CardContent>
            </Card>
          ) : (
            filterBookings("past").map((booking) => (
              <Card key={booking.id} className="opacity-75">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={booking.mentor.profile.avatar_url || "/placeholder.svg"} />
                      <AvatarFallback>
                        {booking.mentor.profile.full_name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold">{booking.mentor.profile.full_name}</h3>
                          <p className="text-muted-foreground text-sm">{formatSessionType(booking.session_type)}</p>
                        </div>
                        <Badge className={getStatusColor(booking.status)}>
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </Badge>
                      </div>

                      <div className="flex items-center gap-6 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>{format(new Date(booking.scheduled_at), "MMM dd, yyyy")}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>
                            {format(new Date(booking.scheduled_at), "hh:mm a")} ({booking.duration_minutes} min)
                          </span>
                        </div>
                      </div>

                      {booking.status === "completed" && (
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">
                            Leave Review
                          </Button>
                          <Button variant="outline" size="sm">
                            Book Again
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="cancelled" className="space-y-4">
          {filterBookings("cancelled").length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <XCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No cancelled sessions</h3>
                <p className="text-muted-foreground">Your cancelled sessions will appear here</p>
              </CardContent>
            </Card>
          ) : (
            filterBookings("cancelled").map((booking) => (
              <Card key={booking.id} className="opacity-60">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={booking.mentor.profile.avatar_url || "/placeholder.svg"} />
                      <AvatarFallback>
                        {booking.mentor.profile.full_name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold">{booking.mentor.profile.full_name}</h3>
                          <p className="text-muted-foreground text-sm">{formatSessionType(booking.session_type)}</p>
                        </div>
                        <Badge className={getStatusColor(booking.status)}>Cancelled</Badge>
                      </div>

                      <div className="flex items-center gap-6 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>{format(new Date(booking.scheduled_at), "MMM dd, yyyy")}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>
                            {format(new Date(booking.scheduled_at), "hh:mm a")} ({booking.duration_minutes} min)
                          </span>
                        </div>
                      </div>

                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/dashboard/bookings/new?mentor=${booking.mentor.id}`}>Book Again</Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
