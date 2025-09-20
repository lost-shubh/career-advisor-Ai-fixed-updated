"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/hooks/use-toast"
import {
  Clock,
  CheckCircle,
  Target,
  AlertCircle,
  BarChart3,
  Brain,
  TrendingUp,
  Award,
  Star,
  Zap,
  BookOpen,
  Users,
  Trophy,
  Medal,
  Lightbulb,
  Activity,
  PieChart,
  RefreshCw,
  ArrowRight,
} from "lucide-react"

interface EnhancedAssessmentSystemProps {
  userData: any
}

interface SkillAssessment {
  id: string
  name: string
  category: string
  description: string
  difficulty: "Beginner" | "Intermediate" | "Advanced"
  duration: number
  questions: AssessmentQuestion[]
  skillsEvaluated: string[]
  adaptiveLevel: boolean
  prerequisites?: string[]
  certification?: boolean
}

interface AssessmentQuestion {
  id: string
  type: "multiple-choice" | "coding" | "scenario" | "drag-drop" | "matching"
  question: string
  options?: string[]
  correctAnswer?: any
  points: number
  difficulty: "Easy" | "Medium" | "Hard"
  skill: string
  explanation?: string
  codeTemplate?: string
  testCases?: Array<{ input: string; output: string }>
}

interface AssessmentResult {
  assessmentId: string
  score: number
  skillBreakdown: Record<string, number>
  timeSpent: number
  completedAt: Date
  recommendations: string[]
  strengths: string[]
  weaknesses: string[]
  nextSteps: string[]
}

interface LearningPath {
  id: string
  name: string
  description: string
  assessments: string[]
  estimatedTime: string
  difficulty: string
  completionRate: number
}

const skillCategories = {
  technical: {
    name: "Technical Skills",
    icon: Brain,
    color: "text-blue-500",
    skills: ["Programming", "Data Analysis", "System Design", "Database Management", "Web Development"],
  },
  analytical: {
    name: "Analytical Skills",
    icon: BarChart3,
    color: "text-green-500",
    skills: ["Problem Solving", "Critical Thinking", "Data Interpretation", "Research", "Logic"],
  },
  communication: {
    name: "Communication Skills",
    icon: Users,
    color: "text-purple-500",
    skills: ["Written Communication", "Presentation", "Teamwork", "Leadership", "Negotiation"],
  },
  domain: {
    name: "Domain Knowledge",
    icon: BookOpen,
    color: "text-orange-500",
    skills: ["Industry Knowledge", "Business Acumen", "Regulatory Knowledge", "Best Practices"],
  },
}

const sampleAssessments: SkillAssessment[] = [
  {
    id: "programming-fundamentals",
    name: "Programming Fundamentals Assessment",
    category: "technical",
    description: "Evaluate your understanding of basic programming concepts and problem-solving skills",
    difficulty: "Beginner",
    duration: 45,
    adaptiveLevel: true,
    skillsEvaluated: ["Programming", "Problem Solving", "Logic"],
    certification: true,
    questions: [
      {
        id: "q1",
        type: "multiple-choice",
        question: "What is the time complexity of binary search?",
        options: ["O(n)", "O(log n)", "O(n²)", "O(1)"],
        correctAnswer: 1,
        points: 10,
        difficulty: "Medium",
        skill: "Programming",
        explanation:
          "Binary search divides the search space in half with each iteration, resulting in O(log n) complexity.",
      },
      {
        id: "q2",
        type: "coding",
        question: "Write a function to reverse a string without using built-in reverse methods.",
        points: 20,
        difficulty: "Easy",
        skill: "Programming",
        codeTemplate: "def reverse_string(s):\n    # Your code here\n    pass",
        testCases: [
          { input: "hello", output: "olleh" },
          { input: "world", output: "dlrow" },
          { input: "a", output: "a" },
        ],
      },
      {
        id: "q3",
        type: "scenario",
        question:
          "You need to store user data that requires fast lookups by user ID. Which data structure would you choose and why?",
        points: 15,
        difficulty: "Medium",
        skill: "Problem Solving",
        explanation: "A hash table/dictionary would be ideal for O(1) average-case lookup time by user ID.",
      },
    ],
  },
  {
    id: "data-analysis-skills",
    name: "Data Analysis & Interpretation",
    category: "analytical",
    description: "Test your ability to analyze data, draw insights, and make data-driven decisions",
    difficulty: "Intermediate",
    duration: 60,
    adaptiveLevel: false,
    skillsEvaluated: ["Data Analysis", "Critical Thinking", "Data Interpretation"],
    questions: [
      {
        id: "q1",
        type: "multiple-choice",
        question:
          "Which statistical measure is most appropriate for describing the central tendency of a highly skewed dataset?",
        options: ["Mean", "Median", "Mode", "Range"],
        correctAnswer: 1,
        points: 10,
        difficulty: "Medium",
        skill: "Data Analysis",
        explanation: "The median is less affected by outliers and extreme values in skewed distributions.",
      },
    ],
  },
  {
    id: "communication-assessment",
    name: "Professional Communication Skills",
    category: "communication",
    description: "Evaluate your written and verbal communication abilities in professional contexts",
    difficulty: "Intermediate",
    duration: 40,
    adaptiveLevel: false,
    skillsEvaluated: ["Written Communication", "Presentation", "Professional Communication"],
    questions: [
      {
        id: "q1",
        type: "scenario",
        question:
          "You need to explain a complex technical concept to a non-technical stakeholder. Describe your approach.",
        points: 20,
        difficulty: "Medium",
        skill: "Written Communication",
      },
    ],
  },
]

const learningPaths: LearningPath[] = [
  {
    id: "full-stack-developer",
    name: "Full-Stack Developer Path",
    description: "Complete assessment journey for aspiring full-stack developers",
    assessments: ["programming-fundamentals", "data-analysis-skills"],
    estimatedTime: "3-4 hours",
    difficulty: "Intermediate",
    completionRate: 0,
  },
  {
    id: "data-analyst",
    name: "Data Analyst Path",
    description: "Comprehensive assessments for data analysis roles",
    assessments: ["data-analysis-skills", "communication-assessment"],
    estimatedTime: "2-3 hours",
    difficulty: "Intermediate",
    completionRate: 0,
  },
]

export function EnhancedAssessmentSystem({ userData }: EnhancedAssessmentSystemProps) {
  const [activeTab, setActiveTab] = useState("overview")
  const [selectedAssessment, setSelectedAssessment] = useState<SkillAssessment | null>(null)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<string, any>>({})
  const [assessmentStartTime, setAssessmentStartTime] = useState<Date | null>(null)
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [showResults, setShowResults] = useState(false)
  const [assessmentResults, setAssessmentResults] = useState<AssessmentResult | null>(null)
  const [completedAssessments, setCompletedAssessments] = useState<Set<string>>(new Set())
  const [skillLevels, setSkillLevels] = useState<Record<string, number>>({})
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedDifficulty, setSelectedDifficulty] = useState("all")

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (assessmentStartTime && timeRemaining > 0 && !showResults) {
      interval = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            handleSubmitAssessment()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [assessmentStartTime, timeRemaining, showResults])

  const startAssessment = (assessment: SkillAssessment) => {
    setSelectedAssessment(assessment)
    setCurrentQuestion(0)
    setAnswers({})
    setAssessmentStartTime(new Date())
    setTimeRemaining(assessment.duration * 60)
    setShowResults(false)
    setAssessmentResults(null)
  }

  const handleAnswerChange = (questionId: string, answer: any) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }))
  }

  const calculateAssessmentScore = (
    assessment: SkillAssessment,
    userAnswers: Record<string, any>,
  ): AssessmentResult => {
    let totalScore = 0
    let maxScore = 0
    const skillBreakdown: Record<string, number> = {}
    const skillMaxScores: Record<string, number> = {}

    assessment.questions.forEach((question) => {
      maxScore += question.points
      const skill = question.skill

      if (!skillMaxScores[skill]) {
        skillMaxScores[skill] = 0
        skillBreakdown[skill] = 0
      }
      skillMaxScores[skill] += question.points

      const userAnswer = userAnswers[question.id]
      let questionScore = 0

      if (question.type === "multiple-choice") {
        if (userAnswer === question.correctAnswer) {
          questionScore = question.points
        }
      } else if (question.type === "coding") {
        // Simplified coding evaluation - in real app would use code execution
        if (userAnswer && userAnswer.length > 20) {
          questionScore = Math.floor(question.points * 0.7) // 70% for attempt
        }
      } else if (question.type === "scenario") {
        // Simplified scenario evaluation
        if (userAnswer && userAnswer.length > 50) {
          questionScore = Math.floor(question.points * 0.8) // 80% for detailed answer
        }
      }

      totalScore += questionScore
      skillBreakdown[skill] += questionScore
    })

    // Convert to percentages
    Object.keys(skillBreakdown).forEach((skill) => {
      skillBreakdown[skill] = Math.round((skillBreakdown[skill] / skillMaxScores[skill]) * 100)
    })

    const overallScore = Math.round((totalScore / maxScore) * 100)

    // Generate recommendations based on performance
    const recommendations = []
    const strengths = []
    const weaknesses = []
    const nextSteps = []

    Object.entries(skillBreakdown).forEach(([skill, score]) => {
      if (score >= 80) {
        strengths.push(skill)
      } else if (score < 60) {
        weaknesses.push(skill)
        recommendations.push(`Focus on improving ${skill} through additional practice`)
      }
    })

    if (overallScore >= 80) {
      nextSteps.push("Consider taking advanced assessments in this area")
      nextSteps.push("Explore specialized certifications")
    } else if (overallScore >= 60) {
      nextSteps.push("Review weak areas and practice more")
      nextSteps.push("Take supplementary learning modules")
    } else {
      nextSteps.push("Revisit fundamental concepts")
      nextSteps.push("Consider taking prerequisite courses")
    }

    return {
      assessmentId: assessment.id,
      score: overallScore,
      skillBreakdown,
      timeSpent: Math.floor((new Date().getTime() - (assessmentStartTime?.getTime() || 0)) / 1000 / 60),
      completedAt: new Date(),
      recommendations,
      strengths,
      weaknesses,
      nextSteps,
    }
  }

  const handleSubmitAssessment = () => {
    if (!selectedAssessment || !assessmentStartTime) return

    const result = calculateAssessmentScore(selectedAssessment, answers)
    setAssessmentResults(result)
    setShowResults(true)
    setCompletedAssessments((prev) => new Set([...prev, selectedAssessment.id]))

    // Update skill levels
    setSkillLevels((prev) => ({
      ...prev,
      ...result.skillBreakdown,
    }))

    toast({
      title: "Assessment Completed!",
      description: `You scored ${result.score}% on ${selectedAssessment.name}`,
    })
  }

  const nextQuestion = () => {
    if (selectedAssessment && currentQuestion < selectedAssessment.questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1)
    }
  }

  const previousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1)
    }
  }

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  const filteredAssessments = sampleAssessments.filter((assessment) => {
    const categoryMatch = selectedCategory === "all" || assessment.category === selectedCategory
    const difficultyMatch = selectedDifficulty === "all" || assessment.difficulty === selectedDifficulty
    return categoryMatch && difficultyMatch
  })

  const getSkillLevel = (score: number): { level: string; color: string } => {
    if (score >= 90) return { level: "Expert", color: "text-purple-600" }
    if (score >= 80) return { level: "Advanced", color: "text-blue-600" }
    if (score >= 70) return { level: "Intermediate", color: "text-green-600" }
    if (score >= 60) return { level: "Beginner", color: "text-yellow-600" }
    return { level: "Novice", color: "text-gray-600" }
  }

  // Assessment Results View
  if (showResults && assessmentResults && selectedAssessment) {
    return (
      <div className="space-y-6">
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4">
              <Trophy className="w-16 h-16 text-yellow-500" />
            </div>
            <CardTitle className="text-2xl">Assessment Complete!</CardTitle>
            <CardDescription>Here's your detailed performance analysis for {selectedAssessment.name}</CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="text-6xl font-bold text-primary">{assessmentResults.score}%</div>
            <div className="text-lg text-muted-foreground">Overall Score</div>
            <div className="flex justify-center gap-6 text-sm">
              <span>Time: {assessmentResults.timeSpent} minutes</span>
              <span>Questions: {selectedAssessment.questions.length}</span>
              <span>Difficulty: {selectedAssessment.difficulty}</span>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Skill Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Skill Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(assessmentResults.skillBreakdown).map(([skill, score]) => {
                const { level, color } = getSkillLevel(score)
                return (
                  <div key={skill} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{skill}</span>
                      <div className="flex items-center gap-2">
                        <Badge className={color}>{level}</Badge>
                        <span className="font-bold">{score}%</span>
                      </div>
                    </div>
                    <Progress value={score} className="h-2" />
                  </div>
                )
              })}
            </CardContent>
          </Card>

          {/* Strengths & Weaknesses */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                Performance Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {assessmentResults.strengths.length > 0 && (
                <div>
                  <h4 className="font-medium text-green-600 mb-2 flex items-center gap-1">
                    <CheckCircle className="w-4 h-4" />
                    Strengths
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {assessmentResults.strengths.map((strength, index) => (
                      <Badge key={index} variant="secondary" className="bg-green-100 text-green-800">
                        {strength}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {assessmentResults.weaknesses.length > 0 && (
                <div>
                  <h4 className="font-medium text-orange-600 mb-2 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    Areas for Improvement
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {assessmentResults.weaknesses.map((weakness, index) => (
                      <Badge key={index} variant="secondary" className="bg-orange-100 text-orange-800">
                        {weakness}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recommendations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5" />
              Personalized Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-3">Recommendations</h4>
                <ul className="space-y-2">
                  {assessmentResults.recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <Star className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-3">Next Steps</h4>
                <ul className="space-y-2">
                  {assessmentResults.nextSteps.map((step, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <ArrowRight className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                      {step}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button onClick={() => setSelectedAssessment(null)} variant="outline">
            Back to Assessments
          </Button>
          <Button onClick={() => startAssessment(selectedAssessment)}>Retake Assessment</Button>
          {selectedAssessment.certification && assessmentResults.score >= 80 && (
            <Button className="bg-gradient-to-r from-yellow-500 to-orange-500">
              <Award className="w-4 h-4 mr-2" />
              Get Certificate
            </Button>
          )}
        </div>
      </div>
    )
  }

  // Assessment Taking View
  if (selectedAssessment && !showResults) {
    const question = selectedAssessment.questions[currentQuestion]
    const progress = ((currentQuestion + 1) / selectedAssessment.questions.length) * 100

    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>{selectedAssessment.name}</CardTitle>
                <CardDescription>
                  Question {currentQuestion + 1} of {selectedAssessment.questions.length}
                </CardDescription>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-primary">{formatTime(timeRemaining)}</div>
                <div className="text-sm text-muted-foreground">Time Remaining</div>
              </div>
            </div>
            <Progress value={progress} className="mt-4" />
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{question.question}</CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="outline">{question.points} points</Badge>
              <Badge variant="secondary">{question.difficulty}</Badge>
              <Badge className="bg-blue-100 text-blue-800">{question.skill}</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {question.type === "multiple-choice" && question.options && (
              <RadioGroup
                value={answers[question.id]?.toString() || ""}
                onValueChange={(value) => handleAnswerChange(question.id, Number.parseInt(value))}
              >
                {question.options.map((option, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                    <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                      {option}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            )}

            {question.type === "coding" && (
              <div className="space-y-4">
                <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm">
                  <pre>{question.codeTemplate}</pre>
                </div>
                <Textarea
                  placeholder="Write your code here..."
                  value={answers[question.id] || ""}
                  onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                  rows={8}
                  className="font-mono"
                />
                {question.testCases && (
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <h4 className="font-medium mb-2">Test Cases:</h4>
                    {question.testCases.map((testCase, index) => (
                      <div key={index} className="text-sm">
                        Input: <code>{testCase.input}</code> → Output: <code>{testCase.output}</code>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {question.type === "scenario" && (
              <Textarea
                placeholder="Describe your approach and reasoning..."
                value={answers[question.id] || ""}
                onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                rows={6}
              />
            )}
          </CardContent>
        </Card>

        <div className="flex justify-between">
          <Button variant="outline" onClick={previousQuestion} disabled={currentQuestion === 0}>
            Previous
          </Button>
          <div className="flex gap-2">
            {currentQuestion === selectedAssessment.questions.length - 1 ? (
              <Button onClick={handleSubmitAssessment}>Submit Assessment</Button>
            ) : (
              <Button onClick={nextQuestion}>Next</Button>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-6 h-6" />
            Enhanced Assessment System
          </CardTitle>
          <CardDescription>
            Comprehensive skill assessments with adaptive testing, detailed analytics, and personalized recommendations
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="assessments" className="flex items-center gap-2">
            <Target className="w-4 h-4" />
            Assessments
          </TabsTrigger>
          <TabsTrigger value="skills" className="flex items-center gap-2">
            <Zap className="w-4 h-4" />
            Skill Profile
          </TabsTrigger>
          <TabsTrigger value="paths" className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Learning Paths
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Progress Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2">
                  <Trophy className="w-8 h-8 text-yellow-500" />
                  <div>
                    <div className="text-2xl font-bold">{completedAssessments.size}</div>
                    <div className="text-sm text-muted-foreground">Completed</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2">
                  <Star className="w-8 h-8 text-blue-500" />
                  <div>
                    <div className="text-2xl font-bold">
                      {Object.keys(skillLevels).length > 0
                        ? Math.round(
                            Object.values(skillLevels).reduce((a, b) => a + b, 0) / Object.values(skillLevels).length,
                          )
                        : 0}
                      %
                    </div>
                    <div className="text-sm text-muted-foreground">Avg Score</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2">
                  <Medal className="w-8 h-8 text-green-500" />
                  <div>
                    <div className="text-2xl font-bold">
                      {Object.values(skillLevels).filter((score) => score >= 80).length}
                    </div>
                    <div className="text-sm text-muted-foreground">Expert Skills</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2">
                  <Activity className="w-8 h-8 text-purple-500" />
                  <div>
                    <div className="text-2xl font-bold">{sampleAssessments.length - completedAssessments.size}</div>
                    <div className="text-sm text-muted-foreground">Available</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Recent Assessment Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              {completedAssessments.size > 0 ? (
                <div className="space-y-3">
                  {Array.from(completedAssessments)
                    .slice(0, 3)
                    .map((assessmentId) => {
                      const assessment = sampleAssessments.find((a) => a.id === assessmentId)
                      if (!assessment) return null
                      return (
                        <div key={assessmentId} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <CheckCircle className="w-5 h-5 text-green-500" />
                            <div>
                              <div className="font-medium">{assessment.name}</div>
                              <div className="text-sm text-muted-foreground">{assessment.category}</div>
                            </div>
                          </div>
                          <Badge variant="secondary">Completed</Badge>
                        </div>
                      )
                    })}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Brain className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No assessments completed yet. Start with a skill assessment!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="assessments" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <Label className="text-sm font-medium">Category</Label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {Object.entries(skillCategories).map(([key, category]) => (
                        <SelectItem key={key} value={key}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex-1">
                  <Label className="text-sm font-medium">Difficulty</Label>
                  <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Levels" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Levels</SelectItem>
                      <SelectItem value="Beginner">Beginner</SelectItem>
                      <SelectItem value="Intermediate">Intermediate</SelectItem>
                      <SelectItem value="Advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Assessments Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAssessments.map((assessment) => {
              const categoryInfo = skillCategories[assessment.category as keyof typeof skillCategories]
              const CategoryIcon = categoryInfo.icon
              const isCompleted = completedAssessments.has(assessment.id)

              return (
                <Card
                  key={assessment.id}
                  className={`transition-all duration-200 hover:shadow-lg ${isCompleted ? "border-green-200 bg-green-50" : ""}`}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <CategoryIcon className={`w-5 h-5 ${categoryInfo.color}`} />
                        <Badge variant="outline">{categoryInfo.name}</Badge>
                      </div>
                      {isCompleted && <CheckCircle className="w-5 h-5 text-green-500" />}
                    </div>
                    <CardTitle className="text-lg">{assessment.name}</CardTitle>
                    <CardDescription>{assessment.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Duration:</span>
                        <span className="text-muted-foreground ml-1">{assessment.duration} min</span>
                      </div>
                      <div>
                        <span className="font-medium">Questions:</span>
                        <span className="text-muted-foreground ml-1">{assessment.questions.length}</span>
                      </div>
                      <div>
                        <span className="font-medium">Difficulty:</span>
                        <Badge
                          className={`ml-1 ${
                            assessment.difficulty === "Beginner"
                              ? "bg-green-500"
                              : assessment.difficulty === "Intermediate"
                                ? "bg-yellow-500"
                                : "bg-red-500"
                          }`}
                        >
                          {assessment.difficulty}
                        </Badge>
                      </div>
                      <div>
                        <span className="font-medium">Type:</span>
                        <span className="text-muted-foreground ml-1">
                          {assessment.adaptiveLevel ? "Adaptive" : "Standard"}
                        </span>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium mb-2">Skills Evaluated:</h4>
                      <div className="flex flex-wrap gap-1">
                        {assessment.skillsEvaluated.map((skill, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <Button
                      onClick={() => startAssessment(assessment)}
                      className="w-full"
                      variant={isCompleted ? "outline" : "default"}
                    >
                      {isCompleted ? (
                        <>
                          <RefreshCw className="w-4 h-4 mr-2" />
                          Retake Assessment
                        </>
                      ) : (
                        <>
                          <Target className="w-4 h-4 mr-2" />
                          Start Assessment
                        </>
                      )}
                    </Button>

                    {assessment.certification && (
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Award className="w-3 h-3" />
                        Certification available
                      </div>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="skills" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Your Skill Profile
              </CardTitle>
              <CardDescription>Track your skill development across different categories</CardDescription>
            </CardHeader>
            <CardContent>
              {Object.keys(skillLevels).length > 0 ? (
                <div className="space-y-6">
                  {Object.entries(skillCategories).map(([categoryKey, category]) => {
                    const categorySkills = Object.entries(skillLevels).filter(([skill]) =>
                      category.skills.some((catSkill) => skill.includes(catSkill) || catSkill.includes(skill)),
                    )

                    if (categorySkills.length === 0) return null

                    const CategoryIcon = category.icon
                    return (
                      <div key={categoryKey} className="space-y-3">
                        <h3 className="font-semibold flex items-center gap-2">
                          <CategoryIcon className={`w-5 h-5 ${category.color}`} />
                          {category.name}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {categorySkills.map(([skill, score]) => {
                            const { level, color } = getSkillLevel(score)
                            return (
                              <div key={skill} className="space-y-2">
                                <div className="flex justify-between items-center">
                                  <span className="font-medium">{skill}</span>
                                  <div className="flex items-center gap-2">
                                    <Badge className={color}>{level}</Badge>
                                    <span className="font-bold">{score}%</span>
                                  </div>
                                </div>
                                <Progress value={score} className="h-2" />
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="text-center py-12">
                  <PieChart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Skill Data Yet</h3>
                  <p className="text-muted-foreground mb-4">Complete assessments to build your skill profile</p>
                  <Button onClick={() => setActiveTab("assessments")}>Take Your First Assessment</Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="paths" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Learning Paths
              </CardTitle>
              <CardDescription>Structured assessment journeys for specific career goals</CardDescription>
            </CardHeader>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {learningPaths.map((path) => (
              <Card key={path.id}>
                <CardHeader>
                  <CardTitle>{path.name}</CardTitle>
                  <CardDescription>{path.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Duration:</span>
                      <span className="text-muted-foreground ml-1">{path.estimatedTime}</span>
                    </div>
                    <div>
                      <span className="font-medium">Difficulty:</span>
                      <span className="text-muted-foreground ml-1">{path.difficulty}</span>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Progress</span>
                      <span className="text-sm">{path.completionRate}%</span>
                    </div>
                    <Progress value={path.completionRate} className="h-2" />
                  </div>

                  <div>
                    <h4 className="text-sm font-medium mb-2">Included Assessments:</h4>
                    <div className="space-y-1">
                      {path.assessments.map((assessmentId) => {
                        const assessment = sampleAssessments.find((a) => a.id === assessmentId)
                        const isCompleted = completedAssessments.has(assessmentId)
                        return (
                          <div key={assessmentId} className="flex items-center gap-2 text-sm">
                            {isCompleted ? (
                              <CheckCircle className="w-4 h-4 text-green-500" />
                            ) : (
                              <Clock className="w-4 h-4 text-muted-foreground" />
                            )}
                            <span className={isCompleted ? "text-green-600" : "text-muted-foreground"}>
                              {assessment?.name || assessmentId}
                            </span>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  <Button className="w-full bg-transparent" variant="outline">
                    Start Learning Path
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
