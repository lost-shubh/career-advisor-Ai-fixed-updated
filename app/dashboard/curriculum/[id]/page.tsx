import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { BookOpen, Clock, Award, CheckCircle, Play, Users, Star } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"

interface CourseDetailProps {
  params: Promise<{ id: string }>
}

export default async function CourseDetailPage({ params }: CourseDetailProps) {
  const { id } = await params
  const supabase = await createClient()

  const { data: course, error } = await supabase.from("curriculum").select("*").eq("id", id).single()

  if (error || !course) {
    notFound()
  }

  // Get user progress for this course
  const {
    data: { user },
  } = await supabase.auth.getUser()

  let userProgress = null
  if (user) {
    const { data: progress } = await supabase
      .from("user_progress")
      .select("*")
      .eq("user_id", user.id)
      .eq("course_id", id)
      .single()
    userProgress = progress
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

  const isEnrolled = !!userProgress
  const isCompleted = userProgress?.status === "completed"

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" asChild>
          <Link href="/dashboard/curriculum">← Back to Curriculum</Link>
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                  {course.is_featured && (
                    <Badge variant="secondary">
                      <Star className="w-3 h-3 mr-1" />
                      Featured
                    </Badge>
                  )}
                  <Badge className={getDifficultyColor(course.difficulty_level)}>
                    {course.difficulty_level.charAt(0).toUpperCase() + course.difficulty_level.slice(1)}
                  </Badge>
                  {isCompleted && (
                    <Badge variant="default" className="bg-green-100 text-green-800">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Completed
                    </Badge>
                  )}
                </div>
              </div>

              <CardTitle className="text-3xl mb-2">{course.title}</CardTitle>
              <CardDescription className="text-lg">{course.description}</CardDescription>

              <div className="flex items-center gap-6 text-muted-foreground mt-4">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{course.duration_weeks} weeks</span>
                </div>
                <div className="flex items-center gap-1">
                  <BookOpen className="w-4 h-4" />
                  <span>{course.field}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>1,234 enrolled</span>
                </div>
              </div>

              {isEnrolled && userProgress && (
                <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">Your Progress</span>
                    <span className="text-sm text-muted-foreground">{userProgress.progress_percentage}% complete</span>
                  </div>
                  <Progress value={userProgress.progress_percentage} className="h-3" />
                </div>
              )}
            </CardHeader>
          </Card>

          {/* Skills Covered */}
          <Card>
            <CardHeader>
              <CardTitle>Skills You'll Learn</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {course.skills_covered.map((skill, index) => (
                  <Badge key={index} variant="secondary" className="text-sm">
                    {skill}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Prerequisites */}
          <Card>
            <CardHeader>
              <CardTitle>Prerequisites</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {course.prerequisites.map((prereq, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full" />
                    <span>{prereq}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Learning Outcomes */}
          <Card>
            <CardHeader>
              <CardTitle>What You'll Achieve</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {course.learning_outcomes.map((outcome, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>{outcome}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Enrollment Card */}
          <Card>
            <CardHeader>
              <CardTitle>
                {isEnrolled ? (isCompleted ? "Course Completed" : "Continue Learning") : "Enroll in Course"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isEnrolled ? (
                <div className="space-y-4">
                  {isCompleted ? (
                    <>
                      <div className="text-center py-4">
                        <Award className="w-16 h-16 text-yellow-500 mx-auto mb-2" />
                        <p className="font-medium">Congratulations!</p>
                        <p className="text-sm text-muted-foreground">You've completed this course</p>
                      </div>
                      <Button className="w-full" size="lg">
                        <Award className="w-4 h-4 mr-2" />
                        View Certificate
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button className="w-full" size="lg">
                        <Play className="w-4 h-4 mr-2" />
                        Continue Course
                      </Button>
                      <p className="text-sm text-muted-foreground text-center">
                        Enrolled on {new Date(userProgress?.enrolled_at || "").toLocaleDateString()}
                      </p>
                    </>
                  )}
                </div>
              ) : (
                <>
                  <Button className="w-full" size="lg">
                    <BookOpen className="w-4 h-4 mr-2" />
                    Enroll Now - Free
                  </Button>
                  <p className="text-sm text-muted-foreground text-center">
                    Join thousands of learners advancing their careers
                  </p>
                </>
              )}
            </CardContent>
          </Card>

          {/* Course Info */}
          <Card>
            <CardHeader>
              <CardTitle>Course Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Duration</span>
                <span className="font-medium">{course.duration_weeks} weeks</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Difficulty</span>
                <span className="font-medium capitalize">{course.difficulty_level}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Field</span>
                <span className="font-medium">{course.field}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Skills</span>
                <span className="font-medium">{course.skills_covered.length} skills</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Certificate</span>
                <span className="font-medium">Yes</span>
              </div>
            </CardContent>
          </Card>

          {/* Related Courses */}
          <Card>
            <CardHeader>
              <CardTitle>Related Courses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 border rounded-lg">
                  <h4 className="font-medium text-sm">Advanced Web Development</h4>
                  <p className="text-xs text-muted-foreground">Next level skills</p>
                </div>
                <div className="p-3 border rounded-lg">
                  <h4 className="font-medium text-sm">JavaScript Fundamentals</h4>
                  <p className="text-xs text-muted-foreground">Build strong foundations</p>
                </div>
                <Button variant="outline" size="sm" className="w-full bg-transparent">
                  View All Related
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
