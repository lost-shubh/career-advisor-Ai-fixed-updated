"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/hooks/use-toast"
import {
  Users,
  MessageCircle,
  MapPin,
  Briefcase,
  Search,
  Video,
  ArrowRight,
  Clock,
  CheckCircle,
  UserPlus,
  GraduationCap,
  Award,
  TrendingUp,
  BookOpen,
  FileText,
  Download,
  Play,
} from "lucide-react"

interface AlumniConnectProps {
  userData: any
}

const alumniProfiles = [
  {
    id: 1,
    name: "Dr. Priya Sharma",
    currentRole: "Senior Software Engineer",
    company: "Google India",
    graduationYear: 2018,
    stream: "science",
    careerField: "Technology",
    location: "Bangalore, Karnataka",
    experience: "6 years",
    achievements: ["Google Developer Expert", "Tech Lead", "Open Source Contributor"],
    bio: "Passionate about AI/ML and helping students transition into tech careers. Started as a fresher at a startup and worked my way up to Google.",
    image: "/indian-woman-professional-software-engineer.jpg",
    connections: 245,
    mentees: 32,
    isConnected: false,
    responseRate: "95%",
    responseTime: "2 hours",
    expertise: ["Software Development", "Career Guidance", "Technical Interviews", "AI/ML"],
    successStory:
      "From a small town in Rajasthan to Google - my journey shows that with dedication and the right guidance, anything is possible.",
  },
  {
    id: 2,
    name: "Dr. Rajesh Kumar",
    currentRole: "Data Science Manager",
    company: "Microsoft",
    graduationYear: 2016,
    stream: "science",
    careerField: "Data Science",
    location: "Hyderabad, Telangana",
    experience: "8 years",
    achievements: ["Microsoft MVP", "Published Researcher", "Team Lead"],
    bio: "Leading data science teams and helping students build careers in AI/ML. Former startup founder with deep industry insights.",
    image: "/indian-professional-man-data-scientist.jpg",
    connections: 189,
    mentees: 28,
    isConnected: false,
    responseRate: "92%",
    responseTime: "4 hours",
    expertise: ["Data Science", "Machine Learning", "Analytics", "Leadership"],
    successStory:
      "Started with a basic engineering degree, self-taught data science, and now leading ML initiatives at Microsoft.",
  },
  {
    id: 3,
    name: "Anita Desai",
    currentRole: "Product Manager",
    company: "Flipkart",
    graduationYear: 2019,
    stream: "commerce",
    careerField: "Business",
    location: "Mumbai, Maharashtra",
    experience: "5 years",
    achievements: ["Product Leader", "Strategy Expert", "Team Builder"],
    bio: "Helping students understand product roles and develop strategic thinking. Experience in e-commerce and fintech domains.",
    image: "/indian-woman-business-product-manager.jpg",
    connections: 156,
    mentees: 24,
    isConnected: true,
    responseRate: "88%",
    responseTime: "6 hours",
    expertise: ["Product Management", "Strategy", "Leadership", "Business Analysis"],
    successStory:
      "Commerce graduate who broke into tech product management through internships and continuous learning.",
  },
  {
    id: 4,
    name: "Arjun Patel",
    currentRole: "DevOps Engineer",
    company: "Amazon",
    graduationYear: 2017,
    stream: "science",
    careerField: "Technology",
    location: "Chennai, Tamil Nadu",
    experience: "7 years",
    achievements: ["AWS Certified", "Cloud Expert", "System Architect"],
    bio: "Expert in cloud infrastructure and DevOps practices. Helping students understand modern deployment and system architecture.",
    image: "/indian-man-devops-engineer.jpg",
    connections: 203,
    mentees: 31,
    isConnected: false,
    responseRate: "90%",
    responseTime: "3 hours",
    expertise: ["DevOps", "Cloud Computing", "System Architecture", "AWS"],
    successStory:
      "From traditional IT support to cloud architecture at Amazon - continuous learning and certifications made the difference.",
  },
  {
    id: 5,
    name: "Dr. Kavya Reddy",
    currentRole: "UX Designer",
    company: "Zomato",
    graduationYear: 2020,
    stream: "arts",
    careerField: "Creative",
    location: "Pune, Maharashtra",
    experience: "4 years",
    achievements: ["Design Award Winner", "UX Leader", "Design Mentor"],
    bio: "Passionate about creating user-centered designs. Helping students break into design careers and build strong portfolios.",
    image: "/indian-woman-ux-designer.jpg",
    connections: 134,
    mentees: 19,
    isConnected: false,
    responseRate: "94%",
    responseTime: "2 hours",
    expertise: ["UX Design", "User Research", "Design Thinking", "Prototyping"],
    successStory:
      "Arts background led me to discover my passion for design - now creating experiences used by millions of users.",
  },
  {
    id: 6,
    name: "Sanjay Gupta",
    currentRole: "Financial Analyst",
    company: "HDFC Bank",
    graduationYear: 2018,
    stream: "commerce",
    careerField: "Finance",
    location: "Delhi, India",
    experience: "6 years",
    achievements: ["CFA Certified", "Risk Management Expert", "Team Lead"],
    bio: "Specialized in financial analysis and risk management. Helping commerce students navigate banking and finance careers.",
    image: "/indian-professional-man-finance-analyst.jpg",
    connections: 167,
    mentees: 22,
    isConnected: false,
    responseRate: "87%",
    responseTime: "5 hours",
    expertise: ["Financial Analysis", "Risk Management", "Banking", "Investment"],
    successStory:
      "Commerce graduate who built expertise in finance through certifications and practical experience in banking sector.",
  },
]

const careerResources = {
  Technology: {
    lectures: [
      { title: "Introduction to Software Development", duration: "45 min", instructor: "Priya Sharma", views: 1250 },
      { title: "System Design Fundamentals", duration: "60 min", instructor: "Arjun Patel", views: 890 },
      { title: "Career Path in Tech", duration: "30 min", instructor: "Rajesh Kumar", views: 2100 },
    ],
    notes: [
      { title: "Programming Fundamentals Guide", pages: 45, downloads: 567 },
      { title: "Interview Preparation Checklist", pages: 12, downloads: 1200 },
      { title: "Tech Career Roadmap 2024", pages: 28, downloads: 890 },
    ],
    roadmaps: [
      { title: "Full-Stack Developer Path", steps: 8, completionTime: "6-12 months" },
      { title: "Data Science Journey", steps: 10, completionTime: "8-15 months" },
      { title: "DevOps Engineer Track", steps: 7, completionTime: "4-8 months" },
    ],
  },
  Business: {
    lectures: [
      { title: "Product Management Basics", duration: "50 min", instructor: "Anita Desai", views: 780 },
      { title: "Business Strategy Fundamentals", duration: "40 min", instructor: "Sanjay Gupta", views: 650 },
      { title: "Leadership in Business", duration: "35 min", instructor: "Anita Desai", views: 920 },
    ],
    notes: [
      { title: "Business Analysis Framework", pages: 32, downloads: 445 },
      { title: "Product Management Guide", pages: 38, downloads: 678 },
      { title: "Strategic Planning Toolkit", pages: 25, downloads: 523 },
    ],
    roadmaps: [
      { title: "Product Manager Path", steps: 6, completionTime: "4-8 months" },
      { title: "Business Analyst Track", steps: 5, completionTime: "3-6 months" },
      { title: "Management Consultant Journey", steps: 8, completionTime: "6-12 months" },
    ],
  },
  Creative: {
    lectures: [
      { title: "UX Design Principles", duration: "55 min", instructor: "Kavya Reddy", views: 1100 },
      { title: "Design Thinking Workshop", duration: "75 min", instructor: "Kavya Reddy", views: 850 },
      { title: "Portfolio Building for Designers", duration: "40 min", instructor: "Kavya Reddy", views: 1300 },
    ],
    notes: [
      { title: "Design Process Guide", pages: 42, downloads: 789 },
      { title: "User Research Methods", pages: 35, downloads: 634 },
      { title: "Visual Design Principles", pages: 28, downloads: 567 },
    ],
    roadmaps: [
      { title: "UX Designer Path", steps: 7, completionTime: "5-10 months" },
      { title: "Graphic Designer Track", steps: 6, completionTime: "4-8 months" },
      { title: "Product Designer Journey", steps: 9, completionTime: "6-12 months" },
    ],
  },
  Finance: {
    lectures: [
      { title: "Financial Analysis Fundamentals", duration: "60 min", instructor: "Sanjay Gupta", views: 670 },
      { title: "Investment Banking Basics", duration: "45 min", instructor: "Sanjay Gupta", views: 540 },
      { title: "Risk Management Strategies", duration: "50 min", instructor: "Sanjay Gupta", views: 720 },
    ],
    notes: [
      { title: "Financial Modeling Guide", pages: 55, downloads: 456 },
      { title: "Banking Sector Overview", pages: 40, downloads: 378 },
      { title: "Investment Strategies", pages: 33, downloads: 423 },
    ],
    roadmaps: [
      { title: "Financial Analyst Path", steps: 6, completionTime: "4-8 months" },
      { title: "Investment Banking Track", steps: 8, completionTime: "6-12 months" },
      { title: "Risk Manager Journey", steps: 7, completionTime: "5-10 months" },
    ],
  },
}

export function AlumniConnect({ userData }: AlumniConnectProps) {
  const [activeTab, setActiveTab] = useState("network")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCareerField, setSelectedCareerField] = useState("all")
  const [selectedGradYear, setSelectedGradYear] = useState("all")
  const [filteredAlumni, setFilteredAlumni] = useState(alumniProfiles)
  const [myConnections, setMyConnections] = useState(alumniProfiles.filter((alumni) => alumni.isConnected))

  useEffect(() => {
    let filtered = alumniProfiles

    // Filter by career field if user has chosen one
    if (userData?.chosenCareer && selectedCareerField === "all") {
      const userCareerField = getUserCareerField(userData.chosenCareer)
      if (userCareerField) {
        filtered = filtered.filter((alumni) => alumni.careerField === userCareerField)
      }
    } else if (selectedCareerField !== "all") {
      filtered = filtered.filter((alumni) => alumni.careerField === selectedCareerField)
    }

    // Filter by graduation year
    if (selectedGradYear !== "all") {
      filtered = filtered.filter((alumni) => alumni.graduationYear.toString() === selectedGradYear)
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (alumni) =>
          alumni.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          alumni.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
          alumni.currentRole.toLowerCase().includes(searchTerm.toLowerCase()) ||
          alumni.expertise.some((skill) => skill.toLowerCase().includes(searchTerm.toLowerCase())),
      )
    }

    setFilteredAlumni(filtered)
  }, [searchTerm, selectedCareerField, selectedGradYear, userData])

  const getUserCareerField = (chosenCareer: string): string | null => {
    const careerFieldMap: { [key: string]: string } = {
      "software-developer": "Technology",
      "data-scientist": "Data Science",
      "business-analyst": "Business",
      "ux-designer": "Creative",
      "financial-analyst": "Finance",
      "product-manager": "Business",
      "devops-engineer": "Technology",
    }
    return careerFieldMap[chosenCareer] || null
  }

  const handleConnect = async (alumniId: number) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const alumni = alumniProfiles.find((a) => a.id === alumniId)
      if (alumni) {
        alumni.isConnected = true
        setMyConnections((prev) => [...prev, alumni])
        toast({
          title: "Connection Request Sent!",
          description: `Your connection request has been sent to ${alumni.name}. They typically respond within ${alumni.responseTime}.`,
        })
      }
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: "Please try again later.",
        variant: "destructive",
      })
    }
  }

  const handleMessage = (alumniId: number) => {
    const alumni = alumniProfiles.find((a) => a.id === alumniId)
    toast({
      title: "Message Sent!",
      description: `Your message has been sent to ${alumni?.name}. They'll respond within ${alumni?.responseTime}.`,
    })
  }

  const handleScheduleCall = (alumniId: number) => {
    const alumni = alumniProfiles.find((a) => a.id === alumniId)
    toast({
      title: "Call Scheduled!",
      description: `Your call request has been sent to ${alumni?.name}. You'll receive a calendar invite soon.`,
    })
  }

  const getResourcesForCareer = () => {
    const userCareerField = getUserCareerField(userData?.chosenCareer)
    return userCareerField
      ? careerResources[userCareerField as keyof typeof careerResources]
      : careerResources.Technology
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-6 h-6" />
            Alumni Connect
          </CardTitle>
          <CardDescription>
            Connect with successful alumni from your career field and get guidance from those who've walked the path
            before you
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="network">Alumni Network</TabsTrigger>
          <TabsTrigger value="stories">Success Stories</TabsTrigger>
          <TabsTrigger value="resources">Career Resources</TabsTrigger>
          <TabsTrigger value="connections">My Connections</TabsTrigger>
        </TabsList>

        <TabsContent value="network" className="space-y-6">
          {/* Search and Filters */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search alumni by name, company, or expertise..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={selectedCareerField} onValueChange={setSelectedCareerField}>
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="Career Field" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Fields</SelectItem>
                    <SelectItem value="Technology">Technology</SelectItem>
                    <SelectItem value="Business">Business</SelectItem>
                    <SelectItem value="Creative">Creative</SelectItem>
                    <SelectItem value="Finance">Finance</SelectItem>
                    <SelectItem value="Data Science">Data Science</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={selectedGradYear} onValueChange={setSelectedGradYear}>
                  <SelectTrigger className="w-full md:w-32">
                    <SelectValue placeholder="Year" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Years</SelectItem>
                    <SelectItem value="2020">2020</SelectItem>
                    <SelectItem value="2019">2019</SelectItem>
                    <SelectItem value="2018">2018</SelectItem>
                    <SelectItem value="2017">2017</SelectItem>
                    <SelectItem value="2016">2016</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Alumni Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAlumni.map((alumni) => (
              <Card key={alumni.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-4">
                  <div className="flex items-start gap-4">
                    <Avatar className="w-16 h-16">
                      <AvatarImage src={alumni.image || "/placeholder.svg"} alt={alumni.name} />
                      <AvatarFallback>
                        {alumni.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg truncate">{alumni.name}</CardTitle>
                      <CardDescription className="text-sm">
                        {alumni.currentRole} at {alumni.company}
                      </CardDescription>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="secondary" className="text-xs">
                          Class of {alumni.graduationYear}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {alumni.careerField}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground line-clamp-2">{alumni.bio}</p>

                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {alumni.location}
                    </div>
                    <div className="flex items-center gap-1">
                      <Briefcase className="w-3 h-3" />
                      {alumni.experience}
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs">
                    <div className="flex items-center gap-1">
                      <Users className="w-3 h-3 text-blue-500" />
                      <span>{alumni.connections} connections</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <GraduationCap className="w-3 h-3 text-green-500" />
                      <span>{alumni.mentees} mentees</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-orange-500" />
                      <span>Responds in {alumni.responseTime}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <CheckCircle className="w-3 h-3 text-green-500" />
                      <span>{alumni.responseRate} response rate</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {alumni.expertise.slice(0, 3).map((skill, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                    {alumni.expertise.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{alumni.expertise.length - 3} more
                      </Badge>
                    )}
                  </div>

                  <div className="flex gap-2 pt-2">
                    {alumni.isConnected ? (
                      <>
                        <Button size="sm" variant="outline" onClick={() => handleMessage(alumni.id)} className="flex-1">
                          <MessageCircle className="w-4 h-4 mr-1" />
                          Message
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleScheduleCall(alumni.id)}
                          className="flex-1"
                        >
                          <Video className="w-4 h-4 mr-1" />
                          Call
                        </Button>
                      </>
                    ) : (
                      <Button size="sm" onClick={() => handleConnect(alumni.id)} className="w-full">
                        <UserPlus className="w-4 h-4 mr-1" />
                        Connect
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredAlumni.length === 0 && (
            <Card>
              <CardContent className="text-center py-12">
                <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Alumni Found</h3>
                <p className="text-muted-foreground">Try adjusting your search criteria or filters</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="stories" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {alumniProfiles.slice(0, 4).map((alumni) => (
              <Card key={alumni.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={alumni.image || "/placeholder.svg"} alt={alumni.name} />
                      <AvatarFallback>
                        {alumni.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">{alumni.name}</CardTitle>
                      <CardDescription>
                        {alumni.currentRole} at {alumni.company}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <blockquote className="text-sm italic text-muted-foreground border-l-4 border-primary pl-4">
                    "{alumni.successStory}"
                  </blockquote>

                  <div className="flex flex-wrap gap-2">
                    {alumni.achievements.map((achievement, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        <Award className="w-3 h-3 mr-1" />
                        {achievement}
                      </Badge>
                    ))}
                  </div>

                  <Button variant="outline" size="sm" className="w-full bg-transparent">
                    Read Full Story
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="resources" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Career-Specific Learning Resources
              </CardTitle>
              <CardDescription>
                Curated resources for{" "}
                {userData?.chosenCareer ? getUserCareerField(userData.chosenCareer) : "Technology"} careers
              </CardDescription>
            </CardHeader>
          </Card>

          <Tabs defaultValue="lectures" className="space-y-4">
            <TabsList>
              <TabsTrigger value="lectures">Video Lectures</TabsTrigger>
              <TabsTrigger value="notes">Study Notes</TabsTrigger>
              <TabsTrigger value="roadmaps">Career Roadmaps</TabsTrigger>
            </TabsList>

            <TabsContent value="lectures" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {getResourcesForCareer().lectures.map((lecture, index) => (
                  <Card key={index} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                          <Play className="w-5 h-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-sm mb-1">{lecture.title}</h4>
                          <p className="text-xs text-muted-foreground mb-2">by {lecture.instructor}</p>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            <span>{lecture.duration}</span>
                            <span>•</span>
                            <span>{lecture.views} views</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="notes" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {getResourcesForCareer().notes.map((note, index) => (
                  <Card key={index} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <FileText className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-sm mb-1">{note.title}</h4>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2">
                            <span>{note.pages} pages</span>
                            <span>•</span>
                            <span>{note.downloads} downloads</span>
                          </div>
                          <Button size="sm" variant="outline" className="text-xs h-7 bg-transparent">
                            <Download className="w-3 h-3 mr-1" />
                            Download
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="roadmaps" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {getResourcesForCareer().roadmaps.map((roadmap, index) => (
                  <Card key={index} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                          <TrendingUp className="w-5 h-5 text-green-600" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-sm mb-1">{roadmap.title}</h4>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2">
                            <span>{roadmap.steps} steps</span>
                            <span>•</span>
                            <span>{roadmap.completionTime}</span>
                          </div>
                          <Button size="sm" variant="outline" className="text-xs h-7 bg-transparent">
                            View Roadmap
                            <ArrowRight className="w-3 h-3 ml-1" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </TabsContent>

        <TabsContent value="connections" className="space-y-6">
          {myConnections.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myConnections.map((alumni) => (
                <Card key={alumni.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-4">
                    <div className="flex items-start gap-4">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={alumni.image || "/placeholder.svg"} alt={alumni.name} />
                        <AvatarFallback>
                          {alumni.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <CardTitle className="text-lg">{alumni.name}</CardTitle>
                        <CardDescription className="text-sm">
                          {alumni.currentRole} at {alumni.company}
                        </CardDescription>
                        <Badge variant="secondary" className="text-xs mt-1">
                          Connected
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleMessage(alumni.id)} className="flex-1">
                        <MessageCircle className="w-4 h-4 mr-1" />
                        Message
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleScheduleCall(alumni.id)}
                        className="flex-1"
                      >
                        <Video className="w-4 h-4 mr-1" />
                        Call
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Connections Yet</h3>
                <p className="text-muted-foreground mb-4">
                  Start connecting with alumni to build your professional network
                </p>
                <Button onClick={() => setActiveTab("network")}>
                  Browse Alumni Network
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
