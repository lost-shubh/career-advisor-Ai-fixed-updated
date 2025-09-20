"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts"
import { TrendingUp, Target, Lightbulb, ArrowRight, Download, Share } from "lucide-react"

interface SkillsVisualizationProps {
  userData: any
  skillsData: Record<string, Record<number, string>>
}

const skillCategories = {
  technical: "Technical Skills",
  analytical: "Analytical Thinking",
  communication: "Communication",
  leadership: "Leadership",
}

export function SkillsVisualization({ userData, skillsData }: SkillsVisualizationProps) {
  const calculateSkillScore = (categoryId: string) => {
    const categoryAnswers = skillsData[categoryId] || {}
    const scores = Object.values(categoryAnswers).map(Number)
    if (scores.length === 0) return 0
    return Math.round((scores.reduce((sum, score) => sum + score, 0) / scores.length) * 20)
  }

  const getSkillLevel = (score: number) => {
    if (score >= 80) return { level: "Expert", color: "bg-green-500", description: "You excel in this area" }
    if (score >= 60) return { level: "Advanced", color: "bg-blue-500", description: "Strong competency" }
    if (score >= 40) return { level: "Intermediate", color: "bg-yellow-500", description: "Good foundation" }
    if (score >= 20) return { level: "Beginner", color: "bg-orange-500", description: "Room for growth" }
    return { level: "Novice", color: "bg-red-500", description: "Needs development" }
  }

  const skillsChartData = Object.keys(skillCategories).map((categoryId) => ({
    category: skillCategories[categoryId as keyof typeof skillCategories],
    score: calculateSkillScore(categoryId),
    fullMark: 100,
  }))

  const barChartData = Object.keys(skillCategories).map((categoryId) => ({
    name: skillCategories[categoryId as keyof typeof skillCategories].replace(" ", "\n"),
    score: calculateSkillScore(categoryId),
  }))

  const overallScore = Math.round(
    Object.keys(skillCategories).reduce((sum, categoryId) => sum + calculateSkillScore(categoryId), 0) /
      Object.keys(skillCategories).length,
  )

  const getRecommendations = (categoryId: string, score: number) => {
    const recommendations: Record<string, string[]> = {
      technical: [
        "Start with online coding tutorials (Python, JavaScript)",
        "Practice on platforms like HackerRank or LeetCode",
        "Build small projects to apply your learning",
        "Join coding communities and forums",
      ],
      analytical: [
        "Practice logical reasoning puzzles daily",
        "Learn data analysis tools like Excel or Google Sheets",
        "Take online courses in critical thinking",
        "Practice case study analysis",
      ],
      communication: [
        "Join public speaking groups like Toastmasters",
        "Practice writing daily (blog, journal)",
        "Participate in group discussions and debates",
        "Take presentation skills workshops",
      ],
      leadership: [
        "Volunteer for team projects and initiatives",
        "Practice delegation and team coordination",
        "Study leadership styles and management principles",
        "Seek mentorship opportunities",
      ],
    }

    return score < 60 ? recommendations[categoryId] || [] : []
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">Your Skills Profile</CardTitle>
              <CardDescription>Comprehensive analysis based on your assessment responses</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </Button>
              <Button variant="outline" size="sm">
                <Share className="w-4 h-4 mr-2" />
                Share Results
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Overall Score */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Overall Skills Score
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-3xl font-bold text-primary">{overallScore}%</div>
              <p className="text-muted-foreground">{getSkillLevel(overallScore).level} Level</p>
            </div>
            <div className="text-right">
              <Badge className={getSkillLevel(overallScore).color}>{getSkillLevel(overallScore).level}</Badge>
              <p className="text-sm text-muted-foreground mt-1">{getSkillLevel(overallScore).description}</p>
            </div>
          </div>
          <Progress value={overallScore} className="h-3" />
        </CardContent>
      </Card>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Skills Breakdown</CardTitle>
            <CardDescription>Your performance across different skill categories</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" fontSize={12} />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Bar dataKey="score" fill="#059669" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Skills Radar</CardTitle>
            <CardDescription>Visual representation of your skill profile</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={skillsChartData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="category" fontSize={12} />
                <PolarRadiusAxis domain={[0, 100]} tick={false} />
                <Radar
                  name="Skills"
                  dataKey="score"
                  stroke="#059669"
                  fill="#059669"
                  fillOpacity={0.3}
                  strokeWidth={2}
                />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.keys(skillCategories).map((categoryId) => {
          const score = calculateSkillScore(categoryId)
          const skillLevel = getSkillLevel(score)
          const recommendations = getRecommendations(categoryId, score)

          return (
            <Card key={categoryId}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">
                    {skillCategories[categoryId as keyof typeof skillCategories]}
                  </CardTitle>
                  <Badge className={skillLevel.color}>{skillLevel.level}</Badge>
                </div>
                <CardDescription>{skillLevel.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Score</span>
                    <span className="text-sm font-bold">{score}%</span>
                  </div>
                  <Progress value={score} className="h-2" />
                </div>

                {recommendations.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <Lightbulb className="w-4 h-4" />
                      Improvement Suggestions
                    </h4>
                    <ul className="space-y-1">
                      {recommendations.slice(0, 3).map((rec, index) => (
                        <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                          <span className="w-1 h-1 bg-primary rounded-full mt-2 flex-shrink-0" />
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Career Alignment */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Career Alignment Insights
          </CardTitle>
          <CardDescription>
            Based on your skills profile, here are some career paths that align well with your strengths
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                title: "Software Developer",
                match: Math.max(60, calculateSkillScore("technical")),
                description: "Strong technical skills make this a great fit",
              },
              {
                title: "Business Analyst",
                match: Math.max(55, (calculateSkillScore("analytical") + calculateSkillScore("communication")) / 2),
                description: "Your analytical and communication skills align well",
              },
              {
                title: "Project Manager",
                match: Math.max(50, (calculateSkillScore("leadership") + calculateSkillScore("communication")) / 2),
                description: "Leadership and communication strengths are valuable",
              },
            ].map((career, index) => (
              <div key={index} className="p-4 bg-muted rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium">{career.title}</h4>
                  <Badge variant="secondary">{career.match}% match</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-3">{career.description}</p>
                <Progress value={career.match} className="h-2" />
              </div>
            ))}
          </div>
          <div className="mt-6 text-center">
            <Button>
              Explore Career Recommendations
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
