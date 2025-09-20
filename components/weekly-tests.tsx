"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Calendar, Clock, CheckCircle, XCircle, Target, AlertCircle, BarChart3 } from "lucide-react"

interface Question {
  id: string
  type: "multiple-choice" | "true-false" | "short-answer" | "essay"
  question: string
  options?: string[]
  correctAnswer?: string | number
  points: number
  explanation?: string
}

interface WeeklyTest {
  id: string
  week: number
  title: string
  description: string
  subject: string
  duration: number // in minutes
  totalPoints: number
  passingScore: number
  questions: Question[]
  availableFrom: Date
  availableUntil: Date
  attempts: number
  maxAttempts: number
  status: "upcoming" | "available" | "completed" | "expired" | "locked"
  score?: number
  completedAt?: Date
  prerequisite?: string // ID of previous test that must be completed
}

interface TestAttempt {
  testId: string
  answers: Record<string, string>
  score: number
  completedAt: Date
  timeSpent: number
}

interface WeeklyTestsProps {
  userData: any
  currentWeek?: number
}

export function WeeklyTests({ userData, currentWeek = 1 }: WeeklyTestsProps) {
  const [tests, setTests] = useState<WeeklyTest[]>([])
  const [selectedTest, setSelectedTest] = useState<WeeklyTest | null>(null)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [testStartTime, setTestStartTime] = useState<Date | null>(null)
  const [showResults, setShowResults] = useState(false)
  const [testResults, setTestResults] = useState<TestAttempt | null>(null)
  const [timeRemaining, setTimeRemaining] = useState<number>(0)

  const generateWeeklyTests = (): WeeklyTest[] => {
    const baseDate = new Date()
    const userCareerField = userData.careerField?.toLowerCase() || ""

    if (userCareerField.includes("medical") || userCareerField.includes("healthcare")) {
      return [
        {
          id: "week-1-medical-basics",
          week: 1,
          title: "Medical Science Fundamentals",
          description: "Test your understanding of basic medical and biological concepts",
          subject: "Medical Science",
          duration: 30,
          totalPoints: 100,
          passingScore: 70,
          availableFrom: new Date(baseDate.getTime() - 7 * 24 * 60 * 60 * 1000),
          availableUntil: new Date(baseDate.getTime() + 7 * 24 * 60 * 60 * 1000),
          attempts: 0,
          maxAttempts: 3,
          status: currentWeek >= 1 ? "available" : "upcoming",
          questions: [
            {
              id: "q1",
              type: "multiple-choice",
              question: "What is the basic unit of life?",
              options: ["Cell", "Tissue", "Organ", "Organism"],
              correctAnswer: 0,
              points: 10,
              explanation: "The cell is the basic structural and functional unit of all living organisms.",
            },
            {
              id: "q2",
              type: "multiple-choice",
              question: "Which organ system is responsible for transporting nutrients and oxygen throughout the body?",
              options: ["Respiratory System", "Digestive System", "Circulatory System", "Nervous System"],
              correctAnswer: 2,
              points: 10,
              explanation:
                "The circulatory system, including the heart and blood vessels, transports nutrients and oxygen.",
            },
            {
              id: "q3",
              type: "true-false",
              question: "Bacteria are always harmful to humans.",
              options: ["True", "False"],
              correctAnswer: 1,
              points: 10,
              explanation:
                "Many bacteria are beneficial and essential for human health, such as those in our digestive system.",
            },
            {
              id: "q4",
              type: "short-answer",
              question: "What is the difference between a virus and bacteria?",
              points: 15,
              explanation:
                "Viruses are smaller, require a host cell to reproduce, and are not considered living organisms. Bacteria are single-celled living organisms that can reproduce independently.",
            },
          ],
        },
        {
          id: "week-2-anatomy",
          week: 2,
          title: "Human Anatomy Basics",
          description: "Understanding basic human anatomy and physiology",
          subject: "Anatomy",
          duration: 45,
          totalPoints: 120,
          passingScore: 75,
          availableFrom: new Date(baseDate.getTime()),
          availableUntil: new Date(baseDate.getTime() + 14 * 24 * 60 * 60 * 1000),
          attempts: 0,
          maxAttempts: 3,
          status: currentWeek >= 2 ? "available" : currentWeek === 1 ? "locked" : "upcoming",
          prerequisite: "week-1-medical-basics",
          questions: [
            {
              id: "q1",
              type: "multiple-choice",
              question: "How many chambers does the human heart have?",
              options: ["2", "3", "4", "5"],
              correctAnswer: 2,
              points: 15,
              explanation:
                "The human heart has four chambers: two atria (upper chambers) and two ventricles (lower chambers).",
            },
            {
              id: "q2",
              type: "multiple-choice",
              question: "Which is the largest organ in the human body?",
              options: ["Liver", "Brain", "Lungs", "Skin"],
              correctAnswer: 3,
              points: 15,
              explanation:
                "The skin is the largest organ, covering the entire body and serving as a protective barrier.",
            },
          ],
        },
      ]
    } else {
      // Default programming/general tests
      return [
        {
          id: "week-1-fundamentals",
          week: 1,
          title: "Programming Fundamentals",
          description: "Test your understanding of basic programming concepts",
          subject: "Computer Science",
          duration: 30,
          totalPoints: 100,
          passingScore: 70,
          availableFrom: new Date(baseDate.getTime() - 7 * 24 * 60 * 60 * 1000),
          availableUntil: new Date(baseDate.getTime() + 7 * 24 * 60 * 60 * 1000),
          attempts: 0,
          maxAttempts: 3,
          status: currentWeek >= 1 ? "available" : "upcoming",
          questions: [
            {
              id: "q1",
              type: "multiple-choice",
              question: "What is a variable in programming?",
              options: [
                "A container that stores data values",
                "A type of loop",
                "A function that returns nothing",
                "A programming language",
              ],
              correctAnswer: 0,
              points: 10,
              explanation:
                "A variable is a container that stores data values that can be changed during program execution.",
            },
            {
              id: "q2",
              type: "multiple-choice",
              question: "Which of the following is NOT a programming language?",
              options: ["Python", "JavaScript", "HTML", "Java"],
              correctAnswer: 2,
              points: 10,
              explanation: "HTML is a markup language used for creating web pages, not a programming language.",
            },
            {
              id: "q3",
              type: "true-false",
              question: "Functions help in code reusability.",
              options: ["True", "False"],
              correctAnswer: 0,
              points: 10,
              explanation: "Functions allow you to write code once and use it multiple times, promoting reusability.",
            },
            {
              id: "q4",
              type: "short-answer",
              question: "What is the purpose of comments in code?",
              points: 15,
              explanation:
                "Comments are used to explain code, make it more readable, and help other developers understand the logic.",
            },
          ],
        },
      ]
    }
  }

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (testStartTime && timeRemaining > 0 && !showResults) {
      interval = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            handleSubmitTest()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [testStartTime, timeRemaining, showResults])

  useEffect(() => {
    setTests(generateWeeklyTests())
  }, [currentWeek])

  const startTest = (test: WeeklyTest) => {
    setSelectedTest(test)
    setCurrentQuestion(0)
    setAnswers({})
    setTestStartTime(new Date())
    setTimeRemaining(test.duration * 60) // Convert minutes to seconds
    setShowResults(false)
    setTestResults(null)
  }

  const handleAnswerChange = (questionId: string, answer: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }))
  }

  const nextQuestion = () => {
    if (selectedTest && currentQuestion < selectedTest.questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1)
    }
  }

  const previousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1)
    }
  }

  const calculateScore = (test: WeeklyTest, userAnswers: Record<string, string>): number => {
    let totalScore = 0
    test.questions.forEach((question) => {
      const userAnswer = userAnswers[question.id]
      if (question.type === "multiple-choice" || question.type === "true-false") {
        if (Number.parseInt(userAnswer) === question.correctAnswer) {
          totalScore += question.points
        }
      } else if (question.type === "short-answer" || question.type === "essay") {
        // For demo purposes, give partial credit for any answer
        if (userAnswer && userAnswer.trim().length > 10) {
          totalScore += Math.floor(question.points * 0.8) // 80% credit
        }
      }
    })
    return Math.round((totalScore / test.totalPoints) * 100)
  }

  const handleSubmitTest = () => {
    if (!selectedTest || !testStartTime) return

    const score = calculateScore(selectedTest, answers)
    const timeSpent = Math.floor((new Date().getTime() - testStartTime.getTime()) / 1000 / 60) // in minutes

    const attempt: TestAttempt = {
      testId: selectedTest.id,
      answers,
      score,
      completedAt: new Date(),
      timeSpent,
    }

    setTestResults(attempt)
    setShowResults(true)

    // Update test status
    setTests((prev) =>
      prev.map((test) =>
        test.id === selectedTest.id
          ? {
              ...test,
              attempts: test.attempts + 1,
              status: "completed",
              score,
              completedAt: new Date(),
            }
          : test,
      ),
    )
  }

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  const getStatusColor = (status: WeeklyTest["status"]) => {
    switch (status) {
      case "available":
        return "bg-green-500"
      case "completed":
        return "bg-blue-500"
      case "locked":
        return "bg-gray-500"
      case "expired":
        return "bg-red-500"
      case "upcoming":
        return "bg-yellow-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusIcon = (status: WeeklyTest["status"]) => {
    switch (status) {
      case "available":
        return <Target className="w-4 h-4" />
      case "completed":
        return <CheckCircle className="w-4 h-4" />
      case "locked":
        return <AlertCircle className="w-4 h-4" />
      case "expired":
        return <XCircle className="w-4 h-4" />
      case "upcoming":
        return <Calendar className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  // Test Results View
  if (showResults && testResults && selectedTest) {
    const passed = testResults.score >= selectedTest.passingScore

    return (
      <div className="space-y-6">
        <Card
          className={`border-2 ${passed ? "border-green-500 bg-green-50 dark:bg-green-950" : "border-red-500 bg-red-50 dark:bg-red-950"}`}
        >
          <CardHeader className="text-center">
            <div className="mx-auto mb-4">
              {passed ? (
                <CheckCircle className="w-16 h-16 text-green-500" />
              ) : (
                <XCircle className="w-16 h-16 text-red-500" />
              )}
            </div>
            <CardTitle className="text-2xl text-foreground">{passed ? "Congratulations!" : "Keep Learning!"}</CardTitle>
            <CardDescription>
              {passed
                ? "You've successfully passed this week's test"
                : "You can retake this test to improve your score"}
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="text-4xl font-bold text-foreground">{testResults.score}%</div>
            <div className="text-muted-foreground">Passing Score: {selectedTest.passingScore}%</div>
            <div className="flex justify-center gap-4 text-sm text-muted-foreground">
              <span>Time Spent: {testResults.timeSpent} minutes</span>
              <span>
                Attempts: {selectedTest.attempts}/{selectedTest.maxAttempts}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Question Review</CardTitle>
            <CardDescription>Review your answers and explanations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {selectedTest.questions.map((question, index) => {
              const userAnswer = testResults.answers[question.id]
              const isCorrect =
                question.type === "multiple-choice" || question.type === "true-false"
                  ? Number.parseInt(userAnswer) === question.correctAnswer
                  : userAnswer && userAnswer.trim().length > 10

              return (
                <div key={question.id} className="p-4 border rounded-lg">
                  <div className="flex items-start gap-3 mb-3">
                    {isCorrect ? (
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-500 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <h4 className="font-medium mb-2">
                        Question {index + 1}: {question.question}
                      </h4>

                      {question.options && (
                        <div className="space-y-1 mb-3">
                          {question.options.map((option, optionIndex) => (
                            <div
                              key={optionIndex}
                              className={`p-2 rounded text-sm ${
                                optionIndex === question.correctAnswer
                                  ? "bg-green-100 text-green-800"
                                  : Number.parseInt(userAnswer) === optionIndex
                                    ? "bg-red-100 text-red-800"
                                    : "bg-gray-50"
                              }`}
                            >
                              {option}
                              {optionIndex === question.correctAnswer && " ✓"}
                              {Number.parseInt(userAnswer) === optionIndex &&
                                optionIndex !== question.correctAnswer &&
                                " ✗"}
                            </div>
                          ))}
                        </div>
                      )}

                      {question.type === "short-answer" && (
                        <div className="mb-3">
                          <p className="text-sm font-medium">Your Answer:</p>
                          <p className="text-sm bg-gray-50 p-2 rounded">{userAnswer || "No answer provided"}</p>
                        </div>
                      )}

                      {question.explanation && (
                        <div className="bg-blue-50 p-3 rounded">
                          <p className="text-sm font-medium text-blue-800 mb-1">Explanation:</p>
                          <p className="text-sm text-blue-700">{question.explanation}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button onClick={() => setSelectedTest(null)} variant="outline">
            Back to Tests
          </Button>
          {!passed && selectedTest.attempts < selectedTest.maxAttempts && (
            <Button onClick={() => startTest(selectedTest)}>
              Retake Test ({selectedTest.maxAttempts - selectedTest.attempts} attempts left)
            </Button>
          )}
        </div>
      </div>
    )
  }

  // Test Taking View
  if (selectedTest && !showResults) {
    const question = selectedTest.questions[currentQuestion]
    const progress = ((currentQuestion + 1) / selectedTest.questions.length) * 100

    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-foreground">{selectedTest.title}</CardTitle>
                <CardDescription>
                  Question {currentQuestion + 1} of {selectedTest.questions.length}
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
            <CardTitle className="text-lg text-foreground">{question.question}</CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="outline">{question.points} points</Badge>
              <Badge variant="secondary">{question.type}</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {question.type === "multiple-choice" && question.options && (
              <RadioGroup
                value={answers[question.id] || ""}
                onValueChange={(value) => handleAnswerChange(question.id, value)}
              >
                {question.options.map((option, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                    <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer text-foreground">
                      {option}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            )}

            {question.type === "true-false" && question.options && (
              <RadioGroup
                value={answers[question.id] || ""}
                onValueChange={(value) => handleAnswerChange(question.id, value)}
              >
                {question.options.map((option, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <RadioGroupItem value={index.toString()} id={`tf-${index}`} />
                    <Label htmlFor={`tf-${index}`} className="cursor-pointer text-foreground">
                      {option}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            )}

            {question.type === "short-answer" && (
              <Textarea
                placeholder="Enter your answer here..."
                value={answers[question.id] || ""}
                onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                rows={4}
                className="text-foreground"
              />
            )}

            {question.type === "essay" && (
              <Textarea
                placeholder="Write your essay here..."
                value={answers[question.id] || ""}
                onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                rows={8}
                className="text-foreground"
              />
            )}
          </CardContent>
        </Card>

        <div className="flex justify-between">
          <Button variant="outline" onClick={previousQuestion} disabled={currentQuestion === 0}>
            Previous
          </Button>

          <div className="flex gap-2">
            {currentQuestion === selectedTest.questions.length - 1 ? (
              <Button onClick={handleSubmitTest}>Submit Test</Button>
            ) : (
              <Button onClick={nextQuestion}>Next</Button>
            )}
          </div>
        </div>
      </div>
    )
  }

  // Tests Overview
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Calendar className="w-6 h-6" />
            Weekly Progress Tests
          </CardTitle>
          <CardDescription>Take weekly tests to track your learning progress and unlock new content</CardDescription>
        </CardHeader>
      </Card>

      {/* Progress Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <BarChart3 className="w-5 h-5" />
            Your Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {tests.filter((t) => t.status === "completed").length}
              </div>
              <div className="text-sm text-muted-foreground">Tests Completed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {Math.round(
                  (tests.filter((t) => t.score && t.score >= t.passingScore).length /
                    Math.max(tests.filter((t) => t.status === "completed").length, 1)) *
                    100,
                )}
                %
              </div>
              <div className="text-sm text-muted-foreground">Pass Rate</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {Math.round(
                  tests.reduce((acc, t) => acc + (t.score || 0), 0) /
                    Math.max(tests.filter((t) => t.status === "completed").length, 1),
                )}
                %
              </div>
              <div className="text-sm text-muted-foreground">Average Score</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tests List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {tests.map((test) => (
          <Card key={test.id} className="relative">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2 text-foreground">
                    Week {test.week}: {test.title}
                    {getStatusIcon(test.status)}
                  </CardTitle>
                  <CardDescription>{test.description}</CardDescription>
                </div>
                <Badge className={getStatusColor(test.status)}>{test.status}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-foreground">Duration:</span>{" "}
                  <span className="text-muted-foreground">{test.duration} min</span>
                </div>
                <div>
                  <span className="font-medium text-foreground">Questions:</span>{" "}
                  <span className="text-muted-foreground">{test.questions.length}</span>
                </div>
                <div>
                  <span className="font-medium text-foreground">Passing Score:</span>{" "}
                  <span className="text-muted-foreground">{test.passingScore}%</span>
                </div>
                <div>
                  <span className="font-medium text-foreground">Attempts:</span>{" "}
                  <span className="text-muted-foreground">
                    {test.attempts}/{test.maxAttempts}
                  </span>
                </div>
              </div>

              {test.score !== undefined && (
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-foreground">Your Score</span>
                    <span className="text-sm font-bold text-foreground">{test.score}%</span>
                  </div>
                  <Progress value={test.score} className="h-2" />
                </div>
              )}

              {test.prerequisite && test.status === "locked" && (
                <div className="bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded p-3">
                  <div className="flex items-center gap-2 text-yellow-800 dark:text-yellow-200">
                    <AlertCircle className="w-4 h-4" />
                    <span className="text-sm">Complete previous week's test to unlock</span>
                  </div>
                </div>
              )}

              <div className="flex gap-2">
                {test.status === "available" && (
                  <Button
                    onClick={() => startTest(test)}
                    disabled={test.attempts >= test.maxAttempts}
                    className="flex-1"
                  >
                    {test.attempts === 0 ? "Start Test" : "Retake Test"}
                  </Button>
                )}

                {test.status === "completed" && (
                  <Button variant="outline" className="flex-1 bg-transparent" disabled>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Completed
                  </Button>
                )}

                {test.status === "locked" && (
                  <Button variant="outline" className="flex-1 bg-transparent" disabled>
                    <AlertCircle className="w-4 h-4 mr-2" />
                    Locked
                  </Button>
                )}

                {test.status === "upcoming" && (
                  <Button variant="outline" className="flex-1 bg-transparent" disabled>
                    <Calendar className="w-4 h-4 mr-2" />
                    Coming Soon
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
