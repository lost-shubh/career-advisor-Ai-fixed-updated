"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { Checkbox } from "@/components/ui/checkbox"
import { WeeklyTests } from "./weekly-tests"
import { toast } from "@/hooks/use-toast"
import {
  BookOpen,
  Clock,
  Target,
  Award,
  PlayCircle,
  FileText,
  Code,
  PenTool,
  CheckCircle,
  ArrowRight,
  Calendar,
  Users,
  Lightbulb,
  TrendingUp,
  Star,
  Zap,
  BookmarkPlus,
  Share,
} from "lucide-react"

interface LearningRoadmapProps {
  userData: any
}

interface Resource {
  type: "video" | "article" | "course" | "book" | "practice" | "project"
  title: string
  description: string
  url?: string
  duration: string
  difficulty: "Easy" | "Medium" | "Hard"
}

interface Assessment {
  type: "quiz" | "project" | "assignment"
  description: string
  criteria: string[]
}

interface Module {
  id: string
  title: string
  description: string
  duration: string
  topics: string[]
  resources: Resource[]
  assessment: Assessment
  completed?: boolean
}

interface Roadmap {
  id: string
  title: string
  description: string
  duration: string
  difficulty: "Beginner" | "Intermediate" | "Advanced"
  category: string
  prerequisites: string[]
  learningOutcomes: string[]
  modules: Module[]
  careerAlignment: string[]
  skillsGained: string[]
  progress?: number
}

interface RoadmapData {
  roadmaps: Roadmap[]
  recommendations: string
}

const getResourceIcon = (type: Resource["type"]) => {
  switch (type) {
    case "video":
      return PlayCircle
    case "article":
      return FileText
    case "course":
      return BookOpen
    case "book":
      return BookOpen
    case "practice":
      return Code
    case "project":
      return PenTool
    default:
      return FileText
  }
}

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case "Beginner":
    case "Easy":
      return "bg-green-500"
    case "Intermediate":
    case "Medium":
      return "bg-yellow-500"
    case "Advanced":
    case "Hard":
      return "bg-red-500"
    default:
      return "bg-gray-500"
  }
}

export function LearningRoadmap({ userData }: LearningRoadmapProps) {
  const [roadmaps, setRoadmaps] = useState<RoadmapData | null>(null)
  const [loading, setLoading] = useState(false)
  const [selectedRoadmap, setSelectedRoadmap] = useState<Roadmap | null>(null)
  const [selectedModule, setSelectedModule] = useState<Module | null>(null)
  const [completedResources, setCompletedResources] = useState<Set<string>>(new Set())
  const [activeTab, setActiveTab] = useState("roadmaps")
  const [bookmarkedRoadmaps, setBookmarkedRoadmaps] = useState<Set<string>>(new Set())
  const [studySchedule, setStudySchedule] = useState<{ [key: string]: Date }>({})

  const getStreamSpecificPrompt = (userData: any) => {
    const stream = userData.stream?.toLowerCase() || ""
    let streamFocus = ""
    let streamIcon = "🎓"

    if (stream.includes("pcb") || stream.includes("medical")) {
      streamFocus = "Medical & Healthcare"
      streamIcon = "🏥"
    } else if (stream.includes("pcm") || stream.includes("engineering")) {
      streamFocus = "Engineering & Technology"
      streamIcon = "⚙️"
    } else if (stream.includes("commerce")) {
      streamFocus = "Business & Commerce"
      streamIcon = "💼"
    } else if (stream.includes("arts") || stream.includes("humanities")) {
      streamFocus = "Arts & Humanities"
      streamIcon = "🎨"
    }

    return { streamFocus, streamIcon }
  }

  const generateRoadmaps = async () => {
    setLoading(true)
    try {
      const { streamFocus } = getStreamSpecificPrompt(userData)

      const response = await fetch("/api/learning-roadmap", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userData,
          careerInterests: userData.interests || ["General Development"],
          skillLevel: "Intermediate",
          streamFocus, // Pass stream focus to API
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate roadmaps")
      }

      const data = await response.json()
      setRoadmaps(data.roadmaps)
    } catch (error) {
      console.error("Error generating roadmaps:", error)
      setRoadmaps(getStreamSpecificMockRoadmaps(userData))
    } finally {
      setLoading(false)
    }
  }

  const getStreamSpecificMockRoadmaps = (userData: any): RoadmapData => {
    const stream = userData.stream?.toLowerCase() || ""
    const { streamFocus, streamIcon } = getStreamSpecificPrompt(userData)

    let roadmaps: Roadmap[] = []

    if (stream.includes("pcb") || stream.includes("medical")) {
      roadmaps = [
        {
          id: "neet-preparation",
          title: "NEET Preparation Mastery",
          description: "Complete roadmap for NEET exam preparation with focus on PCB subjects",
          duration: "12-18 months",
          difficulty: "Advanced",
          category: "Medical Entrance",
          prerequisites: ["12th PCB", "Strong foundation in Biology, Chemistry, Physics"],
          learningOutcomes: [
            "Master NEET syllabus completely",
            "Develop exam strategy and time management",
            "Achieve competitive scores",
            "Prepare for medical college admission",
          ],
          modules: [
            {
              id: "biology-mastery",
              title: "Biology Mastery for NEET",
              description: "Comprehensive coverage of NEET Biology syllabus",
              duration: "4-5 months",
              topics: ["Human Physiology", "Plant Biology", "Genetics", "Ecology", "Cell Biology"],
              resources: [
                {
                  type: "video",
                  title: "NEET Biology Complete Course",
                  description: "Comprehensive video lectures covering entire NEET Biology syllabus",
                  duration: "120 hours",
                  difficulty: "Medium",
                },
                {
                  type: "practice",
                  title: "Biology MCQ Practice",
                  description: "10,000+ NEET Biology practice questions",
                  duration: "Daily practice",
                  difficulty: "Hard",
                },
              ],
              assessment: {
                type: "quiz",
                description: "Weekly Biology mock tests",
                criteria: ["Accuracy", "Speed", "Concept clarity"],
              },
            },
          ],
          careerAlignment: ["MBBS Doctor", "BDS Dentist", "BAMS Ayurveda", "Veterinary Doctor"],
          skillsGained: ["Medical Knowledge", "Problem Solving", "Time Management", "Analytical Thinking"],
          progress: 0,
        },
        {
          id: "healthcare-fundamentals",
          title: "Healthcare & Medical Sciences Foundation",
          description: "Build strong foundation in medical sciences and healthcare systems",
          duration: "6-8 months",
          difficulty: "Intermediate",
          category: "Healthcare",
          prerequisites: ["Basic science knowledge", "Interest in healthcare"],
          learningOutcomes: [
            "Understand human anatomy and physiology",
            "Learn medical terminology",
            "Explore healthcare career options",
            "Develop patient care mindset",
          ],
          modules: [
            {
              id: "anatomy-basics",
              title: "Human Anatomy Fundamentals",
              description: "Essential anatomy knowledge for healthcare careers",
              duration: "6-8 weeks",
              topics: ["Body Systems", "Organ Functions", "Medical Terminology", "Disease Basics"],
              resources: [
                {
                  type: "course",
                  title: "Introduction to Human Anatomy",
                  description: "Interactive anatomy course with 3D models",
                  duration: "40 hours",
                  difficulty: "Easy",
                },
              ],
              assessment: {
                type: "project",
                description: "Create anatomical system presentation",
                criteria: ["Accuracy", "Visual presentation", "Understanding"],
              },
            },
          ],
          careerAlignment: ["Nurse", "Physiotherapist", "Medical Technician", "Healthcare Administrator"],
          skillsGained: ["Medical Knowledge", "Patient Care", "Communication", "Healthcare Ethics"],
          progress: 0,
        },
      ]
    } else if (stream.includes("pcm") || stream.includes("engineering")) {
      roadmaps = [
        {
          id: "jee-preparation",
          title: "JEE Preparation Excellence",
          description: "Complete roadmap for JEE Main and Advanced preparation",
          duration: "12-24 months",
          difficulty: "Advanced",
          category: "Engineering Entrance",
          prerequisites: ["12th PCM", "Strong mathematical foundation"],
          learningOutcomes: [
            "Master JEE syllabus in Physics, Chemistry, Mathematics",
            "Develop problem-solving techniques",
            "Achieve competitive JEE scores",
            "Secure admission in top engineering colleges",
          ],
          modules: [
            {
              id: "mathematics-mastery",
              title: "JEE Mathematics Mastery",
              description: "Complete mathematics preparation for JEE",
              duration: "6-8 months",
              topics: ["Calculus", "Algebra", "Coordinate Geometry", "Trigonometry", "Statistics"],
              resources: [
                {
                  type: "video",
                  title: "JEE Mathematics Complete Course",
                  description: "Comprehensive video lectures with problem-solving techniques",
                  duration: "150 hours",
                  difficulty: "Hard",
                },
              ],
              assessment: {
                type: "quiz",
                description: "Weekly mathematics mock tests",
                criteria: ["Problem-solving speed", "Accuracy", "Concept application"],
              },
            },
          ],
          careerAlignment: ["Software Engineer", "Mechanical Engineer", "Civil Engineer", "Electronics Engineer"],
          skillsGained: ["Mathematical Thinking", "Problem Solving", "Analytical Skills", "Technical Knowledge"],
          progress: 0,
        },
        {
          id: "programming-fundamentals",
          title: "Programming & Software Development",
          description: "Learn programming fundamentals and software development skills",
          duration: "8-10 months",
          difficulty: "Beginner",
          category: "Technology",
          prerequisites: ["Basic computer knowledge", "Logical thinking"],
          learningOutcomes: [
            "Master programming languages",
            "Build software applications",
            "Understand software engineering principles",
            "Prepare for tech industry careers",
          ],
          modules: [
            {
              id: "python-basics",
              title: "Python Programming Fundamentals",
              description: "Learn Python programming from scratch",
              duration: "8-10 weeks",
              topics: ["Python Syntax", "Data Structures", "Object-Oriented Programming", "File Handling"],
              resources: [
                {
                  type: "course",
                  title: "Python for Beginners",
                  description: "Interactive Python course with hands-on projects",
                  duration: "60 hours",
                  difficulty: "Easy",
                },
              ],
              assessment: {
                type: "project",
                description: "Build a Python application",
                criteria: ["Code quality", "Functionality", "Documentation"],
              },
            },
          ],
          careerAlignment: ["Software Developer", "Data Scientist", "Web Developer", "AI Engineer"],
          skillsGained: ["Programming", "Problem Solving", "Software Design", "Technical Communication"],
          progress: 0,
        },
      ]
    } else if (stream.includes("commerce")) {
      roadmaps = [
        {
          id: "business-fundamentals",
          title: "Business & Commerce Mastery",
          description: "Comprehensive business education covering all commerce subjects",
          duration: "10-12 months",
          difficulty: "Intermediate",
          category: "Business",
          prerequisites: ["Commerce background", "Basic mathematics"],
          learningOutcomes: [
            "Master accounting and finance principles",
            "Understand business operations",
            "Develop entrepreneurial skills",
            "Prepare for commerce career opportunities",
          ],
          modules: [
            {
              id: "accounting-basics",
              title: "Accounting & Financial Management",
              description: "Learn accounting principles and financial management",
              duration: "10-12 weeks",
              topics: ["Financial Accounting", "Cost Accounting", "Taxation", "Financial Analysis"],
              resources: [
                {
                  type: "course",
                  title: "Accounting Fundamentals",
                  description: "Complete accounting course with practical examples",
                  duration: "50 hours",
                  difficulty: "Medium",
                },
              ],
              assessment: {
                type: "assignment",
                description: "Prepare financial statements for a business",
                criteria: ["Accuracy", "Presentation", "Analysis"],
              },
            },
          ],
          careerAlignment: ["Chartered Accountant", "Financial Analyst", "Business Manager", "Entrepreneur"],
          skillsGained: ["Financial Analysis", "Business Acumen", "Leadership", "Strategic Thinking"],
          progress: 0,
        },
      ]
    } else {
      roadmaps = [
        {
          id: "liberal-arts",
          title: "Liberal Arts & Humanities Excellence",
          description: "Explore diverse fields in arts, literature, and social sciences",
          duration: "8-10 months",
          difficulty: "Intermediate",
          category: "Humanities",
          prerequisites: ["Interest in arts and literature", "Good communication skills"],
          learningOutcomes: [
            "Develop critical thinking skills",
            "Master communication and writing",
            "Explore creative fields",
            "Prepare for humanities careers",
          ],
          modules: [
            {
              id: "creative-writing",
              title: "Creative Writing & Literature",
              description: "Develop writing skills and literary appreciation",
              duration: "8-10 weeks",
              topics: ["Creative Writing", "Literary Analysis", "Poetry", "Storytelling"],
              resources: [
                {
                  type: "course",
                  title: "Creative Writing Workshop",
                  description: "Interactive writing course with peer feedback",
                  duration: "40 hours",
                  difficulty: "Medium",
                },
              ],
              assessment: {
                type: "project",
                description: "Create a portfolio of creative works",
                criteria: ["Creativity", "Writing quality", "Originality"],
              },
            },
          ],
          careerAlignment: ["Writer", "Journalist", "Teacher", "Content Creator"],
          skillsGained: ["Creative Writing", "Critical Thinking", "Communication", "Cultural Awareness"],
          progress: 0,
        },
      ]
    }

    return {
      roadmaps,
      recommendations: `Based on your ${streamFocus} background, these roadmaps are specifically designed to align with your academic stream and career interests. Each roadmap focuses on skills and knowledge areas that are most relevant to your chosen field of study.`,
    }
  }

  const toggleResourceCompletion = (resourceId: string) => {
    setCompletedResources((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(resourceId)) {
        newSet.delete(resourceId)
      } else {
        newSet.add(resourceId)
      }
      return newSet
    })
  }

  const toggleBookmark = (roadmapId: string) => {
    setBookmarkedRoadmaps((prev) => {
      const newBookmarks = new Set(prev)
      if (newBookmarks.has(roadmapId)) {
        newBookmarks.delete(roadmapId)
        toast({
          title: "Bookmark Removed",
          description: "Roadmap removed from your bookmarks",
        })
      } else {
        newBookmarks.add(roadmapId)
        toast({
          title: "Bookmark Added",
          description: "Roadmap saved to your bookmarks",
        })
      }
      return newBookmarks
    })
  }

  const scheduleStudy = (moduleId: string) => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    setStudySchedule((prev) => ({
      ...prev,
      [moduleId]: tomorrow,
    }))
    toast({
      title: "Study Scheduled",
      description: "Added to your study calendar for tomorrow",
    })
  }

  const shareRoadmap = (roadmap: Roadmap) => {
    if (navigator.share) {
      navigator.share({
        title: roadmap.title,
        text: roadmap.description,
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast({
        title: "Link Copied",
        description: "Roadmap link copied to clipboard",
      })
    }
  }

  useEffect(() => {
    generateRoadmaps()
  }, [])

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-6 h-6" />
            Learning & Assessment Hub
            {userData.stream && (
              <Badge variant="outline" className="ml-2">
                {getStreamSpecificPrompt(userData).streamIcon} {getStreamSpecificPrompt(userData).streamFocus}
              </Badge>
            )}
          </CardTitle>
          <CardDescription>
            Structured learning paths with weekly assessments tailored for your {userData.stream || "academic"}{" "}
            background
          </CardDescription>
        </CardHeader>
      </Card>

      {userData.stream && (
        <Card className="bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="text-2xl">{getStreamSpecificPrompt(userData).streamIcon}</div>
              <div>
                <h3 className="font-semibold text-primary">
                  Personalized for {getStreamSpecificPrompt(userData).streamFocus} Students
                </h3>
                <p className="text-sm text-muted-foreground">
                  All roadmaps below are specifically curated for your {userData.stream} background, focusing on skills
                  and knowledge areas most relevant to your field of study.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="border-b">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab("roadmaps")}
            className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
              activeTab === "roadmaps"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <BookOpen className="w-4 h-4" />
            Learning Roadmaps
          </button>
          <button
            onClick={() => setActiveTab("tests")}
            className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
              activeTab === "tests"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <Target className="w-4 h-4" />
            Weekly Tests
          </button>
          <button
            onClick={() => setActiveTab("bookmarks")}
            className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
              activeTab === "bookmarks"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <BookmarkPlus className="w-4 h-4" />
            Bookmarks ({bookmarkedRoadmaps.size})
          </button>
        </nav>
      </div>

      {activeTab === "tests" ? (
        <WeeklyTests userData={userData} currentWeek={2} />
      ) : activeTab === "bookmarks" ? (
        <div className="space-y-6">
          {bookmarkedRoadmaps.size > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {roadmaps?.roadmaps
                .filter((roadmap) => bookmarkedRoadmaps.has(roadmap.id))
                .map((roadmap) => (
                  <Card
                    key={roadmap.id}
                    className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105 border-yellow-200 bg-yellow-50"
                  >
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Star className="w-5 h-5 text-yellow-500" />
                          {roadmap.title}
                        </CardTitle>
                        <Badge className={getDifficultyColor(roadmap.difficulty)}>{roadmap.difficulty}</Badge>
                      </div>
                      <CardDescription className="line-clamp-2">{roadmap.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {roadmap.duration}
                        </span>
                        <Badge variant="outline">{roadmap.category}</Badge>
                      </div>

                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm font-medium">Progress</span>
                          <span className="text-sm">{roadmap.progress || 0}%</span>
                        </div>
                        <Progress value={roadmap.progress || 0} className="h-2" />
                      </div>

                      <div className="flex gap-2">
                        <Button className="flex-1" onClick={() => setSelectedRoadmap(roadmap)}>
                          Continue Learning
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => toggleBookmark(roadmap.id)}>
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <BookmarkPlus className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Bookmarked Roadmaps</h3>
                <p className="text-muted-foreground">Bookmark roadmaps to access them quickly</p>
              </CardContent>
            </Card>
          )}
        </div>
      ) : (
        <div>
          {loading && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <Skeleton className="h-8 w-64" />
                  <Skeleton className="h-4 w-96" />
                </CardHeader>
              </Card>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <Card key={i}>
                    <CardHeader>
                      <Skeleton className="h-6 w-48" />
                      <Skeleton className="h-4 w-32" />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-20 w-full" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {!loading && !roadmaps && (
            <Card>
              <CardContent className="text-center py-12">
                <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Unable to Load Roadmaps</h3>
                <p className="text-muted-foreground mb-4">Please try again later</p>
                <Button onClick={generateRoadmaps}>Retry</Button>
              </CardContent>
            </Card>
          )}

          {roadmaps && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {roadmaps.roadmaps.map((roadmap) => (
                <Card
                  key={roadmap.id}
                  className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105 group"
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{roadmap.title}</CardTitle>
                      <div className="flex items-center gap-2">
                        <Badge className={getDifficultyColor(roadmap.difficulty)}>{roadmap.difficulty}</Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            toggleBookmark(roadmap.id)
                          }}
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <BookmarkPlus
                            className={`w-4 h-4 ${bookmarkedRoadmaps.has(roadmap.id) ? "text-yellow-500 fill-current" : ""}`}
                          />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            shareRoadmap(roadmap)
                          }}
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Share className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <CardDescription className="line-clamp-2">{roadmap.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {roadmap.duration}
                      </span>
                      <Badge variant="outline">{roadmap.category}</Badge>
                    </div>

                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium">Progress</span>
                        <span className="text-sm">{roadmap.progress || 0}%</span>
                      </div>
                      <Progress value={roadmap.progress || 0} className="h-2" />
                    </div>

                    <div>
                      <h4 className="text-sm font-medium mb-2 flex items-center gap-1">
                        <Zap className="w-4 h-4 text-yellow-500" />
                        Key Skills
                      </h4>
                      <div className="flex flex-wrap gap-1">
                        {roadmap.skillsGained.slice(0, 3).map((skill, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                        {roadmap.skillsGained.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{roadmap.skillsGained.length - 3}
                          </Badge>
                        )}
                      </div>
                    </div>

                    <Button
                      className="w-full bg-transparent"
                      variant="outline"
                      onClick={() => setSelectedRoadmap(roadmap)}
                    >
                      Start Learning
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {selectedRoadmap && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-2xl">{selectedRoadmap.title}</CardTitle>
                      <CardDescription>{selectedRoadmap.description}</CardDescription>
                      <div className="flex items-center gap-4 mt-2">
                        <Badge className={getDifficultyColor(selectedRoadmap.difficulty)}>
                          {selectedRoadmap.difficulty}
                        </Badge>
                        <span className="text-sm text-muted-foreground">{selectedRoadmap.duration}</span>
                        <span className="text-sm text-muted-foreground">{selectedRoadmap.category}</span>
                      </div>
                    </div>
                    <Button variant="outline" onClick={() => setSelectedRoadmap(null)}>
                      Back to All Roadmaps
                    </Button>
                  </div>
                </CardHeader>
              </Card>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BookOpen className="w-5 h-5" />
                        Learning Modules
                      </CardTitle>
                      <CardDescription>Complete modules in order to build your skills progressively</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {selectedRoadmap.modules.map((module, index) => (
                        <div
                          key={module.id}
                          className="p-4 border rounded-lg cursor-pointer hover:bg-muted transition-colors"
                          onClick={() => setSelectedModule(module)}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium">
                              {index + 1}. {module.title}
                            </h4>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline">{module.duration}</Badge>
                              <ArrowRight className="w-4 h-4 text-muted-foreground" />
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">{module.description}</p>
                          <div className="flex flex-wrap gap-1">
                            {module.topics.slice(0, 3).map((topic, topicIndex) => (
                              <Badge key={topicIndex} variant="secondary" className="text-xs">
                                {topic}
                              </Badge>
                            ))}
                            {module.topics.length > 3 && (
                              <Badge variant="secondary" className="text-xs">
                                +{module.topics.length - 3} more
                              </Badge>
                            )}
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Target className="w-5 h-5" />
                        Learning Outcomes
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {selectedRoadmap.learningOutcomes.map((outcome, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm">
                            <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                            {outcome}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Lightbulb className="w-5 h-5" />
                        Skills You'll Gain
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {selectedRoadmap.skillsGained.map((skill, index) => (
                          <Badge key={index} variant="outline">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Users className="w-5 h-5" />
                        Career Alignment
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {selectedRoadmap.careerAlignment.map((career, index) => (
                          <div key={index} className="p-2 bg-muted rounded text-sm text-center">
                            {career}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Progress</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm">Overall Progress</span>
                          <span className="text-sm font-medium">{selectedRoadmap.progress || 0}%</span>
                        </div>
                        <Progress value={selectedRoadmap.progress || 0} className="h-2" />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          )}

          {selectedModule && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-2xl">{selectedModule.title}</CardTitle>
                      <CardDescription>{selectedModule.description}</CardDescription>
                    </div>
                    <Button variant="outline" onClick={() => setSelectedModule(null)}>
                      Back to Roadmap
                    </Button>
                  </div>
                </CardHeader>
              </Card>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Target className="w-5 h-5" />
                        Learning Resources
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {selectedModule.resources.map((resource, index) => {
                        const Icon = getResourceIcon(resource.type)
                        const resourceId = `${selectedModule.id}-${index}`
                        const isCompleted = completedResources.has(resourceId)

                        return (
                          <div
                            key={index}
                            className={`p-4 border rounded-lg ${isCompleted ? "bg-green-50 border-green-200" : "bg-background"}`}
                          >
                            <div className="flex items-start gap-3">
                              <Checkbox
                                checked={isCompleted}
                                onCheckedChange={() => toggleResourceCompletion(resourceId)}
                              />
                              <Icon className="w-5 h-5 text-primary mt-0.5" />
                              <div className="flex-1">
                                <div className="flex items-center justify-between mb-2">
                                  <h4 className="font-medium">{resource.title}</h4>
                                  <div className="flex items-center gap-2">
                                    <Badge variant="outline" className="text-xs">
                                      {resource.type}
                                    </Badge>
                                    <Badge className={`text-xs ${getDifficultyColor(resource.difficulty)}`}>
                                      {resource.difficulty}
                                    </Badge>
                                  </div>
                                </div>
                                <p className="text-sm text-muted-foreground mb-2">{resource.description}</p>
                                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                  <span className="flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {resource.duration}
                                  </span>
                                  {resource.url && (
                                    <Button size="sm" variant="outline" asChild>
                                      <a href={resource.url} target="_blank" rel="noopener noreferrer">
                                        Access Resource
                                        <ArrowRight className="w-3 h-3 ml-1" />
                                      </a>
                                    </Button>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Award className="w-5 h-5" />
                        Module Assessment
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <Badge variant="outline">{selectedModule.assessment.type}</Badge>
                          <h4 className="font-medium mt-2">{selectedModule.assessment.description}</h4>
                        </div>
                        <div>
                          <h5 className="font-medium mb-2">Assessment Criteria:</h5>
                          <ul className="space-y-1">
                            {selectedModule.assessment.criteria.map((criterion, index) => (
                              <li key={index} className="flex items-center gap-2 text-sm">
                                <CheckCircle className="w-4 h-4 text-green-500" />
                                {criterion}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <Button className="w-full">Submit Assessment</Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BookOpen className="w-5 h-5" />
                        Module Overview
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-2">Duration</h4>
                        <p className="text-sm text-muted-foreground">{selectedModule.duration}</p>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Topics Covered</h4>
                        <div className="space-y-1">
                          {selectedModule.topics.map((topic, index) => (
                            <Badge key={index} variant="secondary" className="mr-1 mb-1">
                              {topic}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="w-5 h-5" />
                        Progress Tracking
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between mb-2">
                            <span className="text-sm font-medium">Resources Completed</span>
                            <span className="text-sm">
                              {completedResources.size}/{selectedModule.resources.length}
                            </span>
                          </div>
                          <Progress
                            value={(completedResources.size / selectedModule.resources.length) * 100}
                            className="h-2"
                          />
                        </div>
                        <Button variant="outline" className="w-full bg-transparent">
                          <Calendar className="w-4 h-4 mr-2" />
                          Set Study Schedule
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
