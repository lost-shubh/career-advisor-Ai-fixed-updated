"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Brain, Target, TrendingUp, CheckCircle, ArrowRight, BarChart3 } from "lucide-react"
import { SkillsVisualization } from "./skills-visualization"

interface SkillsAssessmentProps {
  userData: any
}

const assessmentCategories = [
  {
    id: "technical",
    title: "Technical Skills",
    description: "Programming, tools, and technical knowledge",
    icon: Brain,
    color: "bg-primary text-primary-foreground",
  },
  {
    id: "analytical",
    title: "Analytical Thinking",
    description: "Problem-solving and logical reasoning",
    icon: Target,
    color: "bg-secondary text-secondary-foreground",
  },
  {
    id: "communication",
    title: "Communication",
    description: "Written and verbal communication skills",
    icon: TrendingUp,
    color: "bg-accent text-accent-foreground",
  },
  {
    id: "leadership",
    title: "Leadership",
    description: "Team management and leadership abilities",
    icon: CheckCircle,
    color: "bg-muted text-muted-foreground",
  },
]

const sampleQuestions = {
  technical: [
    {
      id: 1,
      question: "How comfortable are you with programming languages?",
      options: [
        { value: "1", label: "Never programmed before" },
        { value: "2", label: "Basic understanding of one language" },
        { value: "3", label: "Comfortable with 1-2 languages" },
        { value: "4", label: "Proficient in multiple languages" },
        { value: "5", label: "Expert level programmer" },
      ],
    },
    {
      id: 2,
      question: "How do you approach learning new technologies?",
      options: [
        { value: "1", label: "I avoid new technologies" },
        { value: "2", label: "I learn when required" },
        { value: "3", label: "I'm curious about new tech" },
        { value: "4", label: "I actively seek new technologies" },
        { value: "5", label: "I'm an early adopter" },
      ],
    },
    {
      id: 3,
      question: "How would you rate your problem-solving approach in technical scenarios?",
      options: [
        { value: "1", label: "I get stuck easily" },
        { value: "2", label: "I need guidance often" },
        { value: "3", label: "I can solve basic problems" },
        { value: "4", label: "I solve complex problems independently" },
        { value: "5", label: "I excel at debugging and optimization" },
      ],
    },
  ],
  analytical: [
    {
      id: 1,
      question: "When faced with a complex problem, what's your first approach?",
      options: [
        { value: "1", label: "I feel overwhelmed and seek help immediately" },
        { value: "2", label: "I try random solutions" },
        { value: "3", label: "I break it down into smaller parts" },
        { value: "4", label: "I analyze patterns and create systematic solutions" },
        { value: "5", label: "I identify root causes and develop comprehensive strategies" },
      ],
    },
    {
      id: 2,
      question: "How do you handle data and information analysis?",
      options: [
        { value: "1", label: "I find data analysis confusing" },
        { value: "2", label: "I can understand basic charts" },
        { value: "3", label: "I can interpret most data presentations" },
        { value: "4", label: "I can create insights from raw data" },
        { value: "5", label: "I excel at finding patterns and trends" },
      ],
    },
    {
      id: 3,
      question: "How do you approach decision-making?",
      options: [
        { value: "1", label: "I rely on others' decisions" },
        { value: "2", label: "I make quick gut decisions" },
        { value: "3", label: "I consider pros and cons" },
        { value: "4", label: "I gather data and analyze options" },
        { value: "5", label: "I use systematic frameworks and consider long-term impacts" },
      ],
    },
  ],
  communication: [
    {
      id: 1,
      question: "How comfortable are you presenting ideas to a group?",
      options: [
        { value: "1", label: "I avoid presentations completely" },
        { value: "2", label: "I'm very nervous but can manage" },
        { value: "3", label: "I'm comfortable with small groups" },
        { value: "4", label: "I enjoy presenting to any size group" },
        { value: "5", label: "I'm a confident and engaging presenter" },
      ],
    },
    {
      id: 2,
      question: "How do you handle written communication?",
      options: [
        { value: "1", label: "I struggle with writing clearly" },
        { value: "2", label: "I can write basic messages" },
        { value: "3", label: "I write clearly and concisely" },
        { value: "4", label: "I adapt my writing style to different audiences" },
        { value: "5", label: "I excel at persuasive and technical writing" },
      ],
    },
    {
      id: 3,
      question: "How do you handle conflicts or disagreements?",
      options: [
        { value: "1", label: "I avoid conflicts at all costs" },
        { value: "2", label: "I get defensive or emotional" },
        { value: "3", label: "I try to find middle ground" },
        { value: "4", label: "I facilitate productive discussions" },
        { value: "5", label: "I turn conflicts into collaborative solutions" },
      ],
    },
  ],
  leadership: [
    {
      id: 1,
      question: "How do you approach working in teams?",
      options: [
        { value: "1", label: "I prefer to work alone" },
        { value: "2", label: "I follow others' lead" },
        { value: "3", label: "I contribute actively to team goals" },
        { value: "4", label: "I often take initiative in group projects" },
        { value: "5", label: "I naturally emerge as a team leader" },
      ],
    },
    {
      id: 2,
      question: "How do you handle responsibility and accountability?",
      options: [
        { value: "1", label: "I avoid taking responsibility" },
        { value: "2", label: "I take responsibility when asked" },
        { value: "3", label: "I'm reliable and accountable" },
        { value: "4", label: "I proactively take ownership" },
        { value: "5", label: "I inspire accountability in others" },
      ],
    },
    {
      id: 3,
      question: "How do you motivate others?",
      options: [
        { value: "1", label: "I don't try to motivate others" },
        { value: "2", label: "I offer basic encouragement" },
        { value: "3", label: "I support team members when needed" },
        { value: "4", label: "I actively help others achieve their goals" },
        { value: "5", label: "I inspire and empower others to excel" },
      ],
    },
  ],
}

export function SkillsAssessment({ userData }: SkillsAssessmentProps) {
  const [currentCategory, setCurrentCategory] = useState<string | null>(null)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<string, Record<number, string>>>({})
  const [completedCategories, setCompletedCategories] = useState<string[]>([])
  const [showResults, setShowResults] = useState(false)

  const handleStartAssessment = (categoryId: string) => {
    setCurrentCategory(categoryId)
    setCurrentQuestion(0)
  }

  const handleAnswer = (questionId: number, value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [currentCategory!]: {
        ...prev[currentCategory!],
        [questionId]: value,
      },
    }))
  }

  const handleNext = () => {
    const questions = sampleQuestions[currentCategory as keyof typeof sampleQuestions]
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      // Complete category
      setCompletedCategories((prev) => [...prev, currentCategory!])
      setCurrentCategory(null)
      setCurrentQuestion(0)
    }
  }

  const calculateSkillScore = (categoryId: string) => {
    const categoryAnswers = answers[categoryId] || {}
    const scores = Object.values(categoryAnswers).map(Number)
    if (scores.length === 0) return 0
    return Math.round((scores.reduce((sum, score) => sum + score, 0) / scores.length) * 20)
  }

  const getSkillLevel = (score: number) => {
    if (score >= 80) return { level: "Expert", color: "bg-green-500" }
    if (score >= 60) return { level: "Advanced", color: "bg-blue-500" }
    if (score >= 40) return { level: "Intermediate", color: "bg-yellow-500" }
    if (score >= 20) return { level: "Beginner", color: "bg-orange-500" }
    return { level: "Novice", color: "bg-red-500" }
  }

  if (showResults) {
    return <SkillsVisualization userData={userData} skillsData={answers} />
  }

  if (currentCategory) {
    const questions = sampleQuestions[currentCategory as keyof typeof sampleQuestions]
    const question = questions[currentQuestion]
    const categoryInfo = assessmentCategories.find((cat) => cat.id === currentCategory)!
    const currentAnswer = answers[currentCategory]?.[question.id]

    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full ${categoryInfo.color} flex items-center justify-center`}>
                  <categoryInfo.icon className="w-5 h-5" />
                </div>
                <div>
                  <CardTitle>{categoryInfo.title} Assessment</CardTitle>
                  <CardDescription>
                    Question {currentQuestion + 1} of {questions.length}
                  </CardDescription>
                </div>
              </div>
              <Button variant="outline" onClick={() => setCurrentCategory(null)}>
                Back to Categories
              </Button>
            </div>
            <Progress value={((currentQuestion + 1) / questions.length) * 100} className="mt-4" />
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">{question.question}</h3>
              <RadioGroup value={currentAnswer} onValueChange={(value) => handleAnswer(question.id, value)}>
                {question.options.map((option) => (
                  <div key={option.value} className="flex items-center space-x-2 p-3 rounded-lg hover:bg-muted">
                    <RadioGroupItem value={option.value} id={option.value} />
                    <Label htmlFor={option.value} className="flex-1 cursor-pointer">
                      {option.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
                disabled={currentQuestion === 0}
              >
                Previous
              </Button>
              <Button onClick={handleNext} disabled={!currentAnswer}>
                {currentQuestion === questions.length - 1 ? "Complete Category" : "Next Question"}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-6 h-6" />
            Skills Assessment & Mapping
          </CardTitle>
          <CardDescription>
            Take comprehensive assessments to discover your strengths and identify areas for growth. Complete all
            categories for detailed insights.
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {assessmentCategories.map((category) => {
          const isCompleted = completedCategories.includes(category.id)
          const score = isCompleted ? calculateSkillScore(category.id) : 0
          const skillLevel = getSkillLevel(score)

          return (
            <Card key={category.id} className="relative">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-full ${category.color} flex items-center justify-center`}>
                      <category.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{category.title}</CardTitle>
                      <CardDescription>{category.description}</CardDescription>
                    </div>
                  </div>
                  {isCompleted && <CheckCircle className="w-6 h-6 text-green-500" />}
                </div>
              </CardHeader>
              <CardContent>
                {isCompleted ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Your Score</span>
                      <Badge className={skillLevel.color}>{skillLevel.level}</Badge>
                    </div>
                    <Progress value={score} className="h-3" />
                    <p className="text-sm text-muted-foreground">{score}% proficiency in this area</p>
                    <Button
                      variant="outline"
                      className="w-full bg-transparent"
                      onClick={() => handleStartAssessment(category.id)}
                    >
                      Retake Assessment
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Complete this assessment to understand your {category.title.toLowerCase()} abilities
                    </p>
                    <Button className="w-full" onClick={() => handleStartAssessment(category.id)}>
                      Start Assessment
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {completedCategories.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Assessment Progress
            </CardTitle>
            <CardDescription>
              {completedCategories.length} of {assessmentCategories.length} assessments completed
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Progress value={(completedCategories.length / assessmentCategories.length) * 100} className="h-3" />
              {completedCategories.length === assessmentCategories.length ? (
                <div className="text-center">
                  <p className="text-green-600 font-medium mb-4">All assessments completed!</p>
                  <Button onClick={() => setShowResults(true)} size="lg">
                    View Detailed Skills Analysis
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center">
                  Complete {assessmentCategories.length - completedCategories.length} more assessment
                  {assessmentCategories.length - completedCategories.length !== 1 ? "s" : ""} to unlock detailed
                  analysis
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
