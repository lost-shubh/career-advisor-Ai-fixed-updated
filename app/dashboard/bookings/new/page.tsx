"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { CalendarDays, Clock, CreditCard, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { addDays, setHours, setMinutes } from "date-fns"

interface Mentor {
  id: string
  profile: {
    full_name: string
    bio: string
    skills: string[]
    location: string
    avatar_url?: string
  }
  specialization: string[]
  hourly_rate: number
  availability: string
  rating: number
  total_sessions: number
}

export default function NewBookingPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const mentorId = searchParams.get("mentor")

  const [mentor, setMentor] = useState<Mentor | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [selectedTime, setSelectedTime] = useState("")
  const [duration, setDuration] = useState("60")
  const [sessionType, setSessionType] = useState("career-guidance")
  const [description, setDescription] = useState("")
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (mentorId) {
      fetchMentor()
    }
  }, [mentorId])

  const fetchMentor = async () => {
    const supabase = createClient()

    const { data, error } = await supabase
      .from("mentors")
      .select(`
        *,
        profile:profiles(
          full_name,
          bio,
          skills,
          location,
          avatar_url
        )
      `)
      .eq("id", mentorId)
      .single()

    if (error) {
      console.error("Error fetching mentor:", error)
    } else {
      setMentor(data)
    }
    setLoading(false)
  }

  const getAvailableTimeSlots = () => {
    // Generate time slots from 9 AM to 6 PM
    const slots = []
    for (let hour = 9; hour <= 18; hour++) {
      slots.push(`${hour.toString().padStart(2, "0")}:00`)
      if (hour < 18) {
        slots.push(`${hour.toString().padStart(2, "0")}:30`)
      }
    }
    return slots
  }

  const calculateTotal = () => {
    if (!mentor) return 0
    const hours = Number.parseInt(duration) / 60
    return mentor.hourly_rate * hours
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!mentor || !selectedDate || !selectedTime) return

    setSubmitting(true)

    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      router.push("/auth/login")
      return
    }

    // Create the booking datetime
    const [hours, minutes] = selectedTime.split(":").map(Number)
    const bookingDateTime = setMinutes(setHours(selectedDate, hours), minutes)

    const bookingData = {
      student_id: user.id,
      mentor_id: mentor.id,
      scheduled_at: bookingDateTime.toISOString(),
      duration_minutes: Number.parseInt(duration),
      session_type: sessionType,
      description,
      status: "pending",
      total_amount: calculateTotal(),
    }

    const { error } = await supabase.from("bookings").insert([bookingData])

    if (error) {
      console.error("Error creating booking:", error)
      alert("Failed to create booking. Please try again.")
    } else {
      router.push("/dashboard/bookings?success=true")
    }

    setSubmitting(false)
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-muted rounded w-1/2"></div>
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="animate-pulse h-96 bg-muted rounded-lg"></div>
          <div className="animate-pulse h-96 bg-muted rounded-lg"></div>
        </div>
      </div>
    )
  }

  if (!mentor) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold mb-4">Mentor not found</h1>
        <Button asChild>
          <Link href="/dashboard/mentors">Browse Mentors</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" asChild>
          <Link href="/dashboard/mentors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Mentors
          </Link>
        </Button>
      </div>

      <div>
        <h1 className="text-3xl font-bold tracking-tight">Book a Session</h1>
        <p className="text-muted-foreground">Schedule your mentoring session</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Mentor Info */}
        <Card>
          <CardHeader>
            <CardTitle>Session with</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-start gap-4 mb-6">
              <Avatar className="w-16 h-16">
                <AvatarImage src={mentor.profile.avatar_url || "/placeholder.svg"} />
                <AvatarFallback className="text-lg">
                  {mentor.profile.full_name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="text-xl font-semibold mb-1">{mentor.profile.full_name}</h3>
                <p className="text-muted-foreground text-sm mb-3">{mentor.profile.bio}</p>
                <div className="flex flex-wrap gap-1">
                  {mentor.specialization.slice(0, 3).map((spec, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {spec}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            <Separator className="mb-6" />

            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Hourly Rate</span>
                <span className="font-medium">₹{mentor.hourly_rate.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Rating</span>
                <span className="font-medium">{mentor.rating.toFixed(1)}/5.0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Sessions</span>
                <span className="font-medium">{mentor.total_sessions}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Booking Form */}
        <Card>
          <CardHeader>
            <CardTitle>Session Details</CardTitle>
            <CardDescription>Choose your preferred date, time, and session type</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Date Selection */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <CalendarDays className="w-4 h-4" />
                  Select Date
                </Label>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  disabled={(date) => date < new Date() || date < addDays(new Date(), -1)}
                  className="rounded-md border"
                />
              </div>

              {/* Time Selection */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Select Time
                </Label>
                <Select value={selectedTime} onValueChange={setSelectedTime}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a time slot" />
                  </SelectTrigger>
                  <SelectContent>
                    {getAvailableTimeSlots().map((time) => (
                      <SelectItem key={time} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Duration */}
              <div className="space-y-2">
                <Label>Session Duration</Label>
                <Select value={duration} onValueChange={setDuration}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="60">1 hour</SelectItem>
                    <SelectItem value="90">1.5 hours</SelectItem>
                    <SelectItem value="120">2 hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Session Type */}
              <div className="space-y-2">
                <Label>Session Type</Label>
                <Select value={sessionType} onValueChange={setSessionType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="career-guidance">Career Guidance</SelectItem>
                    <SelectItem value="skill-development">Skill Development</SelectItem>
                    <SelectItem value="interview-prep">Interview Preparation</SelectItem>
                    <SelectItem value="resume-review">Resume Review</SelectItem>
                    <SelectItem value="portfolio-review">Portfolio Review</SelectItem>
                    <SelectItem value="general-mentoring">General Mentoring</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label>Session Description</Label>
                <Textarea
                  placeholder="Describe what you'd like to discuss or achieve in this session..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                />
              </div>

              <Separator />

              {/* Pricing Summary */}
              <div className="space-y-3 bg-muted/50 p-4 rounded-lg">
                <h4 className="font-semibold flex items-center gap-2">
                  <CreditCard className="w-4 h-4" />
                  Pricing Summary
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Duration</span>
                    <span>{Number.parseInt(duration)} minutes</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Rate</span>
                    <span>₹{mentor.hourly_rate.toLocaleString()}/hour</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>₹{calculateTotal().toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={!selectedDate || !selectedTime || submitting}
              >
                {submitting ? "Creating Booking..." : "Book Session"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
