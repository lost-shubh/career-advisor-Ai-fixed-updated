"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Star, TrendingUp, MessageSquare, Award } from "lucide-react"
import { FeedbackDisplay } from "@/components/feedback-display"

interface FeedbackStats {
  total_feedback: number
  average_rating: number
  rating_distribution: { [key: number]: number }
  recent_feedback: any[]
}

export default function FeedbackPage() {
  const [stats, setStats] = useState<FeedbackStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    fetchFeedbackStats()
    getCurrentUser()
  }, [])

  const getCurrentUser = async () => {
    const supabase = createClient()
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser()

    if (authUser) {
      const { data: profile } = await supabase.from("profiles").select("*").eq("id", authUser.id).single()

      setUser(profile)
    }
  }

  const fetchFeedbackStats = async () => {
    const supabase = createClient()
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser()

    if (!authUser) return

    // Get all feedback received by the user
    const { data: feedback, error } = await supabase
      .from("feedback")
      .select(`
        *,
        from_user:profiles!feedback_from_user_id_fkey(
          full_name,
          avatar_url
        )
      `)
      .eq("to_user_id", authUser.id)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching feedback stats:", error)
    } else {
      const totalFeedback = feedback?.length || 0
      const averageRating =
        totalFeedback > 0 ? feedback!.reduce((sum, item) => sum + item.rating, 0) / totalFeedback : 0

      // Calculate rating distribution
      const ratingDistribution: { [key: number]: number } = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
      feedback?.forEach((item) => {
        ratingDistribution[item.rating] = (ratingDistribution[item.rating] || 0) + 1
      })

      setStats({
        total_feedback: totalFeedback,
        average_rating: averageRating,
        rating_distribution: ratingDistribution,
        recent_feedback: feedback?.slice(0, 5) || [],
      })
    }
    setLoading(false)
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-muted rounded w-1/2"></div>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse h-32 bg-muted rounded-lg"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Feedback & Reviews</h1>
        <p className="text-muted-foreground">Track your feedback and ratings from mentoring sessions</p>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Reviews</p>
                <p className="text-2xl font-bold">{stats?.total_feedback || 0}</p>
              </div>
              <MessageSquare className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Average Rating</p>
                <p className="text-2xl font-bold">{stats?.average_rating ? stats.average_rating.toFixed(1) : "0.0"}</p>
              </div>
              <Star className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">5-Star Reviews</p>
                <p className="text-2xl font-bold">{stats?.rating_distribution[5] || 0}</p>
              </div>
              <Award className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">This Month</p>
                <p className="text-2xl font-bold">
                  {stats?.recent_feedback.filter((f) => new Date(f.created_at).getMonth() === new Date().getMonth())
                    .length || 0}
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Rating Distribution */}
      {stats && stats.total_feedback > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Rating Distribution</CardTitle>
            <CardDescription>Breakdown of your ratings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[5, 4, 3, 2, 1].map((rating) => {
                const count = stats.rating_distribution[rating] || 0
                const percentage = stats.total_feedback > 0 ? (count / stats.total_feedback) * 100 : 0

                return (
                  <div key={rating} className="flex items-center gap-4">
                    <div className="flex items-center gap-1 w-16">
                      <span className="text-sm font-medium">{rating}</span>
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    </div>
                    <div className="flex-1 bg-muted rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <div className="flex items-center gap-2 w-20">
                      <span className="text-sm text-muted-foreground">{count}</span>
                      <Badge variant="outline" className="text-xs">
                        {percentage.toFixed(0)}%
                      </Badge>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Feedback Tabs */}
      <Tabs defaultValue="received" className="space-y-6">
        <TabsList>
          <TabsTrigger value="received">Received ({stats?.total_feedback || 0})</TabsTrigger>
          <TabsTrigger value="given">Given</TabsTrigger>
        </TabsList>

        <TabsContent value="received">
          {user && <FeedbackDisplay userId={user.id} showTitle={false} limit={20} />}
        </TabsContent>

        <TabsContent value="given">
          <Card>
            <CardContent className="text-center py-12">
              <MessageSquare className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Feedback Given</h3>
              <p className="text-muted-foreground">Your feedback to mentors and courses will appear here</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
