"use client"

import React, { useState, useRef, useEffect } from "react"
import { useChat } from "@ai-sdk/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Bot, User, Send, Loader2, MessageCircle } from "lucide-react"

interface SimpleChatbotProps {
  userData?: any
}

export function SimpleChatbot({ userData }: SimpleChatbotProps) {
  const [inputValue, setInputValue] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const { messages, append, isLoading } = useChat({
    api: "/api/simple-chat",
    initialMessages: [
      {
        id: "welcome",
        role: "assistant",
        content: `Hello ${userData?.name || "there"}! 👋 I'm CareerBot, your AI career advisor. I'm here to help you with career guidance, job searching, skill development, and more. 

What would you like to explore today?`,
      },
    ],
  })

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return

    setInputValue("")
    await append({ role: "user", content: text })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleSendMessage(inputValue)
  }

  const formatMessage = (content: string) => {
    // Simple formatting for better readability
    return content
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      .replace(/`(.*?)`/g, '<code class="bg-gray-100 px-1 rounded">$1</code>')
      .replace(/\n/g, "<br />")
  }

  return (
    <div className="flex flex-col h-[600px] max-w-2xl mx-auto">
      <Card className="flex-1 flex flex-col">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 border-b">
          <CardTitle className="flex items-center gap-2">
            <Bot className="w-6 h-6 text-blue-600" />
            CareerBot - AI Career Advisor
          </CardTitle>
          <CardDescription>
            Get personalized career guidance and advice
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
                        message.role === "user" 
                          ? "bg-blue-600 text-white ml-auto" 
                          : "bg-gray-100 text-gray-900"
                      }`}
                    >
                      <div
                        className="prose prose-sm max-w-none"
                        dangerouslySetInnerHTML={{ __html: formatMessage(message.content) }}
                      />
                    </div>
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

              {isLoading && (
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

          {/* Input Area */}
          <div className="p-4 border-t">
            <form onSubmit={handleSubmit} className="flex gap-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask me anything about your career..."
                disabled={isLoading}
                className="flex-1"
              />
              <Button 
                type="submit" 
                disabled={isLoading || !inputValue.trim()} 
                size="icon"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
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