import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
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
import {
  Star,
  Clock,
  Calendar,
  Award,
  Languages,
  CheckCircle,
  Video,
  Phone,
  MessageCircle,
  Send,
  CalendarDays,
  Users,
  BookOpen,
  Trophy,
} from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { getMentorById } from "@/lib/mentor-data"

interface MentorProfileProps {
  params: Promise<{ id: string }>
}

export default async function MentorProfilePage({ params }: MentorProfileProps) {
  const { id } = await params

  const mentor = getMentorById(id)

  if (!mentor) {
    notFound()
  }

  // Mock feedback data for demonstration
  const feedback = [
    {
      id: 1,
      rating: 5,
      comment:
        "Excellent guidance on career planning. Dr. Sharma helped me understand the medical field better and gave me a clear roadmap for NEET preparation.",
      from_user: { full_name: "Rahul Sharma" },
      created_at: "2024-01-15T10:30:00Z",
    },
    {
      id: 2,
      rating: 5,
      comment:
        "Very knowledgeable and patient. The session was extremely helpful in clarifying my doubts about medical entrance exams.",
      from_user: { full_name: "Priya Patel" },
      created_at: "2024-01-10T14:20:00Z",
    },
    {
      id: 3,
      rating: 4,
      comment: "Great mentor with practical insights. Helped me create a study schedule that actually works for me.",
      from_user: { full_name: "Amit Kumar" },
      created_at: "2024-01-05T16:45:00Z",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" asChild>
          <Link href="/dashboard/mentors">← Back to Mentors</Link>
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Profile */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-start gap-6">
                <Avatar className="w-24 h-24">
                  <AvatarImage src={mentor.photo || "/placeholder.svg"} alt={mentor.name} />
                  <AvatarFallback className="text-2xl">
                    {mentor.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl font-bold">{mentor.name}</h1>
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      Verified
                    </Badge>
                  </div>

                  <p className="text-xl text-muted-foreground mb-4">{mentor.title}</p>

                  <div className="flex items-center gap-6 text-muted-foreground mb-4">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{mentor.rating.toFixed(1)}</span>
                      <span>({mentor.reviews} reviews)</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Award className="w-4 h-4" />
                      <span>{mentor.experience} experience</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>{mentor.reviews * 2} students mentored</span>
                    </div>
                  </div>

                  <p className="text-muted-foreground mb-6 leading-relaxed">{mentor.bio}</p>

                  <div className="flex flex-wrap gap-3">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="lg" className="flex items-center gap-2">
                          <Video className="w-4 h-4" />
                          Video Call Session
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                          <DialogTitle>Schedule Video Call</DialogTitle>
                          <DialogDescription>Book a video call session with {mentor.name}</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="date">Preferred Date</Label>
                            <Input type="date" id="date" />
                          </div>
                          <div>
                            <Label htmlFor="time">Preferred Time</Label>
                            <Select>
                              <SelectTrigger>
                                <SelectValue placeholder="Select time slot" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="09:00">9:00 AM</SelectItem>
                                <SelectItem value="10:00">10:00 AM</SelectItem>
                                <SelectItem value="11:00">11:00 AM</SelectItem>
                                <SelectItem value="14:00">2:00 PM</SelectItem>
                                <SelectItem value="15:00">3:00 PM</SelectItem>
                                <SelectItem value="16:00">4:00 PM</SelectItem>
                                <SelectItem value="17:00">5:00 PM</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor="topic">Session Topic</Label>
                            <Textarea
                              id="topic"
                              placeholder="What would you like to discuss in this session?"
                              rows={3}
                            />
                          </div>
                          <div className="flex justify-between items-center p-4 bg-muted rounded-lg">
                            <span className="font-medium">Session Fee:</span>
                            <span className="text-lg font-bold">{mentor.price}</span>
                          </div>
                          <Button className="w-full">
                            <Calendar className="w-4 h-4 mr-2" />
                            Book Video Session
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>

                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="lg" className="flex items-center gap-2 bg-transparent">
                          <Phone className="w-4 h-4" />
                          Phone Call
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                          <DialogTitle>Schedule Phone Call</DialogTitle>
                          <DialogDescription>Book a phone call session with {mentor.name}</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="phone">Your Phone Number</Label>
                            <Input type="tel" id="phone" placeholder="+91 XXXXX XXXXX" />
                          </div>
                          <div>
                            <Label htmlFor="date">Preferred Date</Label>
                            <Input type="date" id="date" />
                          </div>
                          <div>
                            <Label htmlFor="time">Preferred Time</Label>
                            <Select>
                              <SelectTrigger>
                                <SelectValue placeholder="Select time slot" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="09:00">9:00 AM</SelectItem>
                                <SelectItem value="10:00">10:00 AM</SelectItem>
                                <SelectItem value="11:00">11:00 AM</SelectItem>
                                <SelectItem value="14:00">2:00 PM</SelectItem>
                                <SelectItem value="15:00">3:00 PM</SelectItem>
                                <SelectItem value="16:00">4:00 PM</SelectItem>
                                <SelectItem value="17:00">5:00 PM</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="flex justify-between items-center p-4 bg-muted rounded-lg">
                            <span className="font-medium">Session Fee:</span>
                            <span className="text-lg font-bold">{mentor.price}</span>
                          </div>
                          <Button className="w-full">
                            <Phone className="w-4 h-4 mr-2" />
                            Book Phone Session
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>

                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="lg" className="flex items-center gap-2 bg-transparent">
                          <MessageCircle className="w-4 h-4" />
                          Send Message
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                          <DialogTitle>Send Message</DialogTitle>
                          <DialogDescription>Send a message to {mentor.name}</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="subject">Subject</Label>
                            <Input id="subject" placeholder="What's this about?" />
                          </div>
                          <div>
                            <Label htmlFor="message">Message</Label>
                            <Textarea id="message" placeholder="Write your message here..." rows={5} />
                          </div>
                          <Button className="w-full">
                            <Send className="w-4 h-4 mr-2" />
                            Send Message
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Specializations & Skills */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Expertise & Education
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold mb-3">Specializations</h3>
                <div className="flex flex-wrap gap-2">
                  {mentor.specialization.map((spec, index) => (
                    <Badge key={index} variant="default" className="text-sm">
                      {spec}
                    </Badge>
                  ))}
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="font-semibold mb-3">Core Expertise</h3>
                <div className="flex flex-wrap gap-2">
                  {mentor.expertise.map((skill, index) => (
                    <Badge key={index} variant="secondary" className="text-sm">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="font-semibold mb-3">Education</h3>
                <p className="text-muted-foreground">{mentor.education}</p>
              </div>

              <Separator />

              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Languages className="w-4 h-4" />
                  Languages
                </h3>
                <div className="flex flex-wrap gap-2">
                  {mentor.languages.map((language, index) => (
                    <Badge key={index} variant="outline" className="text-sm">
                      {language}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Reviews */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="w-5 h-5" />
                Student Reviews
              </CardTitle>
              <CardDescription>What students are saying about {mentor.name}</CardDescription>
            </CardHeader>
            <CardContent>
              {feedback && feedback.length > 0 ? (
                <div className="space-y-6">
                  {feedback.map((review) => (
                    <div key={review.id} className="border-l-4 border-primary/20 pl-4 py-2">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="font-medium">{review.from_user.full_name}</span>
                        <span className="text-sm text-muted-foreground">
                          {new Date(review.created_at).toLocaleDateString("en-IN", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                      <p className="text-muted-foreground leading-relaxed">{review.comment}</p>
                    </div>
                  ))}
                  <Button variant="outline" className="w-full bg-transparent">
                    View All {mentor.reviews} Reviews
                  </Button>
                </div>
              ) : (
                <p className="text-muted-foreground">No reviews yet</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarDays className="w-5 h-5" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full" size="lg" asChild>
                <Link href={`/dashboard/bookings/new?mentor=${mentor.id}`}>
                  <Calendar className="w-4 h-4 mr-2" />
                  Book Session
                </Link>
              </Button>
              <Button variant="outline" className="w-full bg-transparent">
                <MessageCircle className="w-4 h-4 mr-2" />
                Quick Message
              </Button>
              <Button variant="outline" className="w-full bg-transparent">
                <Star className="w-4 h-4 mr-2" />
                Add to Favorites
              </Button>
            </CardContent>
          </Card>

          {/* Availability */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Availability
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 mb-3">
                <div
                  className={`w-3 h-3 rounded-full ${
                    mentor.availability === "Available"
                      ? "bg-green-500"
                      : mentor.availability === "Busy"
                        ? "bg-yellow-500"
                        : "bg-red-500"
                  }`}
                />
                <span className="font-medium">{mentor.availability}</span>
              </div>
              <p className="text-sm text-muted-foreground">
                {mentor.availability === "Available"
                  ? "Available for new sessions"
                  : mentor.availability === "Busy"
                    ? "Limited availability"
                    : "Currently not taking new sessions"}
              </p>
              <div className="mt-4 p-3 bg-muted rounded-lg">
                <p className="text-sm font-medium mb-1">Typical Response Time</p>
                <p className="text-sm text-muted-foreground">Within 2-4 hours</p>
              </div>
            </CardContent>
          </Card>

          {/* Pricing */}
          <Card>
            <CardHeader>
              <CardTitle>Session Pricing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center p-4 bg-primary/5 rounded-lg">
                <p className="text-3xl font-bold text-primary">{mentor.price.split("/")[0]}</p>
                <p className="text-muted-foreground">per session (60 minutes)</p>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Session Duration:</span>
                  <span>60 minutes</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Rescheduling:</span>
                  <span>Free (24h notice)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Cancellation:</span>
                  <span>Full refund (24h notice)</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Mentor Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Sessions</span>
                <span className="font-medium">{mentor.reviews * 3}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Average Rating</span>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{mentor.rating.toFixed(1)}/5.0</span>
                </div>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Experience</span>
                <span className="font-medium">{mentor.experience}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Students Helped</span>
                <span className="font-medium">{mentor.reviews * 2}+</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Success Rate</span>
                <span className="font-medium text-green-600">94%</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
