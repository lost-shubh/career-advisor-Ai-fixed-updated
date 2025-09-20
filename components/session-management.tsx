"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/hooks/use-toast"
import {
  Calendar,
  Clock,
  Video,
  MessageCircle,
  Bell,
  CheckCircle,
  XCircle,
  AlertCircle,
  Edit,
  Trash2,
  Plus,
  Send,
  Star,
  Users,
  CalendarDays,
  Zap,
} from "lucide-react"
import { format, addDays, addHours, isAfter } from "date-fns"

interface Session {
  id: string
  mentorName: string
  mentorAvatar: string
  sessionType: string
  scheduledAt: string
  duration: number
  status: "upcoming" | "in-progress" | "completed" | "cancelled" | "rescheduled"
  meetingLink?: string
  notes?: string
  price: number
  remindersSent: string[]
  canReschedule: boolean
  canCancel: boolean
}

interface Reminder {
  id: string
  sessionId: string
  type: "email" | "sms" | "push"
  scheduledFor: string
  sent: boolean
  message: string
}

interface SessionManagementProps {
  userId: string
}

export function SessionManagement({ userId }: SessionManagementProps) {
  const [sessions, setSessions] = useState<Session[]>([
    {
      id: "session-1",
      mentorName: "Dr. Priya Sharma",
      mentorAvatar: "/indian-woman-professional-software-engineer.jpg",
      sessionType: "Career Guidance",
      scheduledAt: addHours(new Date(), 2).toISOString(),
      duration: 60,
      status: "upcoming",
      meetingLink: "https://meet.google.com/abc-defg-hij",
      notes: "Discuss NEET preparation strategy and medical career options",
      price: 1500,
      remindersSent: [],
      canReschedule: true,
      canCancel: true,
    },
    {
      id: "session-2",
      mentorName: "Rajesh Kumar",
      mentorAvatar: "/indian-professional-man-data-scientist.jpg",
      sessionType: "Technical Interview Prep",
      scheduledAt: addDays(new Date(), 1).toISOString(),
      duration: 90,
      status: "upcoming",
      notes: "Mock interview for software engineering positions",
      price: 2000,
      remindersSent: ["24h"],
      canReschedule: true,
      canCancel: true,
    },
    {
      id: "session-3",
      mentorName: "Anita Desai",
      mentorAvatar: "/indian-woman-business-product-manager.jpg",
      sessionType: "Business Strategy",
      scheduledAt: addDays(new Date(), -2).toISOString(),
      duration: 60,
      status: "completed",
      notes: "Discussed CA preparation and finance career paths",
      price: 1200,
      remindersSent: ["24h", "1h"],
      canReschedule: false,
      canCancel: false,
    },
  ])

  const [reminders, setReminders] = useState<Reminder[]>([])
  const [activeTab, setActiveTab] = useState("upcoming")
  const [showReminderSettings, setShowReminderSettings] = useState(false)
  const [reminderPreferences, setReminderPreferences] = useState({
    email24h: true,
    email1h: true,
    sms24h: false,
    sms1h: true,
    push24h: true,
    push1h: true,
    customReminders: [],
  })

  const [selectedSession, setSelectedSession] = useState<Session | null>(null)
  const [showReschedule, setShowReschedule] = useState(false)
  const [showCancel, setShowCancel] = useState(false)
  const [showFeedback, setShowFeedback] = useState(false)

  const [rescheduleData, setRescheduleData] = useState({
    date: "",
    time: "",
    reason: "",
  })

  const [cancelData, setCancelData] = useState({
    reason: "",
    refundRequested: false,
  })

  const [feedbackData, setFeedbackData] = useState({
    rating: 0,
    comment: "",
    wouldRecommend: true,
  })

  useEffect(() => {
    // Check for upcoming sessions and send reminders
    checkAndSendReminders()

    // Set up interval to check reminders every minute
    const interval = setInterval(checkAndSendReminders, 60000)
    return () => clearInterval(interval)
  }, [sessions])

  const checkAndSendReminders = () => {
    const now = new Date()

    sessions.forEach((session) => {
      if (session.status !== "upcoming") return

      const sessionTime = new Date(session.scheduledAt)
      const timeDiff = sessionTime.getTime() - now.getTime()
      const hoursUntil = timeDiff / (1000 * 60 * 60)

      // Send 24h reminder
      if (hoursUntil <= 24 && hoursUntil > 23 && !session.remindersSent.includes("24h")) {
        sendReminder(session, "24h")
      }

      // Send 1h reminder
      if (hoursUntil <= 1 && hoursUntil > 0.5 && !session.remindersSent.includes("1h")) {
        sendReminder(session, "1h")
      }

      // Send 15min reminder
      if (hoursUntil <= 0.25 && hoursUntil > 0 && !session.remindersSent.includes("15m")) {
        sendReminder(session, "15m")
      }
    })
  }

  const sendReminder = (session: Session, type: string) => {
    // Update session to mark reminder as sent
    setSessions((prev) =>
      prev.map((s) => (s.id === session.id ? { ...s, remindersSent: [...s.remindersSent, type] } : s)),
    )

    // Show toast notification
    toast({
      title: "Session Reminder",
      description: `Your session with ${session.mentorName} is ${type === "24h" ? "tomorrow" : type === "1h" ? "in 1 hour" : "starting soon"}!`,
    })
  }

  const handleReschedule = async () => {
    if (!selectedSession || !rescheduleData.date || !rescheduleData.time) return

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const newDateTime = new Date(`${rescheduleData.date}T${rescheduleData.time}`)

      setSessions((prev) =>
        prev.map((s) =>
          s.id === selectedSession.id
            ? {
                ...s,
                scheduledAt: newDateTime.toISOString(),
                status: "rescheduled" as const,
                remindersSent: [], // Reset reminders for new time
              }
            : s,
        ),
      )

      setShowReschedule(false)
      setRescheduleData({ date: "", time: "", reason: "" })

      toast({
        title: "Session Rescheduled",
        description: `Your session has been rescheduled to ${format(newDateTime, "MMM dd, yyyy at hh:mm a")}`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reschedule session",
        variant: "destructive",
      })
    }
  }

  const handleCancel = async () => {
    if (!selectedSession) return

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setSessions((prev) => prev.map((s) => (s.id === selectedSession.id ? { ...s, status: "cancelled" as const } : s)))

      setShowCancel(false)
      setCancelData({ reason: "", refundRequested: false })

      toast({
        title: "Session Cancelled",
        description: cancelData.refundRequested
          ? "Your session has been cancelled and refund will be processed within 3-5 business days"
          : "Your session has been cancelled",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to cancel session",
        variant: "destructive",
      })
    }
  }

  const handleFeedback = async () => {
    if (!selectedSession || feedbackData.rating === 0) return

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setShowFeedback(false)
      setFeedbackData({ rating: 0, comment: "", wouldRecommend: true })

      toast({
        title: "Feedback Submitted",
        description: "Thank you for your feedback! It helps us improve our service.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit feedback",
        variant: "destructive",
      })
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "upcoming":
        return <Clock className="w-4 h-4 text-blue-500" />
      case "in-progress":
        return <Zap className="w-4 h-4 text-green-500" />
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case "cancelled":
        return <XCircle className="w-4 h-4 text-red-500" />
      case "rescheduled":
        return <CalendarDays className="w-4 h-4 text-yellow-500" />
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "upcoming":
        return "bg-blue-100 text-blue-800"
      case "in-progress":
        return "bg-green-100 text-green-800"
      case "completed":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      case "rescheduled":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const filterSessions = (status: string) => {
    const now = new Date()
    switch (status) {
      case "upcoming":
        return sessions.filter(
          (s) => (s.status === "upcoming" || s.status === "rescheduled") && isAfter(new Date(s.scheduledAt), now),
        )
      case "completed":
        return sessions.filter((s) => s.status === "completed")
      case "cancelled":
        return sessions.filter((s) => s.status === "cancelled")
      default:
        return sessions
    }
  }

  const getTimeUntilSession = (scheduledAt: string) => {
    const now = new Date()
    const sessionTime = new Date(scheduledAt)
    const diffMs = sessionTime.getTime() - now.getTime()
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))

    if (diffHours > 24) {
      const diffDays = Math.floor(diffHours / 24)
      return `in ${diffDays} day${diffDays > 1 ? "s" : ""}`
    } else if (diffHours > 0) {
      return `in ${diffHours}h ${diffMinutes}m`
    } else if (diffMinutes > 0) {
      return `in ${diffMinutes} minutes`
    } else {
      return "starting now"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Session Management</h2>
          <p className="text-muted-foreground">Manage your mentoring sessions and reminders</p>
        </div>
        <div className="flex items-center gap-2">
          <Dialog open={showReminderSettings} onOpenChange={setShowReminderSettings}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Bell className="w-4 h-4 mr-2" />
                Reminder Settings
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Reminder Preferences</DialogTitle>
                <DialogDescription>Configure when and how you want to receive session reminders</DialogDescription>
              </DialogHeader>
              <div className="space-y-6">
                <div>
                  <h4 className="font-medium mb-3">Email Reminders</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="email24h">24 hours before</Label>
                      <Switch
                        id="email24h"
                        checked={reminderPreferences.email24h}
                        onCheckedChange={(checked) =>
                          setReminderPreferences((prev) => ({ ...prev, email24h: checked }))
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="email1h">1 hour before</Label>
                      <Switch
                        id="email1h"
                        checked={reminderPreferences.email1h}
                        onCheckedChange={(checked) => setReminderPreferences((prev) => ({ ...prev, email1h: checked }))}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3">SMS Reminders</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="sms24h">24 hours before</Label>
                      <Switch
                        id="sms24h"
                        checked={reminderPreferences.sms24h}
                        onCheckedChange={(checked) => setReminderPreferences((prev) => ({ ...prev, sms24h: checked }))}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="sms1h">1 hour before</Label>
                      <Switch
                        id="sms1h"
                        checked={reminderPreferences.sms1h}
                        onCheckedChange={(checked) => setReminderPreferences((prev) => ({ ...prev, sms1h: checked }))}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3">Push Notifications</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="push24h">24 hours before</Label>
                      <Switch
                        id="push24h"
                        checked={reminderPreferences.push24h}
                        onCheckedChange={(checked) => setReminderPreferences((prev) => ({ ...prev, push24h: checked }))}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="push1h">1 hour before</Label>
                      <Switch
                        id="push1h"
                        checked={reminderPreferences.push1h}
                        onCheckedChange={(checked) => setReminderPreferences((prev) => ({ ...prev, push1h: checked }))}
                      />
                    </div>
                  </div>
                </div>

                <Button className="w-full">Save Preferences</Button>
              </div>
            </DialogContent>
          </Dialog>

          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Book New Session
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="upcoming">Upcoming ({filterSessions("upcoming").length})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({filterSessions("completed").length})</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled ({filterSessions("cancelled").length})</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-4">
          {filterSessions("upcoming").length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No upcoming sessions</h3>
                <p className="text-muted-foreground mb-4">Book a session with a mentor to get started</p>
                <Button>Browse Mentors</Button>
              </CardContent>
            </Card>
          ) : (
            filterSessions("upcoming").map((session) => (
              <Card key={session.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={session.mentorAvatar || "/placeholder.svg"} alt={session.mentorName} />
                      <AvatarFallback>
                        {session.mentorName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-lg">{session.mentorName}</h3>
                          <p className="text-muted-foreground">{session.sessionType}</p>
                          <p className="text-sm text-muted-foreground mt-1">
                            {getTimeUntilSession(session.scheduledAt)}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(session.status)}
                          <Badge className={getStatusColor(session.status)}>
                            {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
                          </Badge>
                        </div>
                      </div>

                      <div className="flex items-center gap-6 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>{format(new Date(session.scheduledAt), "MMM dd, yyyy")}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>
                            {format(new Date(session.scheduledAt), "hh:mm a")} ({session.duration} min)
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="font-medium">₹{session.price.toLocaleString()}</span>
                        </div>
                      </div>

                      {session.notes && (
                        <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">{session.notes}</p>
                      )}

                      <div className="flex items-center gap-2 flex-wrap">
                        {session.meetingLink && (
                          <Button size="sm">
                            <Video className="w-4 h-4 mr-1" />
                            Join Session
                          </Button>
                        )}

                        <Button variant="outline" size="sm">
                          <MessageCircle className="w-4 h-4 mr-1" />
                          Message Mentor
                        </Button>

                        {session.canReschedule && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedSession(session)
                              setShowReschedule(true)
                            }}
                          >
                            <Edit className="w-4 h-4 mr-1" />
                            Reschedule
                          </Button>
                        )}

                        {session.canCancel && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedSession(session)
                              setShowCancel(true)
                            }}
                          >
                            <Trash2 className="w-4 h-4 mr-1" />
                            Cancel
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

        <TabsContent value="completed" className="space-y-4">
          {filterSessions("completed").map((session) => (
            <Card key={session.id} className="opacity-75">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={session.mentorAvatar || "/placeholder.svg"} alt={session.mentorName} />
                    <AvatarFallback>
                      {session.mentorName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold">{session.mentorName}</h3>
                        <p className="text-muted-foreground text-sm">{session.sessionType}</p>
                      </div>
                      <Badge className={getStatusColor(session.status)}>Completed</Badge>
                    </div>

                    <div className="flex items-center gap-6 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{format(new Date(session.scheduledAt), "MMM dd, yyyy")}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>
                          {format(new Date(session.scheduledAt), "hh:mm a")} ({session.duration} min)
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedSession(session)
                          setShowFeedback(true)
                        }}
                      >
                        <Star className="w-4 h-4 mr-1" />
                        Leave Review
                      </Button>
                      <Button variant="outline" size="sm">
                        <Users className="w-4 h-4 mr-1" />
                        Book Again
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="cancelled" className="space-y-4">
          {filterSessions("cancelled").map((session) => (
            <Card key={session.id} className="opacity-60">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={session.mentorAvatar || "/placeholder.svg"} alt={session.mentorName} />
                    <AvatarFallback>
                      {session.mentorName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold">{session.mentorName}</h3>
                        <p className="text-muted-foreground text-sm">{session.sessionType}</p>
                      </div>
                      <Badge className={getStatusColor(session.status)}>Cancelled</Badge>
                    </div>

                    <div className="flex items-center gap-6 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{format(new Date(session.scheduledAt), "MMM dd, yyyy")}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>
                          {format(new Date(session.scheduledAt), "hh:mm a")} ({session.duration} min)
                        </span>
                      </div>
                    </div>

                    <Button variant="outline" size="sm">
                      <Users className="w-4 h-4 mr-1" />
                      Book Again
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>

      {/* Reschedule Dialog */}
      <Dialog open={showReschedule} onOpenChange={setShowReschedule}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Reschedule Session</DialogTitle>
            <DialogDescription>
              Choose a new date and time for your session with {selectedSession?.mentorName}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="reschedule-date">New Date</Label>
              <Input
                id="reschedule-date"
                type="date"
                value={rescheduleData.date}
                onChange={(e) => setRescheduleData((prev) => ({ ...prev, date: e.target.value }))}
                min={format(new Date(), "yyyy-MM-dd")}
              />
            </div>
            <div>
              <Label htmlFor="reschedule-time">New Time</Label>
              <Select
                value={rescheduleData.time}
                onValueChange={(value) => setRescheduleData((prev) => ({ ...prev, time: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select time" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 20 }, (_, i) => {
                    const hour = Math.floor(i / 2) + 9
                    const minute = i % 2 === 0 ? "00" : "30"
                    const time = `${hour.toString().padStart(2, "0")}:${minute}`
                    return (
                      <SelectItem key={time} value={time}>
                        {time}
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="reschedule-reason">Reason for Rescheduling</Label>
              <Textarea
                id="reschedule-reason"
                placeholder="Optional: Let your mentor know why you need to reschedule"
                value={rescheduleData.reason}
                onChange={(e) => setRescheduleData((prev) => ({ ...prev, reason: e.target.value }))}
                rows={3}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowReschedule(false)}>
                Cancel
              </Button>
              <Button onClick={handleReschedule}>Reschedule Session</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Cancel Dialog */}
      <Dialog open={showCancel} onOpenChange={setShowCancel}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Cancel Session</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel your session with {selectedSession?.mentorName}?
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="cancel-reason">Reason for Cancellation</Label>
              <Select
                value={cancelData.reason}
                onValueChange={(value) => setCancelData((prev) => ({ ...prev, reason: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select reason" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="schedule-conflict">Schedule Conflict</SelectItem>
                  <SelectItem value="emergency">Emergency</SelectItem>
                  <SelectItem value="no-longer-needed">No Longer Needed</SelectItem>
                  <SelectItem value="technical-issues">Technical Issues</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="refund-requested"
                checked={cancelData.refundRequested}
                onCheckedChange={(checked) => setCancelData((prev) => ({ ...prev, refundRequested: checked }))}
              />
              <Label htmlFor="refund-requested">Request refund</Label>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">
                <strong>Cancellation Policy:</strong> Free cancellation up to 24 hours before the session. Cancellations
                within 24 hours may incur a 50% fee.
              </p>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowCancel(false)}>
                Keep Session
              </Button>
              <Button variant="destructive" onClick={handleCancel}>
                Cancel Session
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Feedback Dialog */}
      <Dialog open={showFeedback} onOpenChange={setShowFeedback}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Session Feedback</DialogTitle>
            <DialogDescription>How was your session with {selectedSession?.mentorName}?</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Rating</Label>
              <div className="flex items-center gap-1 mt-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setFeedbackData((prev) => ({ ...prev, rating: star }))}
                    className="p-1"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        star <= feedbackData.rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <Label htmlFor="feedback-comment">Your Feedback</Label>
              <Textarea
                id="feedback-comment"
                placeholder="Share your experience with this session..."
                value={feedbackData.comment}
                onChange={(e) => setFeedbackData((prev) => ({ ...prev, comment: e.target.value }))}
                rows={4}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="would-recommend"
                checked={feedbackData.wouldRecommend}
                onCheckedChange={(checked) => setFeedbackData((prev) => ({ ...prev, wouldRecommend: checked }))}
              />
              <Label htmlFor="would-recommend">Would you recommend this mentor to others?</Label>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowFeedback(false)}>
                Skip
              </Button>
              <Button onClick={handleFeedback} disabled={feedbackData.rating === 0}>
                <Send className="w-4 h-4 mr-2" />
                Submit Feedback
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
