"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ReviewRatingSystem } from "./review-rating-system"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/hooks/use-toast"
import {
  Users,
  MessageCircle,
  Star,
  MapPin,
  Briefcase,
  Calendar,
  Search,
  Filter,
  Heart,
  Share,
  Video,
  Phone,
  Mail,
  ArrowRight,
  Plus,
  Clock,
  CheckCircle,
  UserPlus,
} from "lucide-react"

interface CommunityHubProps {
  userData: any
}

const mentors = [
  {
    id: 1,
    name: "Priya Sharma",
    title: "Senior Software Engineer",
    company: "Google India",
    location: "Bangalore, Karnataka",
    experience: "8 years",
    expertise: ["Software Development", "Career Guidance", "Technical Interviews"],
    rating: 4.9,
    reviews: 127,
    image: "/indian-woman-professional-software-engineer.jpg",
    bio: "Passionate about helping students transition into tech careers. Specialized in full-stack development and system design.",
    availability: "Weekends",
    languages: ["English", "Hindi", "Kannada"],
    mentees: 45,
    sessions: 230,
  },
  {
    id: 2,
    name: "Rajesh Kumar",
    title: "Data Science Manager",
    company: "Microsoft",
    location: "Hyderabad, Telangana",
    experience: "10 years",
    expertise: ["Data Science", "Machine Learning", "Analytics"],
    rating: 4.8,
    reviews: 89,
    image: "/indian-professional-man-data-scientist.jpg",
    bio: "Leading data science teams and helping students build careers in AI/ML. Former startup founder with industry insights.",
    availability: "Evenings",
    languages: ["English", "Hindi", "Telugu"],
    mentees: 32,
    sessions: 156,
  },
  {
    id: 3,
    name: "Anita Desai",
    title: "Product Manager",
    company: "Flipkart",
    location: "Mumbai, Maharashtra",
    experience: "6 years",
    expertise: ["Product Management", "Strategy", "Leadership"],
    rating: 4.7,
    reviews: 64,
    image: "/indian-woman-business-product-manager.jpg",
    bio: "Helping students understand product roles and develop strategic thinking. Experience in e-commerce and fintech.",
    availability: "Flexible",
    languages: ["English", "Hindi", "Marathi"],
    mentees: 28,
    sessions: 98,
  },
  {
    id: 4,
    name: "Arjun Patel",
    title: "DevOps Engineer",
    company: "Amazon",
    location: "Chennai, Tamil Nadu",
    experience: "7 years",
    expertise: ["DevOps", "Cloud Computing", "System Architecture"],
    rating: 4.6,
    reviews: 52,
    image: "/indian-man-devops-engineer.jpg",
    bio: "Expert in cloud infrastructure and DevOps practices. Helping students understand modern deployment strategies.",
    availability: "Weekdays",
    languages: ["English", "Hindi", "Tamil"],
    mentees: 35,
    sessions: 142,
  },
  {
    id: 5,
    name: "Kavya Reddy",
    title: "UX Designer",
    company: "Zomato",
    location: "Pune, Maharashtra",
    experience: "5 years",
    expertise: ["UX Design", "User Research", "Design Thinking"],
    rating: 4.8,
    reviews: 73,
    image: "/indian-woman-ux-designer.jpg",
    bio: "Passionate about creating user-centered designs. Helping students break into design careers.",
    availability: "Flexible",
    languages: ["English", "Hindi", "Telugu"],
    mentees: 29,
    sessions: 87,
  },
]

const studyGroups = [
  {
    id: 1,
    name: "Full-Stack Web Development",
    description: "Learn MERN stack together with hands-on projects",
    members: 24,
    category: "Programming",
    level: "Beginner",
    meetingTime: "Saturdays 7 PM IST",
    nextSession: "Dec 16, 2024",
    topics: ["React", "Node.js", "MongoDB", "Express"],
    moderator: "Vikram Singh",
    image: "/coding-programming-group.jpg",
    isJoined: false,
  },
  {
    id: 2,
    name: "Data Science Study Circle",
    description: "Master Python, ML, and statistics through collaborative learning",
    members: 18,
    category: "Data Science",
    level: "Intermediate",
    meetingTime: "Sundays 6 PM IST",
    nextSession: "Dec 17, 2024",
    topics: ["Python", "Pandas", "Scikit-learn", "Statistics"],
    moderator: "Sneha Patel",
    image: "/data-science-analytics.jpg",
    isJoined: false,
  },
  {
    id: 3,
    name: "Digital Marketing Masterclass",
    description: "Learn SEO, social media, and content marketing strategies",
    members: 31,
    category: "Marketing",
    level: "Beginner",
    meetingTime: "Wednesdays 8 PM IST",
    nextSession: "Dec 18, 2024",
    topics: ["SEO", "Social Media", "Content Marketing", "Analytics"],
    moderator: "Arjun Mehta",
    image: "/digital-marketing-strategy.png",
    isJoined: false,
  },
  {
    id: 4,
    name: "UI/UX Design Workshop",
    description: "Learn design principles, prototyping, and user research",
    members: 22,
    category: "Design",
    level: "Beginner",
    meetingTime: "Fridays 7 PM IST",
    nextSession: "Dec 19, 2024",
    topics: ["Figma", "User Research", "Prototyping", "Design Systems"],
    moderator: "Priya Sharma",
    image: "/ui-ux-design-workshop.jpg",
    isJoined: false,
  },
  {
    id: 5,
    name: "Competitive Programming",
    description: "Solve algorithmic problems and prepare for coding contests",
    members: 35,
    category: "Programming",
    level: "Advanced",
    meetingTime: "Tuesdays & Thursdays 8 PM IST",
    nextSession: "Dec 15, 2024",
    topics: ["Algorithms", "Data Structures", "Problem Solving", "Contest Prep"],
    moderator: "Rohit Kumar",
    image: "/competitive-programming-algorithms.jpg",
    isJoined: false,
  },
  {
    id: 6,
    name: "Cloud Computing Fundamentals",
    description: "Learn AWS, Azure, and cloud architecture patterns",
    members: 19,
    category: "Technology",
    level: "Intermediate",
    meetingTime: "Saturdays 5 PM IST",
    nextSession: "Dec 21, 2024",
    topics: ["AWS", "Azure", "Docker", "Kubernetes"],
    moderator: "Amit Singh",
    image: "/cloud-computing-aws-azure.jpg",
    isJoined: false,
  },
]

const discussions = [
  {
    id: 1,
    title: "How to prepare for technical interviews at Indian startups?",
    author: "Rohit Gupta",
    replies: 23,
    likes: 45,
    category: "Career Advice",
    timeAgo: "2 hours ago",
    tags: ["Interviews", "Startups", "Technical"],
    preview: "I have interviews lined up with several Bangalore startups. What should I focus on for preparation?",
    isLiked: false,
  },
  {
    id: 2,
    title: "Best resources for learning React in 2024",
    author: "Kavya Reddy",
    replies: 18,
    likes: 32,
    category: "Learning Resources",
    timeAgo: "5 hours ago",
    tags: ["React", "Frontend", "Resources"],
    preview: "Looking for updated React learning resources that cover the latest features and best practices.",
    isLiked: false,
  },
  {
    id: 3,
    title: "Transitioning from engineering to product management",
    author: "Amit Sharma",
    replies: 15,
    likes: 28,
    category: "Career Transition",
    timeAgo: "1 day ago",
    tags: ["Product Management", "Career Change"],
    preview: "I'm a software engineer looking to move into product management. What skills should I develop?",
    isLiked: false,
  },
  {
    id: 4,
    title: "Remote work opportunities for fresh graduates",
    author: "Neha Patel",
    replies: 31,
    likes: 67,
    category: "Career Advice",
    timeAgo: "2 days ago",
    tags: ["Remote Work", "Fresh Graduate", "Opportunities"],
    preview: "What are the best companies offering remote positions for new graduates in India?",
    isLiked: false,
  },
  {
    id: 5,
    title: "Building a strong portfolio for design roles",
    author: "Sanjay Kumar",
    replies: 12,
    likes: 24,
    category: "Portfolio",
    timeAgo: "3 days ago",
    tags: ["Portfolio", "Design", "UX"],
    preview: "Tips for creating a compelling design portfolio that stands out to recruiters.",
    isLiked: false,
  },
]

const events = [
  {
    id: 1,
    title: "AI/ML Career Fair 2024",
    date: "Dec 20, 2024",
    time: "10:00 AM - 4:00 PM IST",
    type: "Virtual",
    attendees: 1250,
    description: "Connect with top AI/ML companies and explore career opportunities",
    organizer: "TechCareers India",
    tags: ["AI", "ML", "Career Fair", "Jobs"],
    isRegistered: false,
  },
  {
    id: 2,
    title: "Women in Tech Leadership Summit",
    date: "Dec 22, 2024",
    time: "2:00 PM - 6:00 PM IST",
    type: "Hybrid",
    attendees: 890,
    description: "Inspiring talks and networking for women in technology",
    organizer: "WomenTech India",
    tags: ["Women in Tech", "Leadership", "Networking"],
    isRegistered: false,
  },
  {
    id: 3,
    title: "Startup Pitch Competition",
    date: "Dec 25, 2024",
    time: "11:00 AM - 5:00 PM IST",
    type: "In-person",
    attendees: 450,
    description: "Present your startup ideas to investors and industry experts",
    organizer: "Startup India",
    tags: ["Startup", "Pitch", "Entrepreneurship"],
    isRegistered: false,
  },
  {
    id: 4,
    title: "Full-Stack Development Bootcamp",
    date: "Jan 5, 2025",
    time: "9:00 AM - 5:00 PM IST",
    type: "Virtual",
    attendees: 2100,
    description: "Intensive 3-day bootcamp covering modern web development",
    organizer: "CodeAcademy India",
    tags: ["Bootcamp", "Full-Stack", "Web Development"],
    isRegistered: false,
  },
  {
    id: 5,
    title: "Data Science Workshop Series",
    date: "Jan 8, 2025",
    time: "6:00 PM - 9:00 PM IST",
    type: "Virtual",
    attendees: 756,
    description: "Weekly workshops on data science tools and techniques",
    organizer: "DataScience Hub",
    tags: ["Data Science", "Workshop", "Python"],
    isRegistered: false,
  },
]

export function CommunityHub({ userData }: CommunityHubProps) {
  const [activeTab, setActiveTab] = useState("mentors")
  const [selectedMentor, setSelectedMentor] = useState<(typeof mentors)[0] | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [showReviews, setShowReviews] = useState(false)

  const [studyGroupsState, setStudyGroupsState] = useState(studyGroups)
  const [discussionsState, setDiscussionsState] = useState(discussions)
  const [eventsState, setEventsState] = useState(events)
  const [showCreateGroup, setShowCreateGroup] = useState(false)
  const [showCreateDiscussion, setShowCreateDiscussion] = useState(false)
  const [loading, setLoading] = useState(false)

  const [newGroup, setNewGroup] = useState({
    name: "",
    description: "",
    category: "",
    level: "",
    topics: "",
    meetingTime: "",
  })

  const [newDiscussion, setNewDiscussion] = useState({
    title: "",
    content: "",
    category: "",
    tags: "",
  })

  const handleJoinGroup = async (groupId: number) => {
    setLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setStudyGroupsState((prev) =>
        prev.map((group) =>
          group.id === groupId
            ? { ...group, isJoined: !group.isJoined, members: group.isJoined ? group.members - 1 : group.members + 1 }
            : group,
        ),
      )

      const group = studyGroupsState.find((g) => g.id === groupId)
      toast({
        title: group?.isJoined ? "Left study group" : "Joined study group",
        description: group?.isJoined ? `You left ${group.name}` : `You joined ${group?.name}`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to join/leave study group",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleEventRegistration = async (eventId: number) => {
    setLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setEventsState((prev) =>
        prev.map((event) =>
          event.id === eventId
            ? {
                ...event,
                isRegistered: !event.isRegistered,
                attendees: event.isRegistered ? event.attendees - 1 : event.attendees + 1,
              }
            : event,
        ),
      )

      const event = eventsState.find((e) => e.id === eventId)
      toast({
        title: event?.isRegistered ? "Unregistered from event" : "Registered for event",
        description: event?.isRegistered
          ? `You unregistered from ${event.title}`
          : `You registered for ${event?.title}`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to register/unregister for event",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDiscussionLike = async (discussionId: number) => {
    try {
      setDiscussionsState((prev) =>
        prev.map((discussion) =>
          discussion.id === discussionId
            ? {
                ...discussion,
                isLiked: !discussion.isLiked,
                likes: discussion.isLiked ? discussion.likes - 1 : discussion.likes + 1,
              }
            : discussion,
        ),
      )
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to like discussion",
        variant: "destructive",
      })
    }
  }

  const handleCreateGroup = async () => {
    if (!newGroup.name || !newGroup.description || !newGroup.category) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const group = {
        id: studyGroupsState.length + 1,
        name: newGroup.name,
        description: newGroup.description,
        category: newGroup.category,
        level: newGroup.level,
        topics: newGroup.topics.split(",").map((t) => t.trim()),
        meetingTime: newGroup.meetingTime,
        members: 1,
        moderator: userData?.name || "You",
        nextSession: "TBD",
        image: "/diverse-study-group.png",
        isJoined: true,
      }

      setStudyGroupsState((prev) => [group, ...prev])
      setShowCreateGroup(false)
      setNewGroup({ name: "", description: "", category: "", level: "", topics: "", meetingTime: "" })

      toast({
        title: "Study group created",
        description: `${group.name} has been created successfully`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create study group",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCreateDiscussion = async () => {
    if (!newDiscussion.title || !newDiscussion.content || !newDiscussion.category) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const discussion = {
        id: discussionsState.length + 1,
        title: newDiscussion.title,
        author: userData?.name || "You",
        replies: 0,
        likes: 0,
        category: newDiscussion.category,
        timeAgo: "Just now",
        tags: newDiscussion.tags.split(",").map((t) => t.trim()),
        preview: newDiscussion.content.substring(0, 100) + "...",
        isLiked: false,
      }

      setDiscussionsState((prev) => [discussion, ...prev])
      setShowCreateDiscussion(false)
      setNewDiscussion({ title: "", content: "", category: "", tags: "" })

      toast({
        title: "Discussion created",
        description: `Your discussion "${discussion.title}" has been posted`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create discussion",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (selectedMentor) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Avatar className="w-16 h-16">
                  <AvatarImage src={selectedMentor.image || "/placeholder.svg"} alt={selectedMentor.name} />
                  <AvatarFallback>
                    {selectedMentor.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-2xl">{selectedMentor.name}</CardTitle>
                  <CardDescription className="text-lg">
                    {selectedMentor.title} at {selectedMentor.company}
                  </CardDescription>
                  <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{selectedMentor.rating}</span>
                      <span className="text-muted-foreground">({selectedMentor.reviews} reviews)</span>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      <span>{selectedMentor.location}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant={showReviews ? "default" : "outline"} onClick={() => setShowReviews(!showReviews)}>
                  {showReviews ? "Profile" : "Reviews"}
                </Button>
                <Button variant="outline" onClick={() => setSelectedMentor(null)}>
                  Back to Mentors
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        {showReviews ? (
          <ReviewRatingSystem
            targetId={selectedMentor.id.toString()}
            targetType="mentor"
            targetName={selectedMentor.name}
            currentUserCanReview={true}
            showWriteReview={true}
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>About</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed mb-4">{selectedMentor.bio}</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium mb-2">Experience</h4>
                      <p className="text-muted-foreground">{selectedMentor.experience}</p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Availability</h4>
                      <p className="text-muted-foreground">{selectedMentor.availability}</p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Languages</h4>
                      <div className="flex flex-wrap gap-1">
                        {selectedMentor.languages.map((lang, index) => (
                          <Badge key={index} variant="secondary">
                            {lang}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Expertise</h4>
                      <div className="flex flex-wrap gap-1">
                        {selectedMentor.expertise.map((skill, index) => (
                          <Badge key={index} variant="outline">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Connect with {selectedMentor.name}</CardTitle>
                  <CardDescription>Choose how you'd like to connect</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Button className="flex items-center gap-2">
                      <Video className="w-4 h-4" />
                      Video Call
                    </Button>
                    <Button variant="outline" className="flex items-center gap-2 bg-transparent">
                      <Phone className="w-4 h-4" />
                      Voice Call
                    </Button>
                    <Button variant="outline" className="flex items-center gap-2 bg-transparent">
                      <Mail className="w-4 h-4" />
                      Message
                    </Button>
                  </div>
                  <div className="p-4 bg-muted rounded-lg">
                    <h4 className="font-medium mb-2">Schedule a Session</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Book a 30-minute mentorship session to discuss your career goals
                    </p>
                    <Button className="w-full">
                      <Calendar className="w-4 h-4 mr-2" />
                      Schedule Session
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Mentor Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Total Mentees</span>
                    <span className="font-bold">{selectedMentor.mentees}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Sessions Completed</span>
                    <span className="font-bold">{selectedMentor.sessions}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Average Rating</span>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-bold">{selectedMentor.rating}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Response Time</span>
                    <span className="font-bold">&lt; 2 hours</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Reviews</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    {
                      author: "Rahul M.",
                      rating: 5,
                      comment: "Excellent guidance on career transition. Very helpful!",
                      date: "2 days ago",
                    },
                    {
                      author: "Pooja S.",
                      rating: 5,
                      comment: "Great insights into the tech industry. Highly recommend!",
                      date: "1 week ago",
                    },
                  ].map((review, index) => (
                    <div key={index} className="p-3 bg-muted rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{review.author}</span>
                        <div className="flex items-center gap-1">
                          {[...Array(review.rating)].map((_, i) => (
                            <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">{review.comment}</p>
                      <span className="text-xs text-muted-foreground">{review.date}</span>
                    </div>
                  ))}
                  <Button variant="outline" className="w-full bg-transparent" onClick={() => setShowReviews(true)}>
                    View All Reviews
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-6 h-6" />
            Community Hub
          </CardTitle>
          <CardDescription>
            Connect with mentors, join study groups, participate in discussions, and attend career events
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="mentors">Mentors</TabsTrigger>
          <TabsTrigger value="groups">Study Groups</TabsTrigger>
          <TabsTrigger value="discussions">Discussions</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
        </TabsList>

        <TabsContent value="mentors" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Find Your Mentor</CardTitle>
                  <CardDescription>Connect with industry professionals for personalized guidance</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search mentors..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 w-64"
                    />
                  </div>
                  <Button variant="outline" size="sm">
                    <Filter className="w-4 h-4 mr-2" />
                    Filter
                  </Button>
                </div>
              </div>
            </CardHeader>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mentors.map((mentor) => (
              <Card
                key={mentor.id}
                className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105"
              >
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={mentor.image || "/placeholder.svg"} alt={mentor.name} />
                      <AvatarFallback>
                        {mentor.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <CardTitle className="text-lg">{mentor.name}</CardTitle>
                      <CardDescription className="text-sm">{mentor.title}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-1">
                      <Briefcase className="w-4 h-4" />
                      {mentor.company}
                    </span>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span>{mentor.rating}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    {mentor.location}
                  </div>

                  <div>
                    <h4 className="text-sm font-medium mb-2">Expertise</h4>
                    <div className="flex flex-wrap gap-1">
                      {mentor.expertise.slice(0, 2).map((skill, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                      {mentor.expertise.length > 2 && (
                        <Badge variant="secondary" className="text-xs">
                          +{mentor.expertise.length - 2}
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>{mentor.mentees} mentees</span>
                    <span>{mentor.sessions} sessions</span>
                  </div>

                  <Button className="w-full bg-transparent" variant="outline" onClick={() => setSelectedMentor(mentor)}>
                    View Profile
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="groups" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Study Groups</CardTitle>
                  <CardDescription>Join collaborative learning groups with peers</CardDescription>
                </div>
                <Dialog open={showCreateGroup} onOpenChange={setShowCreateGroup}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Create Group
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Create Study Group</DialogTitle>
                      <DialogDescription>Start a new study group and invite others to learn together</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="name">Group Name *</Label>
                        <Input
                          id="name"
                          value={newGroup.name}
                          onChange={(e) => setNewGroup((prev) => ({ ...prev, name: e.target.value }))}
                          placeholder="e.g., React Fundamentals"
                        />
                      </div>
                      <div>
                        <Label htmlFor="description">Description *</Label>
                        <Textarea
                          id="description"
                          value={newGroup.description}
                          onChange={(e) => setNewGroup((prev) => ({ ...prev, description: e.target.value }))}
                          placeholder="Describe what your group will focus on..."
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="category">Category *</Label>
                          <Select
                            value={newGroup.category}
                            onValueChange={(value) => setNewGroup((prev) => ({ ...prev, category: value }))}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Programming">Programming</SelectItem>
                              <SelectItem value="Data Science">Data Science</SelectItem>
                              <SelectItem value="Design">Design</SelectItem>
                              <SelectItem value="Marketing">Marketing</SelectItem>
                              <SelectItem value="Technology">Technology</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="level">Level</Label>
                          <Select
                            value={newGroup.level}
                            onValueChange={(value) => setNewGroup((prev) => ({ ...prev, level: value }))}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select level" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Beginner">Beginner</SelectItem>
                              <SelectItem value="Intermediate">Intermediate</SelectItem>
                              <SelectItem value="Advanced">Advanced</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="topics">Topics (comma-separated)</Label>
                        <Input
                          id="topics"
                          value={newGroup.topics}
                          onChange={(e) => setNewGroup((prev) => ({ ...prev, topics: e.target.value }))}
                          placeholder="e.g., React, JavaScript, Hooks"
                        />
                      </div>
                      <div>
                        <Label htmlFor="meetingTime">Meeting Schedule</Label>
                        <Input
                          id="meetingTime"
                          value={newGroup.meetingTime}
                          onChange={(e) => setNewGroup((prev) => ({ ...prev, meetingTime: e.target.value }))}
                          placeholder="e.g., Saturdays 7 PM IST"
                        />
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setShowCreateGroup(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleCreateGroup} disabled={loading}>
                          {loading ? "Creating..." : "Create Group"}
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {studyGroupsState.map((group) => (
              <Card key={group.id}>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={group.image || "/placeholder.svg"} alt={group.name} />
                      <AvatarFallback>
                        {group.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <CardTitle className="text-lg">{group.name}</CardTitle>
                      <CardDescription>{group.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline">{group.category}</Badge>
                    <Badge
                      className={
                        group.level === "Beginner"
                          ? "bg-green-500"
                          : group.level === "Intermediate"
                            ? "bg-yellow-500"
                            : "bg-red-500"
                      }
                    >
                      {group.level}
                    </Badge>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-muted-foreground" />
                      <span>{group.members} members</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span>{group.meetingTime}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span>Next: {group.nextSession}</span>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium mb-2">Topics</h4>
                    <div className="flex flex-wrap gap-1">
                      {group.topics.map((topic, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {topic}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <Button
                    className="w-full"
                    variant={group.isJoined ? "outline" : "default"}
                    onClick={() => handleJoinGroup(group.id)}
                    disabled={loading}
                  >
                    {group.isJoined ? (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Joined
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-4 h-4 mr-2" />
                        Join Group
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="discussions" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Community Discussions</CardTitle>
                  <CardDescription>Ask questions, share knowledge, and help others</CardDescription>
                </div>
                <Dialog open={showCreateDiscussion} onOpenChange={setShowCreateDiscussion}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      New Discussion
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                      <DialogTitle>Start New Discussion</DialogTitle>
                      <DialogDescription>Ask a question or share knowledge with the community</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="title">Title *</Label>
                        <Input
                          id="title"
                          value={newDiscussion.title}
                          onChange={(e) => setNewDiscussion((prev) => ({ ...prev, title: e.target.value }))}
                          placeholder="What's your question or topic?"
                        />
                      </div>
                      <div>
                        <Label htmlFor="content">Content *</Label>
                        <Textarea
                          id="content"
                          value={newDiscussion.content}
                          onChange={(e) => setNewDiscussion((prev) => ({ ...prev, content: e.target.value }))}
                          placeholder="Provide details about your question or share your knowledge..."
                          rows={4}
                        />
                      </div>
                      <div>
                        <Label htmlFor="category">Category *</Label>
                        <Select
                          value={newDiscussion.category}
                          onValueChange={(value) => setNewDiscussion((prev) => ({ ...prev, category: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Career Advice">Career Advice</SelectItem>
                            <SelectItem value="Learning Resources">Learning Resources</SelectItem>
                            <SelectItem value="Career Transition">Career Transition</SelectItem>
                            <SelectItem value="Portfolio">Portfolio</SelectItem>
                            <SelectItem value="Technical">Technical</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="tags">Tags (comma-separated)</Label>
                        <Input
                          id="tags"
                          value={newDiscussion.tags}
                          onChange={(e) => setNewDiscussion((prev) => ({ ...prev, tags: e.target.value }))}
                          placeholder="e.g., React, Career, Interview"
                        />
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setShowCreateDiscussion(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleCreateDiscussion} disabled={loading}>
                          {loading ? "Posting..." : "Post Discussion"}
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
          </Card>

          <div className="space-y-4">
            {discussionsState.map((discussion) => (
              <Card key={discussion.id} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-2">{discussion.title}</h3>
                      <p className="text-muted-foreground text-sm mb-3">{discussion.preview}</p>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {discussion.tags.map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <Badge variant="outline">{discussion.category}</Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-4">
                      <span>by {discussion.author}</span>
                      <span>{discussion.timeAgo}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <MessageCircle className="w-4 h-4" />
                        {discussion.replies}
                      </span>
                      <button
                        className="flex items-center gap-1 hover:text-red-500 transition-colors"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDiscussionLike(discussion.id)
                        }}
                      >
                        <Heart className={`w-4 h-4 ${discussion.isLiked ? "fill-red-500 text-red-500" : ""}`} />
                        {discussion.likes}
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="events" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Events</CardTitle>
              <CardDescription>Career fairs, workshops, and networking events</CardDescription>
            </CardHeader>
          </Card>

          <div className="space-y-4">
            {eventsState.map((event) => (
              <Card key={event.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-xl mb-2">{event.title}</h3>
                      <p className="text-muted-foreground mb-3">{event.description}</p>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {event.tags.map((tag, index) => (
                          <Badge key={index} variant="secondary">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <Badge variant={event.type === "Virtual" ? "default" : "outline"}>{event.type}</Badge>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span>{event.date}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="w-4 h-4 text-muted-foreground" />
                      <span>{event.attendees} attending</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Organized by {event.organizer}</span>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <Share className="w-4 h-4 mr-2" />
                        Share
                      </Button>
                      <Button
                        size="sm"
                        variant={event.isRegistered ? "outline" : "default"}
                        onClick={() => handleEventRegistration(event.id)}
                        disabled={loading}
                      >
                        {event.isRegistered ? (
                          <>
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Registered
                          </>
                        ) : (
                          "Register"
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
