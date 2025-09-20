"use client"

import type React from "react"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Star, Send } from "lucide-react"
import { cn } from "@/lib/utils"

interface FeedbackFormProps {
  toUserId: string
  sessionId?: string
  type: "mentor" | "course" | "general"
  onSubmit?: () => void
}

export function FeedbackForm({ toUserId, sessionId, type, onSubmit }: FeedbackFormProps) {
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [comment, setComment] = useState("")
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (rating === 0) return

    setSubmitting(true)

    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      setSubmitting(false)
      return
    }

    const feedbackData = {
      from_user_id: user.id,
      to_user_id: toUserId,
      session_id: sessionId,
      rating,
      comment: comment.trim(),
      feedback_type: type,
    }

    const { error } = await supabase.from("feedback").insert([feedbackData])

    if (error) {
      console.error("Error submitting feedback:", error)
      alert("Failed to submit feedback. Please try again.")
    } else {
      setRating(0)
      setComment("")
      onSubmit?.()
    }

    setSubmitting(false)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Leave Feedback</CardTitle>
        <CardDescription>
          {type === "mentor"
            ? "Share your experience with this mentor"
            : type === "course"
              ? "Rate this course and help others learn"
              : "Share your feedback"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label>Rating</Label>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className="p-1 hover:scale-110 transition-transform"
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  onClick={() => setRating(star)}
                >
                  <Star
                    className={cn("w-8 h-8 transition-colors", {
                      "fill-yellow-400 text-yellow-400": star <= (hoveredRating || rating),
                      "text-muted-foreground": star > (hoveredRating || rating),
                    })}
                  />
                </button>
              ))}
              <span className="ml-2 text-sm text-muted-foreground">
                {rating > 0 && (
                  <>
                    {rating} star{rating !== 1 ? "s" : ""}
                  </>
                )}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="comment">Comment (Optional)</Label>
            <Textarea
              id="comment"
              placeholder="Share your thoughts, what went well, or suggestions for improvement..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
            />
          </div>

          <Button type="submit" disabled={rating === 0 || submitting} className="w-full">
            <Send className="w-4 h-4 mr-2" />
            {submitting ? "Submitting..." : "Submit Feedback"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
