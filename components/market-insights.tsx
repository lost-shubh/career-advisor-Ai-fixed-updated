"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, MapPin, Building, DollarSign, Users, Zap } from "lucide-react"

interface MarketInsightsProps {
  userData: any
}

export function MarketInsights({ userData }: MarketInsightsProps) {
  const [insights, setInsights] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const fetchMarketInsights = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/google-ai/market-insights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          location: userData.location || "India",
          industry: userData.interests?.[0] || "Technology",
          experience: userData.experience || "Entry Level",
        }),
      })
      const data = await response.json()
      setInsights(data)
    } catch (error) {
      console.error("Failed to fetch market insights:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMarketInsights()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!insights) return null

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Job Market Insights</h2>
          <p className="text-muted-foreground">Real-time data powered by Google Cloud AI</p>
        </div>
        <Badge variant="secondary" className="bg-blue-100 text-blue-800">
          Live Data
        </Badge>
      </div>

      {/* Market Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <TrendingUp className="w-8 h-8 mx-auto text-green-500 mb-2" />
            <p className="text-2xl font-bold text-green-600">{insights.jobMarketTrends.growth}</p>
            <p className="text-sm text-muted-foreground">Market Growth</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Users className="w-8 h-8 mx-auto text-blue-500 mb-2" />
            <p className="text-2xl font-bold">{insights.jobMarketTrends.demand}</p>
            <p className="text-sm text-muted-foreground">Job Demand</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <DollarSign className="w-8 h-8 mx-auto text-emerald-500 mb-2" />
            <p className="text-2xl font-bold">{insights.jobMarketTrends.averageSalary}</p>
            <p className="text-sm text-muted-foreground">Average Salary</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Building className="w-8 h-8 mx-auto text-purple-500 mb-2" />
            <p className="text-2xl font-bold">{insights.jobMarketTrends.competition}</p>
            <p className="text-sm text-muted-foreground">Competition</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Skill Demand */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5" />
              In-Demand Skills
            </CardTitle>
            <CardDescription>Skills with highest market demand</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {insights.skillDemand.map((skill: any, index: number) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{skill.skill}</span>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-green-600">
                      {skill.growth}
                    </Badge>
                    <span className="text-sm text-muted-foreground">{skill.demand}%</span>
                  </div>
                </div>
                <Progress value={skill.demand} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Emerging Roles */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Emerging Career Roles
            </CardTitle>
            <CardDescription>High-growth opportunities in your field</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {insights.emergingRoles.map((role: any, index: number) => (
              <div key={index} className="p-4 bg-muted rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold">{role.title}</h4>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    {role.growth}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{role.description}</p>
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-emerald-500" />
                  <span className="text-sm font-medium">{role.salary}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Location Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Location & Remote Work Trends
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-semibold mb-3">Top Tech Cities</h4>
              <div className="space-y-2">
                {insights.locationInsights.topCities.map((city: string, index: number) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full" />
                    <span className="text-sm">{city}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Remote Opportunities</h4>
              <p className="text-2xl font-bold text-blue-600 mb-1">65%</p>
              <p className="text-sm text-muted-foreground">of roles offer remote/hybrid options</p>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Startup Ecosystem</h4>
              <p className="text-sm text-muted-foreground">{insights.locationInsights.startupEcosystem}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Top Companies */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="w-5 h-5" />
            Top Hiring Companies
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {insights.jobMarketTrends.topCompanies.map((company: string, index: number) => (
              <Badge key={index} variant="outline" className="px-3 py-1">
                {company}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
