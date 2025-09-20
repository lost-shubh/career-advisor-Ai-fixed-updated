"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { BookOpen, Clock, Star, Search, Filter, Play, CheckCircle, Award } from "lucide-react"
import Link from "next/link"

interface Course {
  id: string
  title: string
  description: string
  field: string
  difficulty_level: string
  duration_weeks: number
  skills_covered: string[]
  prerequisites: string[]
  learning_outcomes: string[]
  is_featured: boolean
  created_at: string
}

interface UserProgress {
  course_id: string
  progress_percentage: number
  status: string
  enrolled_at: string
}

export default function CurriculumPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [userProgress, setUserProgress] = useState<UserProgress[]>([])
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedField, setSelectedField] = useState("all")
  const [selectedLevel, setSelectedLevel] = useState("all")
  const [activeTab, setActiveTab] = useState("all")

  useEffect(() => {
    fetchCourses()
    fetchUserProgress()
  }, [])

  useEffect(() => {
    filterCourses()
  }, [courses, searchQuery, selectedField, selectedLevel, activeTab])

  const fetchCourses = async () => {
    const supabase = createClient()

    const { data, error } = await supabase
      .from("curriculum")
      .select("*")
      .order("is_featured", { ascending: false })
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching courses:", error)
    } else {
      setCourses(data || [])
    }
    setLoading(false)
  }

  const fetchUserProgress = async () => {
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return

    const { data, error } = await supabase.from("user_progress").select("*").eq("user_id", user.id)

    if (error) {
      console.error("Error fetching user progress:", error)
    } else {
      setUserProgress(data || [])
    }
  }

  const filterCourses = () => {
    let filtered = courses

    // Tab filter
    if (activeTab === "enrolled") {
      const enrolledCourseIds = userProgress.map((p) => p.course_id)
      filtered = filtered.filter((course) => enrolledCourseIds.includes(course.id))
    } else if (activeTab === "completed") {
      const completedCourseIds = userProgress.filter((p) => p.status === "completed").map((p) => p.course_id)
      filtered = filtered.filter((course) => completedCourseIds.includes(course.id))
    } else if (activeTab === "featured") {
      filtered = filtered.filter((course) => course.is_featured)
    }

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (course) =>
          course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          course.skills_covered.some((skill) => skill.toLowerCase().includes(searchQuery.toLowerCase())),
      )
    }

    // Field filter
    if (selectedField !== "all") {
      filtered = filtered.filter((course) => course.field.toLowerCase() === selectedField.toLowerCase())
    }

    // Level filter
    if (selectedLevel !== "all") {
      filtered = filtered.filter((course) => course.difficulty_level === selectedLevel)
    }

    setFilteredCourses(filtered)
  }

  const getFields = () => {
    const fields = new Set<string>()
    courses.forEach((course) => fields.add(course.field))
    return Array.from(fields)
  }

  const getCourseProgress = (courseId: string) => {
    return userProgress.find((p) => p.course_id === courseId)
  }

  const getDifficultyColor = (level: string) => {
    switch (level) {
      case "beginner":
        return "bg-green-100 text-green-800"
      case "intermediate":
        return "bg-yellow-100 text-yellow-800"
      case "advanced":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const enrollInCourse = async (courseId: string) => {
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return

    const { error } = await supabase.from("user_progress").insert([
      {
        user_id: user.id,
        course_id: courseId,
        progress_percentage: 0,
        status: "in_progress",
      },
    ])

    if (error) {
      console.error("Error enrolling in course:", error)
    } else {
      fetchUserProgress()
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-muted rounded w-1/2"></div>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse h-64 bg-muted rounded-lg"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Learning Curriculum</h1>
        <p className="text-muted-foreground">Discover courses to advance your career</p>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Search & Filter Courses
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search courses, skills, or topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select value={selectedField} onValueChange={setSelectedField}>
              <SelectTrigger>
                <SelectValue placeholder="Field" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Fields</SelectItem>
                {getFields().map((field) => (
                  <SelectItem key={field} value={field}>
                    {field}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedLevel} onValueChange={setSelectedLevel}>
              <SelectTrigger>
                <SelectValue placeholder="Difficulty Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All Courses</TabsTrigger>
          <TabsTrigger value="featured">Featured</TabsTrigger>
          <TabsTrigger value="enrolled">My Courses ({userProgress.length})</TabsTrigger>
          <TabsTrigger value="completed">
            Completed ({userProgress.filter((p) => p.status === "completed").length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-6">
          <div className="flex items-center justify-between">
            <p className="text-muted-foreground">Showing {filteredCourses.length} courses</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredCourses.map((course) => {
              const progress = getCourseProgress(course.id)
              const isEnrolled = !!progress

              return (
                <Card key={course.id} className="card-enhanced hover:shadow-lg transition-all duration-200">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {course.is_featured && (
                          <Badge variant="secondary" className="text-xs">
                            <Star className="w-3 h-3 mr-1" />
                            Featured
                          </Badge>
                        )}
                        <Badge className={getDifficultyColor(course.difficulty_level)}>
                          {course.difficulty_level.charAt(0).toUpperCase() + course.difficulty_level.slice(1)}
                        </Badge>
                      </div>
                      {progress?.status === "completed" && (
                        <Badge variant="default" className="bg-green-100 text-green-800">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Completed
                        </Badge>
                      )}
                    </div>

                    <CardTitle className="text-lg line-clamp-2">{course.title}</CardTitle>
                    <CardDescription className="line-clamp-3">{course.description}</CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{course.duration_weeks} weeks</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <BookOpen className="w-4 h-4" />
                        <span>{course.field}</span>
                      </div>
                    </div>

                    {isEnrolled && progress && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span>{progress.progress_percentage}%</span>
                        </div>
                        <Progress value={progress.progress_percentage} className="h-2" />
                      </div>
                    )}

                    <div>
                      <p className="text-sm font-medium mb-2">Skills you'll learn</p>
                      <div className="flex flex-wrap gap-1">
                        {course.skills_covered.slice(0, 4).map((skill, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                        {course.skills_covered.length > 4 && (
                          <Badge variant="outline" className="text-xs">
                            +{course.skills_covered.length - 4} more
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      {isEnrolled ? (
                        <Button className="flex-1" asChild>
                          <Link href={`/dashboard/curriculum/${course.id}`}>
                            {progress?.status === "completed" ? (
                              <>
                                <Award className="w-4 h-4 mr-1" />
                                View Certificate
                              </>
                            ) : (
                              <>
                                <Play className="w-4 h-4 mr-1" />
                                Continue Learning
                              </>
                            )}
                          </Link>
                        </Button>
                      ) : (
                        <>
                          <Button variant="outline" className="flex-1 bg-transparent" asChild>
                            <Link href={`/dashboard/curriculum/${course.id}`}>View Details</Link>
                          </Button>
                          <Button onClick={() => enrollInCourse(course.id)}>Enroll</Button>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {filteredCourses.length === 0 && (
            <Card>
              <CardContent className="text-center py-12">
                <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No courses found</h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your search criteria or filters to find more courses.
                </p>
                <Button
                  onClick={() => {
                    setSearchQuery("")
                    setSelectedField("all")
                    setSelectedLevel("all")
                  }}
                >
                  Clear Filters
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
