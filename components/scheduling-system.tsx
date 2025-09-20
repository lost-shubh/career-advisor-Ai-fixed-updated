"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Clock, Users, Video, Plus, Edit, Trash2, CheckCircle, Star } from "lucide-react"

interface SchedulingSystemProps {
  userData: any
}

const upcomingEvents = [
  {
    id: 1,
    title: "Career Counseling Session",
    type: "counseling",
    date: "2024-01-15",
    time: "10:00 AM",
    duration: "60 min",
    mentor: "Dr. Sarah Johnson",
    location: "Video Call",
    status: "confirmed",
  },
  {
    id: 2,
    title: "Mock Interview - Software Engineer",
    type: "interview",
    date: "2024-01-17",
    time: "2:00 PM",
    duration: "45 min",
    mentor: "Raj Patel",
    location: "Video Call",
    status: "pending",
  },
  {
    id: 3,
    title: "Resume Review Workshop",
    type: "workshop",
    date: "2024-01-20",
    time: "11:00 AM",
    duration: "90 min",
    mentor: "Lisa Chen",
    location: "Online",
    status: "confirmed",
  },
]

const availableMentors = [
  {
    id: 1,
    name: "Dr. Sarah Johnson",
    type: "counselor",
    expertise: "Career Counseling",
    rating: 4.9,
    experience: "10+ years",
    avatar: "SJ",
    specialties: ["Career Planning", "Industry Insights", "Goal Setting"],
    fields: ["General", "Healthcare", "Technology", "Business"],
  },
  {
    id: 2,
    name: "Dr. Priya Sharma",
    type: "mentor",
    expertise: "Medical Career Guidance",
    rating: 4.8,
    experience: "15 years",
    avatar: "PS",
    specialties: ["NEET Preparation", "Medical College Selection", "Specialization Guidance"],
    fields: ["Healthcare", "Medical", "Research"],
  },
  {
    id: 3,
    name: "Raj Patel",
    type: "mentor",
    expertise: "Software Engineering",
    rating: 4.8,
    experience: "8 years",
    avatar: "RP",
    specialties: ["Technical Interviews", "Coding Skills", "Career Growth"],
    fields: ["Technology", "Software", "Engineering"],
  },
  {
    id: 4,
    name: "Lisa Chen",
    type: "counselor",
    expertise: "Resume & LinkedIn",
    rating: 4.9,
    experience: "6 years",
    avatar: "LC",
    specialties: ["Resume Writing", "LinkedIn Optimization", "Personal Branding"],
    fields: ["General", "Marketing", "Business"],
  },
  {
    id: 5,
    name: "Dr. Amit Kumar",
    type: "mentor",
    expertise: "Medical Research",
    rating: 4.7,
    experience: "12 years",
    avatar: "AK",
    specialties: ["Research Methodology", "Publication Guidance", "PhD Mentoring"],
    fields: ["Healthcare", "Research", "Academia"],
  },
  {
    id: 6,
    name: "Neha Gupta",
    type: "counselor",
    expertise: "Psychology & Counseling",
    rating: 4.9,
    experience: "8 years",
    avatar: "NG",
    specialties: ["Career Anxiety", "Decision Making", "Stress Management"],
    fields: ["General", "Psychology", "Mental Health"],
  },
  {
    id: 7,
    name: "Dr. Kavya Nair",
    type: "counselor",
    expertise: "Psychology & Mental Health",
    rating: 4.9,
    experience: "12 years",
    avatar: "KN",
    specialties: ["Career Anxiety", "Academic Stress", "Confidence Building"],
    fields: ["General", "Psychology", "Mental Health", "Academic"],
  },
  {
    id: 8,
    name: "Rohit Sharma",
    type: "counselor",
    expertise: "Civil Services Guidance",
    rating: 4.8,
    experience: "15 years",
    avatar: "RS",
    specialties: ["UPSC Preparation", "Career Planning", "Goal Setting"],
    fields: ["General", "Government", "Public Service"],
  },
  {
    id: 9,
    name: "Sneha Agarwal",
    type: "counselor",
    expertise: "Finance & CA Guidance",
    rating: 4.7,
    experience: "10 years",
    avatar: "SA",
    specialties: ["CA Preparation", "Finance Career", "Academic Planning"],
    fields: ["Commerce", "Finance", "Accounting"],
  },
  {
    id: 10,
    name: "Pooja Mehta",
    type: "counselor",
    expertise: "Creative Career Guidance",
    rating: 4.6,
    experience: "9 years",
    avatar: "PM",
    specialties: ["Creative Careers", "Portfolio Development", "Skill Building"],
    fields: ["Arts", "Design", "Creative"],
  },
]

export function SchedulingSystem({ userData }: SchedulingSystemProps) {
  const [showBookingForm, setShowBookingForm] = useState(false)
  const [selectedMentor, setSelectedMentor] = useState<any>(null)
  const [filterType, setFilterType] = useState<string>("all")
  const [bookingData, setBookingData] = useState({
    type: "",
    date: "",
    time: "",
    duration: "60",
    topic: "",
    description: "",
    mentorId: "",
    sessionFormat: "video",
  })

  const filteredMentors = availableMentors.filter((mentor) => {
    if (filterType === "all") return true
    if (filterType === "mentor") return mentor.type === "mentor"
    if (filterType === "counselor") return mentor.type === "counselor"

    // Filter by user's career field
    const userField = userData.careerField?.toLowerCase() || ""
    if (userField.includes("medical") || userField.includes("healthcare")) {
      return mentor.fields.some(
        (field) =>
          field.toLowerCase().includes("healthcare") ||
          field.toLowerCase().includes("medical") ||
          field.toLowerCase().includes("research"),
      )
    }

    return true
  })

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case "counseling":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-200"
      case "interview":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-200"
      case "workshop":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-200"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200"
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-200"
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-200"
    }
  }

  const handleBookSession = () => {
    // Handle booking logic here
    console.log("Booking session:", bookingData)
    setShowBookingForm(false)
    // Reset form
    setBookingData({
      type: "",
      date: "",
      time: "",
      duration: "60",
      topic: "",
      description: "",
      mentorId: "",
      sessionFormat: "video",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Schedule & Mentorship
          </h2>
          <p className="text-muted-foreground mt-1">Book sessions with industry experts and track your appointments</p>
        </div>
        <Button onClick={() => setShowBookingForm(true)} className="btn-enhanced">
          <Plus className="w-4 h-4 mr-2" />
          Book Session
        </Button>
      </div>

      {/* Upcoming Events */}
      <Card className="card-enhanced">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            Upcoming Sessions
          </CardTitle>
          <CardDescription>Your scheduled mentorship and learning sessions</CardDescription>
        </CardHeader>
        <CardContent>
          {upcomingEvents.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No upcoming sessions</p>
              <p className="text-sm">Book your first session to get started</p>
            </div>
          ) : (
            <div className="space-y-4">
              {upcomingEvents.map((event) => (
                <Card key={event.id} className="p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-foreground">{event.title}</h3>
                        <Badge className={getEventTypeColor(event.type)}>{event.type}</Badge>
                        <Badge className={getStatusColor(event.status)}>{event.status}</Badge>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span className="text-foreground">{event.date}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span className="text-foreground">
                            {event.time} ({event.duration})
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          <span className="text-foreground">{event.mentor}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Video className="w-4 h-4" />
                          <span className="text-foreground">{event.location}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="card-enhanced">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                Available Mentors & Counselors
              </CardTitle>
              <CardDescription>Connect with industry experts for personalized guidance</CardDescription>
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Experts</SelectItem>
                <SelectItem value="mentor">Mentors Only</SelectItem>
                <SelectItem value="counselor">Counselors Only</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredMentors.map((mentor) => (
              <Card key={mentor.id} className="p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center font-semibold text-primary">
                    {mentor.avatar}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-foreground">{mentor.name}</h3>
                      <Badge variant={mentor.type === "mentor" ? "default" : "secondary"}>{mentor.type}</Badge>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="text-sm text-muted-foreground">{mentor.rating}</span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {mentor.expertise} • {mentor.experience}
                    </p>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {mentor.specialties.map((specialty, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                    <Button
                      size="sm"
                      onClick={() => {
                        setSelectedMentor(mentor)
                        setBookingData((prev) => ({ ...prev, mentorId: mentor.id.toString() }))
                        setShowBookingForm(true)
                      }}
                      className="btn-enhanced"
                    >
                      Book Session
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Booking Form Modal */}
      {showBookingForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>Book a Session</CardTitle>
              <CardDescription>
                {selectedMentor ? `Schedule a session with ${selectedMentor.name}` : "Choose your session details"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="type">Session Type</Label>
                  <Select
                    value={bookingData.type}
                    onValueChange={(value) => setBookingData((prev) => ({ ...prev, type: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select session type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="counseling">Career Counseling</SelectItem>
                      <SelectItem value="interview">Mock Interview</SelectItem>
                      <SelectItem value="resume">Resume Review</SelectItem>
                      <SelectItem value="workshop">Skill Workshop</SelectItem>
                      <SelectItem value="guidance">Academic Guidance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="duration">Duration</Label>
                  <Select
                    value={bookingData.duration}
                    onValueChange={(value) => setBookingData((prev) => ({ ...prev, duration: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="60">60 minutes</SelectItem>
                      <SelectItem value="90">90 minutes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="date">Preferred Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={bookingData.date}
                    onChange={(e) => setBookingData((prev) => ({ ...prev, date: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="time">Preferred Time</Label>
                  <Input
                    id="time"
                    type="time"
                    value={bookingData.time}
                    onChange={(e) => setBookingData((prev) => ({ ...prev, time: e.target.value }))}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="sessionFormat">Session Format</Label>
                <Select
                  value={bookingData.sessionFormat}
                  onValueChange={(value) => setBookingData((prev) => ({ ...prev, sessionFormat: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="video">Video Call</SelectItem>
                    <SelectItem value="phone">Phone Call</SelectItem>
                    <SelectItem value="chat">Text Chat</SelectItem>
                    <SelectItem value="inperson">In-Person (if available)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="topic">Session Topic</Label>
                <Input
                  id="topic"
                  placeholder="What would you like to focus on?"
                  value={bookingData.topic}
                  onChange={(e) => setBookingData((prev) => ({ ...prev, topic: e.target.value }))}
                />
              </div>

              <div>
                <Label htmlFor="description">Additional Details</Label>
                <Textarea
                  id="description"
                  placeholder="Any specific questions or areas you'd like to discuss..."
                  value={bookingData.description}
                  onChange={(e) => setBookingData((prev) => ({ ...prev, description: e.target.value }))}
                  rows={3}
                />
              </div>

              <div className="flex gap-2 pt-4">
                <Button onClick={handleBookSession} className="flex-1">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Book Session
                </Button>
                <Button variant="outline" onClick={() => setShowBookingForm(false)}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="text-center p-4">
          <div className="text-2xl font-bold text-blue-500">3</div>
          <div className="text-sm text-muted-foreground">Upcoming Sessions</div>
        </Card>
        <Card className="text-center p-4">
          <div className="text-2xl font-bold text-green-500">12</div>
          <div className="text-sm text-muted-foreground">Completed Sessions</div>
        </Card>
        <Card className="text-center p-4">
          <div className="text-2xl font-bold text-purple-500">4.8</div>
          <div className="text-sm text-muted-foreground">Average Rating</div>
        </Card>
        <Card className="text-center p-4">
          <div className="text-2xl font-bold text-orange-500">8</div>
          <div className="text-sm text-muted-foreground">Hours This Month</div>
        </Card>
      </div>
    </div>
  )
}
