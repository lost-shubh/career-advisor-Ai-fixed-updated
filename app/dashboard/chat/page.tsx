"use client"

import type React from "react"

import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Bot, User, Send, Sparkles, TrendingUp, BookOpen } from "lucide-react"
import { useState, useRef, useEffect } from "react"

export default function ChatPage() {
  const [input, setInput] = useState("")
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  const { messages, sendMessage, isLoading } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
  })

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    sendMessage({ text: input })
    setInput("")
  }

  const quickPrompts = [
    "What career paths match my interests?",
    "How can I improve my technical skills?",
    "Show me relevant courses for data science",
    "What skills are in demand right now?",
  ]

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">AI Career Assistant</h1>
        <p className="text-muted-foreground">Get personalized career guidance and recommendations</p>
      </div>

      <Card className="flex-1 flex flex-col">
        <CardHeader className="bg-primary/5 border-b">
          <CardTitle className="flex items-center gap-2">
            <Bot className="w-5 h-5 text-primary" />
            CareerPath AI
            <Badge variant="secondary" className="ml-auto">
              <Sparkles className="w-3 h-3 mr-1" />
              AI-Powered
            </Badge>
          </CardTitle>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col p-0">
          <ScrollArea className="flex-1 p-6" ref={scrollAreaRef}>
            <div className="space-y-6">
              {messages.length === 0 && (
                <div className="text-center py-12">
                  <Bot className="w-16 h-16 mx-auto mb-4 text-primary" />
                  <h3 className="text-lg font-semibold mb-2">Welcome to your AI Career Assistant!</h3>
                  <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                    I'm here to help you explore career paths, develop skills, and find the right opportunities. Ask me
                    anything about your career journey!
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl mx-auto">
                    {quickPrompts.map((prompt, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        className="text-left justify-start h-auto p-4 bg-transparent"
                        onClick={() => {
                          setInput(prompt)
                          sendMessage({ text: prompt })
                        }}
                      >
                        {prompt}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-4 ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {message.role === "assistant" && (
                    <Avatar className="w-8 h-8 bg-primary">
                      <AvatarFallback>
                        <Bot className="w-4 h-4 text-primary-foreground" />
                      </AvatarFallback>
                    </Avatar>
                  )}

                  <div
                    className={`max-w-[80%] rounded-lg px-4 py-3 ${
                      message.role === "user" ? "bg-primary text-primary-foreground ml-auto" : "bg-muted"
                    }`}
                  >
                    {message.parts.map((part, index) => {
                      switch (part.type) {
                        case "text":
                          return (
                            <div key={index} className="whitespace-pre-wrap">
                              {part.text}
                            </div>
                          )

                        case "tool-getCareerRecommendations":
                          if (part.state === "output-available") {
                            return (
                              <div key={index} className="space-y-3">
                                <p className="font-medium">{part.output.message}</p>
                                <div className="grid gap-3">
                                  {part.output.recommendations.map((career: any, idx: number) => (
                                    <div key={idx} className="bg-background/50 rounded-lg p-3 border">
                                      <div className="flex items-center justify-between mb-2">
                                        <h4 className="font-medium">{career.title}</h4>
                                        <div className="flex items-center gap-2">
                                          <Badge variant="secondary">{career.match}% match</Badge>
                                          <Badge variant="outline" className="text-green-600">
                                            <TrendingUp className="w-3 h-3 mr-1" />
                                            {career.growth}
                                          </Badge>
                                        </div>
                                      </div>
                                      <p className="text-sm text-muted-foreground">{career.description}</p>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )
                          }
                          break

                        case "tool-searchCurriculum":
                          if (part.state === "output-available") {
                            return (
                              <div key={index} className="space-y-3">
                                <p className="font-medium">{part.output.message}</p>
                                <div className="grid gap-3">
                                  {part.output.courses.map((course: any, idx: number) => (
                                    <div key={idx} className="bg-background/50 rounded-lg p-3 border">
                                      <div className="flex items-center justify-between mb-2">
                                        <h4 className="font-medium flex items-center gap-2">
                                          <BookOpen className="w-4 h-4" />
                                          {course.title}
                                        </h4>
                                        <Badge variant="outline">{course.duration}</Badge>
                                      </div>
                                      <div className="flex flex-wrap gap-1">
                                        {course.skills.map((skill: string, skillIdx: number) => (
                                          <Badge key={skillIdx} variant="secondary" className="text-xs">
                                            {skill}
                                          </Badge>
                                        ))}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )
                          }
                          break

                        case "tool-assessSkills":
                          if (part.state === "output-available") {
                            return (
                              <div key={index} className="space-y-3">
                                <div className="bg-background/50 rounded-lg p-3 border">
                                  <h4 className="font-medium mb-2">Skill Assessment Results</h4>
                                  <p className="text-sm mb-3">{part.output.nextSteps}</p>
                                  <div className="space-y-2">
                                    <p className="text-sm font-medium">Recommended Actions:</p>
                                    <ul className="text-sm space-y-1">
                                      {part.output.suggestions.map((suggestion: string, idx: number) => (
                                        <li key={idx} className="flex items-center gap-2">
                                          <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                                          {suggestion}
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                </div>
                              </div>
                            )
                          }
                          break
                      }
                    })}
                  </div>

                  {message.role === "user" && (
                    <Avatar className="w-8 h-8 bg-secondary">
                      <AvatarFallback>
                        <User className="w-4 h-4 text-secondary-foreground" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}

              {isLoading && (
                <div className="flex gap-4 justify-start">
                  <Avatar className="w-8 h-8 bg-primary">
                    <AvatarFallback>
                      <Bot className="w-4 h-4 text-primary-foreground" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="bg-muted rounded-lg px-4 py-3">
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-current rounded-full animate-bounce" />
                      <div
                        className="w-2 h-2 bg-current rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      />
                      <div
                        className="w-2 h-2 bg-current rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          <div className="border-t p-6">
            <form onSubmit={onSubmit} className="flex gap-3">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about careers, skills, courses, or opportunities..."
                disabled={isLoading}
                className="flex-1"
              />
              <Button type="submit" disabled={isLoading || !input.trim()}>
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
