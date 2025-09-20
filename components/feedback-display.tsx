"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Star, MessageSquare } from "lucide-react"
import { format } from "date-fns"

interface Feedback {
  id: string
  rating: number
  comment: string
  feedback_type: string
  created_at: string
  from_user: {
    full_name: string
    avatar_url?: string
  }
}

interface FeedbackDisplayProps {
  userId: string
  type?: "mentor" | "course" | "general"
  limit?: number
  showTitle?: boolean
}

export function FeedbackDisplay({ userId, type, limit = 10, showTitle = true }: FeedbackDisplayProps) {
  const [feedback, setFeedback] = useState<Feedback[]>([])
  const [loading, setLoading] = useState(true)
  const [averageRating, setAverageRating] = useState(0)

  useEffect(() => {
    fetchFeedback()
  }, [userId, type])

  const fetchFeedback = async () => {
    const supabase = createClient()

    let query = supabase
      .from("feedback")
      .select(`
        *,
        from_user:profiles!feedback_from_user_id_fkey(
          full_name,
          avatar_url
        )
      `)
      .eq("to_user_id", userId)
      .order("created_at", { ascending: false })

    if (type) {
      query = query.eq("feedback_type", type)
    }

    if (limit) {
      query = query.limit(limit)
    }

    const { data, error } = await query

    if (error) {
      console.error("Error fetching feedback:", error)
    } else {
      setFeedback(data || [])

      // Calculate average rating
      if (data && data.length > 0) {
        const avg = data.reduce((sum, item) => sum + item.rating, 0) / data.length
        setAverageRating(avg)
      }
    }
    setLoading(false)
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-muted rounded w-1/3"></div>
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-16 bg-muted rounded"></div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (feedback.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <MessageSquare className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No feedback yet</h3>
          <p className="text-muted-foreground">Feedback will appear here once received</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      {showTitle && (
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Feedback & Reviews</CardTitle>
              <CardDescription>
                {feedback.length} review{feedback.length !== 1 ? "s" : ""}
                {averageRating > 0 && <span className="ml-2">• Average: {averageRating.toFixed(1)} stars</span>}
              </CardDescription>
            </div>
            {averageRating > 0 && (
              <div className="flex items-center gap-1">
                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                <span className="text-lg font-semibold">{averageRating.toFixed(1)}</span>
              </div>
            )}
          </div>
        </CardHeader>
      )}
      <CardContent className="space-y-6">
        {feedback.map((item) => (
          <div key={item.id} className="border-l-2 border-primary/20 pl-4 space-y-3">
            <div className="flex items-start gap-3">
              <Avatar className="w-10 h-10">
                <AvatarImage src={item.from_user.avatar_url || "/placeholder.svg"} />
                <AvatarFallback>
                  {item.from_user.full_name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="font-medium">{item.from_user.full_name}</span>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < item.rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"
                          }`}
                        />
                      ))}
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {item.feedback_type}
                    </Badge>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {format(new Date(item.created_at), "MMM dd, yyyy")}
                  </span>
                </div>

                {item.comment && <p className="text-sm text-muted-foreground leading-relaxed">{item.comment}</p>}
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
