"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { toast } from "@/hooks/use-toast"
import {
  Bot,
  User,
  Send,
  Loader2,
  Sparkles,
  Target,
  Briefcase,
  TrendingUp,
  BookOpen,
  MessageCircle,
  Lightbulb,
  ArrowRight,
  Copy,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react"

interface AIChatbotProps {
  userData: any
}

interface QuickAction {
  id: string
  label: string
  icon: any
  prompt: string
  description: string
}

const quickActions: QuickAction[] = [
  {
    id: "career-analysis",
    label: "Analyze My Career Path",
    icon: Target,
    prompt: "Can you analyze my career path and provide recommendations based on my profile?",
    description: "Get personalized career guidance",
  },
  {
    id: "job-matching",
    label: "Find Job Matches",
    icon: Briefcase,
    prompt: "Help me find job opportunities that match my skills and experience.",
    description: "Discover relevant job opportunities",
  },
  {
    id: "skill-assessment",
    label: "Assess My Skills",
    icon: TrendingUp,
    prompt: "I want to assess my current skills and identify areas for improvement.",
    description: "Evaluate and improve your skills",
  },
  {
    id: "interview-prep",
    label: "Interview Preparation",
    icon: MessageCircle,
    prompt: "Help me prepare for job interviews in my field.",
    description: "Get ready for your next interview",
  },
  {
    id: "resume-tips",
    label: "Resume Optimization",
    icon: BookOpen,
    prompt: "Give me tips on how to improve my resume and make it stand out.",
    description: "Optimize your resume for success",
  },
  {
    id: "industry-insights",
    label: "Industry Trends",
    icon: Lightbulb,
    prompt: "What are the current trends and opportunities in my industry?",
    description: "Stay updated with industry insights",
  },
]

export function AIChatbot({ userData }: AIChatbotProps) {
  const [inputValue, setInputValue] = useState("")
  const [showQuickActions, setShowQuickActions] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({ api: "/api/career-chat" }),
    initialMessages: [
      {
        id: "welcome",
        role: "assistant",
        parts: [
          {
            type: "text",
            text: `Hello ${userData.name || "there"}! 👋 I'm CareerBot, your AI career advisor. I'm here to help you with career guidance, job searching, skill development, and more. 

What would you like to explore today?`,
          },
        ],
      },
    ],
  })

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = (text: string) => {
    if (!text.trim()) return

    sendMessage({ text })
    setInputValue("")
    setShowQuickActions(false)
  }

  const handleQuickAction = (action: QuickAction) => {
    handleSendMessage(action.prompt)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleSendMessage(inputValue)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied to clipboard",
      description: "Message copied successfully",
    })
  }

  const formatMessage = (content: string) => {
    // Simple formatting for better readability
    return content
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      .replace(/`(.*?)`/g, '<code class="bg-gray-100 px-1 rounded">$1</code>')
  }

  return (
    <div className="flex flex-col h-[800px] max-w-4xl mx-auto">
      <Card className="flex-1 flex flex-col">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 border-b">
          <CardTitle className="flex items-center gap-2">
            <Bot className="w-6 h-6 text-blue-600" />
            CareerBot - AI Career Advisor
          </CardTitle>
          <CardDescription>
            Get personalized career guidance, job recommendations, and skill development advice
          </CardDescription>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col p-0">
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {message.role === "assistant" && (
                    <Avatar className="w-8 h-8 bg-blue-100">
                      <AvatarFallback>
                        <Bot className="w-4 h-4 text-blue-600" />
                      </AvatarFallback>
                    </Avatar>
                  )}

                  <div className={`max-w-[80%] ${message.role === "user" ? "order-first" : ""}`}>
                    <div
                      className={`rounded-lg p-3 ${
                        message.role === "user" ? "bg-blue-600 text-white ml-auto" : "bg-gray-100 text-gray-900"
                      }`}
                    >
                      {message.parts.map((part, index) => {
                        if (part.type === "text") {
                          return (
                            <div
                              key={index}
                              className="prose prose-sm max-w-none"
                              dangerouslySetInnerHTML={{ __html: formatMessage(part.text) }}
                            />
                          )
                        }

                        // Handle tool results
                        if (part.type === "tool-careerAnalysis" && part.state === "output-available") {
                          const result = part.output
                          return (
                            <div key={index} className="space-y-3 mt-3">
                              <div className="bg-white p-4 rounded-lg border">
                                <h4 className="font-semibold mb-2 flex items-center gap-2">
                                  <Target className="w-4 h-4" />
                                  Career Analysis Results
                                </h4>
                                <div className="space-y-2">
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm font-medium">Compatibility Score:</span>
                                    <Badge className="bg-green-500">{result.compatibilityScore}%</Badge>
                                  </div>
                                  <div>
                                    <span className="text-sm font-medium">Suggested Roles:</span>
                                    <div className="flex flex-wrap gap-1 mt-1">
                                      {result.suggestedRoles.map((role: string, i: number) => (
                                        <Badge key={i} variant="secondary">
                                          {role}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>
                                  <div>
                                    <span className="text-sm font-medium">Skill Gaps:</span>
                                    <div className="flex flex-wrap gap-1 mt-1">
                                      {result.skillGaps.map((skill: string, i: number) => (
                                        <Badge key={i} variant="outline">
                                          {skill}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )
                        }

                        if (part.type === "tool-jobMatching" && part.state === "output-available") {
                          const result = part.output
                          return (
                            <div key={index} className="space-y-3 mt-3">
                              <div className="bg-white p-4 rounded-lg border">
                                <h4 className="font-semibold mb-3 flex items-center gap-2">
                                  <Briefcase className="w-4 h-4" />
                                  Job Matches ({result.totalFound} found)
                                </h4>
                                <div className="space-y-3">
                                  {result.matches.map((job: any, i: number) => (
                                    <div key={i} className="border rounded-lg p-3">
                                      <div className="flex justify-between items-start mb-2">
                                        <div>
                                          <h5 className="font-medium">{job.title}</h5>
                                          <p className="text-sm text-gray-600">{job.company}</p>
                                        </div>
                                        <Badge className="bg-blue-500">{job.matchScore}% match</Badge>
                                      </div>
                                      <div className="text-sm space-y-1">
                                        <p>
                                          <strong>Location:</strong> {job.location}
                                        </p>
                                        <p>
                                          <strong>Salary:</strong> {job.salary}
                                        </p>
                                        <div>
                                          <strong>Requirements:</strong>
                                          <div className="flex flex-wrap gap-1 mt-1">
                                            {job.requirements.map((req: string, j: number) => (
                                              <Badge key={j} variant="outline" className="text-xs">
                                                {req}
                                              </Badge>
                                            ))}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          )
                        }

                        if (part.type === "tool-skillAssessment" && part.state === "output-available") {
                          const result = part.output
                          return (
                            <div key={index} className="space-y-3 mt-3">
                              <div className="bg-white p-4 rounded-lg border">
                                <h4 className="font-semibold mb-3 flex items-center gap-2">
                                  <TrendingUp className="w-4 h-4" />
                                  Skill Assessment: {result.skill}
                                </h4>
                                <div className="space-y-2">
                                  <div className="flex justify-between">
                                    <span>Current Level:</span>
                                    <Badge variant="outline">{result.currentLevel}</Badge>
                                  </div>
                                  <div className="flex justify-between">
                                    <span>Target Level:</span>
                                    <Badge className="bg-green-500">{result.targetLevel}</Badge>
                                  </div>
                                  <div className="flex justify-between">
                                    <span>Estimated Time:</span>
                                    <span className="text-sm font-medium">{result.estimatedTimeToTarget}</span>
                                  </div>
                                  <div>
                                    <span className="text-sm font-medium">Learning Path:</span>
                                    <ul className="text-sm mt-1 space-y-1">
                                      {result.learningPath.map((step: string, i: number) => (
                                        <li key={i} className="flex items-center gap-2">
                                          <ArrowRight className="w-3 h-3" />
                                          {step}
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )
                        }

                        return null
                      })}
                    </div>

                    {message.role === "assistant" && (
                      <div className="flex items-center gap-2 mt-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            copyToClipboard(message.parts.map((p) => (p.type === "text" ? p.text : "")).join(""))
                          }
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <ThumbsUp className="w-3 h-3" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <ThumbsDown className="w-3 h-3" />
                        </Button>
                      </div>
                    )}
                  </div>

                  {message.role === "user" && (
                    <Avatar className="w-8 h-8 bg-blue-600">
                      <AvatarFallback>
                        <User className="w-4 h-4 text-white" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}

              {status === "in_progress" && (
                <div className="flex gap-3 justify-start">
                  <Avatar className="w-8 h-8 bg-blue-100">
                    <AvatarFallback>
                      <Bot className="w-4 h-4 text-blue-600" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="bg-gray-100 rounded-lg p-3">
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span className="text-sm">CareerBot is thinking...</span>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Quick Actions */}
          {showQuickActions && messages.length <= 1 && (
            <div className="p-4 border-t bg-gray-50">
              <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Quick Actions
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                {quickActions.map((action) => {
                  const IconComponent = action.icon
                  return (
                    <Button
                      key={action.id}
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuickAction(action)}
                      className="justify-start h-auto p-3 text-left"
                    >
                      <div className="flex items-start gap-2">
                        <IconComponent className="w-4 h-4 mt-0.5 text-blue-600" />
                        <div>
                          <div className="font-medium text-sm">{action.label}</div>
                          <div className="text-xs text-muted-foreground">{action.description}</div>
                        </div>
                      </div>
                    </Button>
                  )
                })}
              </div>
            </div>
          )}

          <Separator />

          {/* Input Area */}
          <div className="p-4">
            <form onSubmit={handleSubmit} className="flex gap-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask me anything about your career..."
                disabled={status === "in_progress"}
                className="flex-1"
              />
              <Button type="submit" disabled={status === "in_progress" || !inputValue.trim()} size="icon">
                {status === "in_progress" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              </Button>
            </form>
            <p className="text-xs text-muted-foreground mt-2">
              CareerBot can make mistakes. Please verify important information.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
