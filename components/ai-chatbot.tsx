"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { MessageCircle, Send, Bot, User, Minimize2, X, BookOpen, TrendingUp } from "lucide-react"
import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"

interface AIChatbotProps {
  userData?: any
  isMinimized?: boolean
  onToggleMinimize?: () => void
  onClose?: () => void
}

export function AIChatbot({ userData, isMinimized = false, onToggleMinimize, onClose }: AIChatbotProps) {
  const [input, setInput] = useState("")
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  const { messages, sendMessage, isLoading } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
  })

  useEffect(() => {
    // Scroll to bottom when messages change
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    sendMessage({ text: input })
    setInput("")
  }

  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={onToggleMinimize}
          className="rounded-full w-14 h-14 shadow-lg hover:shadow-xl transition-all duration-200"
          size="lg"
        >
          <MessageCircle className="w-6 h-6" />
        </Button>
      </div>
    )
  }

  return (
    <Card className="fixed bottom-4 right-4 w-96 h-[500px] z-50 shadow-2xl border-2 flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-primary text-primary-foreground rounded-t-lg">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Bot className="w-5 h-5" />
          CareerPath AI Assistant
        </CardTitle>
        <div className="flex gap-1">
          {onToggleMinimize && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleMinimize}
              className="h-8 w-8 p-0 hover:bg-primary-foreground/20"
            >
              <Minimize2 className="w-4 h-4" />
            </Button>
          )}
          {onClose && (
            <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0 hover:bg-primary-foreground/20">
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0">
        <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
          <div className="space-y-4">
            {messages.length === 0 && (
              <div className="text-center text-muted-foreground py-8">
                <Bot className="w-12 h-12 mx-auto mb-4 text-primary" />
                <p className="text-sm">
                  Hi {userData?.name || "there"}! I'm your AI career advisor. Ask me anything about career paths,
                  skills, job opportunities, or request video lectures for your {userData?.stream || "academic"} stream!
                </p>
                <div className="flex flex-wrap gap-2 mt-4 justify-center">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => sendMessage({ text: "Show me video lectures for my stream" })}
                  >
                    📹 Video Lectures
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => sendMessage({ text: "What career options do I have?" })}
                  >
                    🎯 Career Options
                  </Button>
                </div>
              </div>
            )}

            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {message.role === "assistant" && (
                  <Avatar className="w-8 h-8 bg-primary">
                    <AvatarFallback>
                      <Bot className="w-4 h-4 text-primary-foreground" />
                    </AvatarFallback>
                  </Avatar>
                )}

                <div
                  className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                    message.role === "user"
                      ? "bg-primary text-primary-foreground ml-auto"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {message.parts.map((part, index) => {
                    switch (part.type) {
                      case "text":
                        return (
                          <p key={index} className="whitespace-pre-wrap">
                            {part.text}
                          </p>
                        )

                      case "tool-getCareerRecommendations":
                        if (part.state === "output-available") {
                          return (
                            <div key={index} className="space-y-2 mt-2">
                              <p className="font-medium text-xs">{part.output.message}</p>
                              <div className="space-y-1">
                                {part.output.recommendations.slice(0, 2).map((career: any, idx: number) => (
                                  <div key={idx} className="bg-background/50 rounded p-2 border text-xs">
                                    <div className="flex items-center justify-between mb-1">
                                      <span className="font-medium">{career.title}</span>
                                      <Badge variant="secondary" className="text-xs">
                                        {career.match}%
                                      </Badge>
                                    </div>
                                    <p className="text-xs opacity-75">{career.description}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )
                        }
                        break

                      case "tool-getVideoLectures":
                        if (part.state === "output-available") {
                          return (
                            <div key={index} className="space-y-2 mt-2">
                              <p className="font-medium text-xs">{part.output.message}</p>
                              <div className="space-y-1">
                                {part.output.lectures.slice(0, 2).map((lecture: any, idx: number) => (
                                  <div key={idx} className="bg-background/50 rounded p-2 border text-xs">
                                    <div className="flex items-center gap-1 mb-1">
                                      <BookOpen className="w-3 h-3" />
                                      <span className="font-medium">{lecture.title}</span>
                                    </div>
                                    <p className="text-xs opacity-75">{lecture.description}</p>
                                    <Badge variant="outline" className="text-xs mt-1">
                                      {lecture.duration}
                                    </Badge>
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
                            <div key={index} className="space-y-2 mt-2">
                              <div className="bg-background/50 rounded p-2 border text-xs">
                                <div className="flex items-center gap-1 mb-1">
                                  <TrendingUp className="w-3 h-3" />
                                  <span className="font-medium">Skill Assessment</span>
                                </div>
                                <p className="text-xs mb-2">{part.output.nextSteps}</p>
                                <div className="space-y-1">
                                  {part.output.suggestions.slice(0, 2).map((suggestion: string, idx: number) => (
                                    <div key={idx} className="flex items-center gap-1 text-xs">
                                      <div className="w-1 h-1 bg-primary rounded-full" />
                                      {suggestion}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          )
                        }
                        break

                      default:
                        return null
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
              <div className="flex gap-3 justify-start">
                <Avatar className="w-8 h-8 bg-primary">
                  <AvatarFallback>
                    <Bot className="w-4 h-4 text-primary-foreground" />
                  </AvatarFallback>
                </Avatar>
                <div className="bg-muted text-muted-foreground rounded-lg px-3 py-2 text-sm">
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

        <div className="border-t p-4">
          <form onSubmit={onSubmit} className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about careers, skills, or opportunities..."
              disabled={isLoading}
              className="flex-1"
            />
            <Button type="submit" disabled={isLoading || !input.trim()} size="sm">
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>
      </CardContent>
    </Card>
  )
}
