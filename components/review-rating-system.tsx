"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Star,
  ThumbsUp,
  ThumbsDown,
  Flag,
  MoreHorizontal,
  TrendingUp,
  Award,
  MessageCircle,
  AlertCircle,
  CheckCircle,
} from "lucide-react"

interface Review {
  id: string
  userId: string
  userName: string
  userAvatar?: string
  targetId: string
  targetType: "mentor" | "course" | "study-group" | "event"
  rating: number
  title: string
  content: string
  pros: string[]
  cons: string[]
  createdAt: Date
  updatedAt?: Date
  helpfulVotes: number
  unhelpfulVotes: number
  verified: boolean
  tags: string[]
  userVote?: "helpful" | "unhelpful"
}

interface RatingBreakdown {
  5: number
  4: number
  3: number
  2: number
  1: number
}

interface ReviewStats {
  totalReviews: number
  averageRating: number
  ratingBreakdown: RatingBreakdown
  verifiedReviews: number
  recentReviews: number
}

interface ReviewRatingSystemProps {
  targetId: string
  targetType: "mentor" | "course" | "study-group" | "event"
  targetName: string
  currentUserCanReview?: boolean
  showWriteReview?: boolean
}

export function ReviewRatingSystem({
  targetId,
  targetType,
  targetName,
  currentUserCanReview = true,
  showWriteReview = true,
}: ReviewRatingSystemProps) {
  const [reviews, setReviews] = useState<Review[]>(getMockReviews(targetId, targetType))
  const [stats, setStats] = useState<ReviewStats>(calculateStats(reviews))
  const [showWriteDialog, setShowWriteDialog] = useState(false)
  const [newReview, setNewReview] = useState({
    rating: 0,
    title: "",
    content: "",
    pros: [""],
    cons: [""],
  })
  const [filterRating, setFilterRating] = useState<number | null>(null)
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "helpful" | "rating">("newest")
  const [validationErrors, setValidationErrors] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)

  function getMockReviews(targetId: string, targetType: string): Review[] {
    return [
      {
        id: "1",
        userId: "user1",
        userName: "Rahul Sharma",
        userAvatar: "/indian-student-male.png",
        targetId,
        targetType: targetType as any,
        rating: 5,
        title: "Excellent mentorship experience!",
        content:
          "Had an amazing session with this mentor. They provided clear guidance on my career path and helped me understand the industry better. The advice was practical and actionable.",
        pros: ["Very knowledgeable", "Great communication", "Practical advice", "Responsive"],
        cons: ["Sessions could be longer"],
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        helpfulVotes: 12,
        unhelpfulVotes: 1,
        verified: true,
        tags: ["Career Guidance", "Technical Skills", "Industry Insights"],
      },
      {
        id: "2",
        userId: "user2",
        userName: "Priya Patel",
        userAvatar: "/indian-student-female.png",
        targetId,
        targetType: targetType as any,
        rating: 4,
        title: "Very helpful for career transition",
        content:
          "This mentor helped me transition from engineering to product management. The guidance was valuable, though I wish we had more time to cover advanced topics.",
        pros: ["Industry experience", "Career transition expertise", "Good examples"],
        cons: ["Limited time", "Could cover more advanced topics"],
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        helpfulVotes: 8,
        unhelpfulVotes: 0,
        verified: true,
        tags: ["Career Transition", "Product Management"],
      },
      {
        id: "3",
        userId: "user3",
        userName: "Arjun Kumar",
        targetId,
        targetType: targetType as any,
        rating: 5,
        title: "Outstanding technical guidance",
        content:
          "Perfect for someone looking to improve their technical skills. The mentor provided excellent code reviews and system design insights.",
        pros: ["Technical expertise", "Code review", "System design", "Patient teaching"],
        cons: [],
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        helpfulVotes: 15,
        unhelpfulVotes: 2,
        verified: false,
        tags: ["Technical Skills", "Code Review", "System Design"],
      },
      {
        id: "4",
        userId: "user4",
        userName: "Sneha Reddy",
        userAvatar: "/indian-professional-woman.png",
        targetId,
        targetType: targetType as any,
        rating: 3,
        title: "Good but could be better",
        content:
          "The session was informative but felt a bit rushed. The mentor has good knowledge but could improve on time management and session structure.",
        pros: ["Knowledgeable", "Good examples"],
        cons: ["Rushed sessions", "Poor time management", "Needs better structure"],
        createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
        helpfulVotes: 5,
        unhelpfulVotes: 3,
        verified: true,
        tags: ["Time Management", "Session Structure"],
      },
    ]
  }

  function calculateStats(reviews: Review[]): ReviewStats {
    const totalReviews = reviews.length
    const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews

    const ratingBreakdown: RatingBreakdown = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
    reviews.forEach((review) => {
      ratingBreakdown[review.rating as keyof RatingBreakdown]++
    })

    const verifiedReviews = reviews.filter((r) => r.verified).length
    const recentReviews = reviews.filter(
      (r) => new Date().getTime() - r.createdAt.getTime() < 30 * 24 * 60 * 60 * 1000,
    ).length

    return {
      totalReviews,
      averageRating: Math.round(averageRating * 10) / 10,
      ratingBreakdown,
      verifiedReviews,
      recentReviews,
    }
  }

  const handleVote = (reviewId: string, voteType: "helpful" | "unhelpful") => {
    setReviews((prev) =>
      prev.map((review) => {
        if (review.id === reviewId) {
          const currentVote = review.userVote
          let helpfulVotes = review.helpfulVotes
          let unhelpfulVotes = review.unhelpfulVotes

          // Remove previous vote if exists
          if (currentVote === "helpful") helpfulVotes--
          if (currentVote === "unhelpful") unhelpfulVotes--

          // Add new vote if different from current
          if (currentVote !== voteType) {
            if (voteType === "helpful") helpfulVotes++
            if (voteType === "unhelpful") unhelpfulVotes++
            return { ...review, helpfulVotes, unhelpfulVotes, userVote: voteType }
          } else {
            return { ...review, helpfulVotes, unhelpfulVotes, userVote: undefined }
          }
        }
        return review
      }),
    )
  }

  const handleSubmitReview = async () => {
    console.log("[v0] Starting review submission", {
      rating: newReview.rating,
      title: newReview.title,
      content: newReview.content,
    })

    const errors: string[] = []

    if (newReview.rating === 0) {
      errors.push("Please select a rating")
    }
    if (!newReview.title.trim()) {
      errors.push("Please enter a review title")
    }
    if (!newReview.content.trim()) {
      errors.push("Please write a detailed review")
    }

    if (errors.length > 0) {
      console.log("[v0] Validation failed", errors)
      setValidationErrors(errors)
      return
    }

    setValidationErrors([])
    setIsSubmitting(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const review: Review = {
        id: Date.now().toString(),
        userId: "current-user",
        userName: "You",
        targetId,
        targetType: targetType as any,
        rating: newReview.rating,
        title: newReview.title.trim(),
        content: newReview.content.trim(),
        pros: newReview.pros.filter((p) => p.trim()),
        cons: newReview.cons.filter((c) => c.trim()),
        createdAt: new Date(),
        helpfulVotes: 0,
        unhelpfulVotes: 0,
        verified: true,
        tags: [],
      }

      console.log("[v0] Review created successfully", review)

      setReviews((prev) => [review, ...prev])
      setStats(calculateStats([review, ...reviews]))

      setShowSuccessMessage(true)
      setTimeout(() => setShowSuccessMessage(false), 3000)

      setShowWriteDialog(false)
      setNewReview({ rating: 0, title: "", content: "", pros: [""], cons: [""] })
    } catch (error) {
      console.log("[v0] Review submission failed", error)
      setValidationErrors(["Failed to submit review. Please try again."])
    } finally {
      setIsSubmitting(false)
    }
  }

  const filteredAndSortedReviews = reviews
    .filter((review) => filterRating === null || review.rating === filterRating)
    .sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return b.createdAt.getTime() - a.createdAt.getTime()
        case "oldest":
          return a.createdAt.getTime() - b.createdAt.getTime()
        case "helpful":
          return b.helpfulVotes - a.helpfulVotes
        case "rating":
          return b.rating - a.rating
        default:
          return 0
      }
    })

  const StarRating = ({
    rating,
    size = "w-4 h-4",
    interactive = false,
    onRatingChange,
  }: {
    rating: number
    size?: string
    interactive?: boolean
    onRatingChange?: (rating: number) => void
  }) => (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`${size} ${
            star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
          } ${interactive ? "cursor-pointer hover:text-yellow-400" : ""}`}
          onClick={() => interactive && onRatingChange?.(star)}
        />
      ))}
    </div>
  )

  return (
    <div className="space-y-6">
      {showSuccessMessage && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">Your review has been submitted successfully!</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-400" />
            Reviews & Ratings
          </CardTitle>
          <CardDescription>What others are saying about {targetName}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">{stats.averageRating}</div>
                <StarRating rating={Math.round(stats.averageRating)} size="w-6 h-6" />
                <div className="text-sm text-muted-foreground mt-2">Based on {stats.totalReviews} reviews</div>
              </div>

              <div className="flex items-center gap-4 text-sm">
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Award className="w-3 h-3" />
                  {stats.verifiedReviews} verified
                </Badge>
                <Badge variant="outline" className="flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  {stats.recentReviews} recent
                </Badge>
              </div>
            </div>

            <div className="space-y-3">
              {[5, 4, 3, 2, 1].map((rating) => (
                <div key={rating} className="flex items-center gap-3">
                  <span className="text-sm w-8">{rating} ★</span>
                  <Progress
                    value={(stats.ratingBreakdown[rating as keyof RatingBreakdown] / stats.totalReviews) * 100}
                    className="flex-1 h-2"
                  />
                  <span className="text-sm text-muted-foreground w-8">
                    {stats.ratingBreakdown[rating as keyof RatingBreakdown]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {showWriteReview && currentUserCanReview && (
        <Dialog open={showWriteDialog} onOpenChange={setShowWriteDialog}>
          <DialogTrigger asChild>
            <Button className="w-full">
              <MessageCircle className="w-4 h-4 mr-2" />
              Write a Review
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Write a Review for {targetName}</DialogTitle>
              <DialogDescription>Share your experience to help others make informed decisions</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              {validationErrors.length > 0 && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    <ul className="list-disc list-inside space-y-1">
                      {validationErrors.map((error, index) => (
                        <li key={index}>{error}</li>
                      ))}
                    </ul>
                  </AlertDescription>
                </Alert>
              )}

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Overall Rating <span className="text-red-500">*</span>
                </label>
                <StarRating
                  rating={newReview.rating}
                  size="w-8 h-8"
                  interactive
                  onRatingChange={(rating) => {
                    setNewReview((prev) => ({ ...prev, rating }))
                    if (validationErrors.length > 0) {
                      setValidationErrors((prev) => prev.filter((error) => !error.includes("rating")))
                    }
                  }}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Review Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Summarize your experience..."
                  value={newReview.title}
                  onChange={(e) => {
                    setNewReview((prev) => ({ ...prev, title: e.target.value }))
                    if (validationErrors.length > 0) {
                      setValidationErrors((prev) => prev.filter((error) => !error.includes("title")))
                    }
                  }}
                  className="w-full p-2 border rounded-md"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Detailed Review <span className="text-red-500">*</span>
                </label>
                <Textarea
                  placeholder="Share your detailed experience..."
                  value={newReview.content}
                  onChange={(e) => {
                    setNewReview((prev) => ({ ...prev, content: e.target.value }))
                    if (validationErrors.length > 0) {
                      setValidationErrors((prev) => prev.filter((error) => !error.includes("detailed review")))
                    }
                  }}
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">What did you like?</label>
                  {newReview.pros.map((pro, index) => (
                    <input
                      key={index}
                      type="text"
                      placeholder="Add a positive point..."
                      value={pro}
                      onChange={(e) => {
                        const newPros = [...newReview.pros]
                        newPros[index] = e.target.value
                        setNewReview((prev) => ({ ...prev, pros: newPros }))
                      }}
                      className="w-full p-2 border rounded-md mb-2"
                    />
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setNewReview((prev) => ({ ...prev, pros: [...prev.pros, ""] }))}
                  >
                    Add Pro
                  </Button>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">What could be improved?</label>
                  {newReview.cons.map((con, index) => (
                    <input
                      key={index}
                      type="text"
                      placeholder="Add an improvement suggestion..."
                      value={con}
                      onChange={(e) => {
                        const newCons = [...newReview.cons]
                        newCons[index] = e.target.value
                        setNewReview((prev) => ({ ...prev, cons: newCons }))
                      }}
                      className="w-full p-2 border rounded-md mb-2"
                    />
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setNewReview((prev) => ({ ...prev, cons: [...prev.cons, ""] }))}
                  >
                    Add Con
                  </Button>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowWriteDialog(false)
                    setValidationErrors([])
                  }}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button onClick={handleSubmitReview} disabled={isSubmitting}>
                  {isSubmitting ? "Submitting..." : "Submit Review"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Filter by rating:</span>
              <div className="flex gap-1">
                <Button
                  variant={filterRating === null ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterRating(null)}
                >
                  All
                </Button>
                {[5, 4, 3, 2, 1].map((rating) => (
                  <Button
                    key={rating}
                    variant={filterRating === rating ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilterRating(rating)}
                  >
                    {rating}★
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="p-1 border rounded text-sm"
              >
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
                <option value="helpful">Most Helpful</option>
                <option value="rating">Highest Rating</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {filteredAndSortedReviews.map((review) => (
          <Card key={review.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={review.userAvatar || "/placeholder.svg"} alt={review.userName} />
                    <AvatarFallback>
                      {review.userName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{review.userName}</span>
                      {review.verified && (
                        <Badge variant="secondary" className="text-xs">
                          <Award className="w-3 h-3 mr-1" />
                          Verified
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <StarRating rating={review.rating} />
                      <span className="text-sm text-muted-foreground">{review.createdAt.toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold">{review.title}</h4>
                <p className="text-muted-foreground leading-relaxed">{review.content}</p>

                {(review.pros.length > 0 || review.cons.length > 0) && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    {review.pros.length > 0 && (
                      <div>
                        <h5 className="font-medium text-green-700 mb-2">👍 Pros</h5>
                        <ul className="space-y-1">
                          {review.pros.map((pro, index) => (
                            <li key={index} className="text-sm text-green-600">
                              • {pro}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {review.cons.length > 0 && (
                      <div>
                        <h5 className="font-medium text-red-700 mb-2">👎 Cons</h5>
                        <ul className="space-y-1">
                          {review.cons.map((con, index) => (
                            <li key={index} className="text-sm text-red-600">
                              • {con}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                {review.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-3">
                    {review.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between mt-4 pt-4 border-t">
                <div className="flex items-center gap-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleVote(review.id, "helpful")}
                    className={review.userVote === "helpful" ? "text-green-600" : ""}
                  >
                    <ThumbsUp className="w-4 h-4 mr-1" />
                    Helpful ({review.helpfulVotes})
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleVote(review.id, "unhelpful")}
                    className={review.userVote === "unhelpful" ? "text-red-600" : ""}
                  >
                    <ThumbsDown className="w-4 h-4 mr-1" />
                    Not Helpful ({review.unhelpfulVotes})
                  </Button>
                </div>
                <Button variant="ghost" size="sm">
                  <Flag className="w-4 h-4 mr-1" />
                  Report
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredAndSortedReviews.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <MessageCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Reviews Found</h3>
            <p className="text-muted-foreground mb-4">
              {filterRating ? `No reviews with ${filterRating} stars yet.` : "Be the first to write a review!"}
            </p>
            {filterRating && (
              <Button variant="outline" onClick={() => setFilterRating(null)}>
                Show All Reviews
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
