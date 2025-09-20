"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Target,
  TrendingUp,
  DollarSign,
  ArrowRight,
  Lightbulb,
  Briefcase,
  GraduationCap,
  BarChart3,
  Sparkles,
  Filter,
} from "lucide-react"
import { generateCareerRecommendations, STREAM_CAREERS, type CareerRecommendation } from "@/lib/google-ai"

interface CareerRecommendationsProps {
  userData: any
}

interface RecommendationData {
  recommendations: CareerRecommendation[]
  overallAnalysis: string
  marketInsights: string
}

export function CareerRecommendations({ userData }: CareerRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<RecommendationData | null>(null)
  const [loading, setLoading] = useState(false)
  const [selectedCareer, setSelectedCareer] = useState<CareerRecommendation | null>(null)
  const [activeTab, setActiveTab] = useState("overview")
  const [selectedStream, setSelectedStream] = useState<keyof typeof STREAM_CAREERS>("PCB")
  const [userInterests, setUserInterests] = useState<string[]>([])
  const [userSkills, setUserSkills] = useState<string[]>([])

  const generateRecommendations = async () => {
    setLoading(true)
    try {
      const streamRecommendations = await generateCareerRecommendations(selectedStream, userInterests, userSkills)

      setRecommendations({
        recommendations: streamRecommendations,
        overallAnalysis: `Based on your ${selectedStream} stream and interests in ${userInterests.join(", ")}, you show strong potential in ${selectedStream === "PCB" ? "medical and healthcare" : selectedStream === "PCM" ? "engineering and technology" : selectedStream === "Commerce" ? "business and finance" : "humanities and social sciences"} fields. Your profile suggests you would excel in roles that combine theoretical knowledge with practical applications.`,
        marketInsights: getMarketInsights(selectedStream),
      })
    } catch (error) {
      console.error("Error generating recommendations:", error)
      // Fallback to mock data for demo
      setRecommendations(getMockRecommendations())
    } finally {
      setLoading(false)
    }
  }

  const getMarketInsights = (stream: keyof typeof STREAM_CAREERS): string => {
    const insights = {
      PCB: "The Indian healthcare sector is experiencing rapid growth with government initiatives like Ayushman Bharat. There are abundant opportunities for skilled healthcare professionals across hospitals, clinics, pharmaceutical companies, and health-tech startups.",
      PCM: "India's technology and engineering sectors are booming with initiatives like Digital India and Make in India. There's high demand for skilled engineers in software development, manufacturing, renewable energy, and emerging technologies like AI and IoT.",
      Commerce:
        "India's business and finance sectors are expanding rapidly with the growth of startups, fintech, and digital commerce. There are excellent opportunities in banking, consulting, digital marketing, and entrepreneurship.",
      Arts: "The humanities and social sciences sectors are evolving with new opportunities in digital media, content creation, policy research, and social impact organizations. Government jobs through UPSC and state services remain highly sought after.",
    }
    return insights[stream]
  }

  const getMockRecommendations = (): RecommendationData => {
    const streamCareers = STREAM_CAREERS[selectedStream]
    const mockRecommendations: CareerRecommendation[] = streamCareers.slice(0, 6).map((career, index) => ({
      title: career,
      description: `A rewarding career in ${career.toLowerCase()} with excellent growth prospects and impact potential.`,
      requiredSkills: getSkillsForCareer(career),
      averageSalary: getSalaryRange(selectedStream),
      growthProspects: "High growth potential with increasing demand",
      educationPath: getEducationPath(selectedStream, career),
      relevantCourses: getRelevantCourses(selectedStream, career),
    }))

    return {
      recommendations: mockRecommendations,
      overallAnalysis: `Based on your ${selectedStream} stream, you show strong potential in ${selectedStream === "PCB" ? "medical and healthcare" : selectedStream === "PCM" ? "engineering and technology" : selectedStream === "Commerce" ? "business and finance" : "humanities and social sciences"} fields.`,
      marketInsights: getMarketInsights(selectedStream),
    }
  }

  const getSkillsForCareer = (career: string): string[] => {
    const skillsMap: { [key: string]: string[] } = {
      Doctor: ["Medical Knowledge", "Patient Care", "Diagnosis", "Communication", "Empathy"],
      Engineer: ["Problem Solving", "Technical Skills", "Mathematics", "Design", "Innovation"],
      "Chartered Accountant": ["Financial Analysis", "Accounting", "Tax Planning", "Audit", "Compliance"],
      Journalist: ["Writing", "Research", "Communication", "Critical Thinking", "Ethics"],
    }
    return skillsMap[career] || ["Communication", "Problem Solving", "Critical Thinking", "Teamwork", "Leadership"]
  }

  const getSalaryRange = (stream: keyof typeof STREAM_CAREERS): string => {
    const salaryRanges = {
      PCB: "₹4-12 LPA",
      PCM: "₹5-15 LPA",
      Commerce: "₹3-10 LPA",
      Arts: "₹3-8 LPA",
    }
    return salaryRanges[stream]
  }

  const getEducationPath = (stream: keyof typeof STREAM_CAREERS, career: string): string[] => {
    const pathMap: { [key: string]: string[] } = {
      Doctor: ["Complete 12th with PCB", "Clear NEET exam", "MBBS (5.5 years)", "Internship", "Specialization (MD/MS)"],
      Engineer: [
        "Complete 12th with PCM",
        "Clear JEE exam",
        "B.Tech/B.E (4 years)",
        "Internships",
        "Higher studies/Job",
      ],
      "Chartered Accountant": ["Complete 12th", "CA Foundation", "CA Intermediate", "Articleship", "CA Final"],
      Journalist: [
        "Complete 12th",
        "Bachelor's in Journalism/Mass Comm",
        "Internships",
        "Portfolio building",
        "Specialization",
      ],
    }
    return (
      pathMap[career] || ["Complete 12th grade", "Pursue relevant undergraduate degree", "Gain practical experience"]
    )
  }

  const getRelevantCourses = (stream: keyof typeof STREAM_CAREERS, career: string): string[] => {
    const coursesMap: { [key: string]: string[] } = {
      Doctor: ["Anatomy", "Physiology", "Pathology", "Pharmacology", "Clinical Medicine"],
      Engineer: ["Mathematics", "Physics", "Programming", "Design", "Project Management"],
      "Chartered Accountant": ["Accounting", "Taxation", "Audit", "Financial Management", "Business Law"],
      Journalist: ["Media Studies", "Communication", "Ethics", "Digital Media", "Research Methods"],
    }
    return coursesMap[career] || ["Foundation courses", "Specialized training", "Professional certifications"]
  }

  useEffect(() => {
    setUserInterests(userData?.interests || ["Technology", "Problem Solving"])
    setUserSkills(userData?.skills || ["Communication", "Analytical Thinking"])
    setSelectedStream(userData?.stream || "PCB")
  }, [userData])

  useEffect(() => {
    generateRecommendations()
  }, [selectedStream])

  if (loading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-96" />
          </CardHeader>
        </Card>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (!recommendations) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <Target className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Unable to Load Recommendations</h3>
          <p className="text-muted-foreground mb-4">Please try again later</p>
          <Button onClick={generateRecommendations}>Retry</Button>
        </CardContent>
      </Card>
    )
  }

  if (selectedCareer) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <Briefcase className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-2xl">{selectedCareer.title}</CardTitle>
                  <CardDescription className="flex items-center gap-2">
                    <Badge variant="secondary">{selectedStream} Stream</Badge>
                    <span>{selectedCareer.growthProspects}</span>
                  </CardDescription>
                </div>
              </div>
              <Button variant="outline" onClick={() => setSelectedCareer(null)}>
                Back to All Careers
              </Button>
            </div>
          </CardHeader>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="skills">Skills</TabsTrigger>
            <TabsTrigger value="path">Career Path</TabsTrigger>
            <TabsTrigger value="market">Market Info</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Career Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">{selectedCareer.description}</p>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5" />
                    Salary Range
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-primary">{selectedCareer.averageSalary}</p>
                  <p className="text-sm text-muted-foreground mt-1">Average in India</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Growth Prospects
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-green-600">{selectedCareer.growthProspects}</p>
                  <p className="text-sm text-muted-foreground mt-1">Market outlook</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="skills" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Required Skills
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {selectedCareer.requiredSkills.map((skill, index) => (
                    <Badge key={index} variant="outline" className="justify-center py-2">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="w-5 h-5" />
                  Relevant Courses
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {selectedCareer.relevantCourses.map((course, index) => (
                    <div key={index} className="p-3 bg-muted rounded-lg">
                      <span className="text-sm font-medium">{course}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="path" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="w-5 h-5" />
                  Education Path
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {selectedCareer.educationPath.map((step, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-medium text-primary">{index + 1}</span>
                      </div>
                      <span className="text-sm">{step}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="market" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Market Insights for {selectedStream} Stream
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">{getMarketInsights(selectedStream)}</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-6 h-6" />
            AI-Powered Career Recommendations
          </CardTitle>
          <CardDescription>
            Stream-specific career paths based on your academic background and the current Indian job market
          </CardDescription>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Select Your Academic Stream
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Select
            value={selectedStream}
            onValueChange={(value) => setSelectedStream(value as keyof typeof STREAM_CAREERS)}
          >
            <SelectTrigger className="w-full md:w-64">
              <SelectValue placeholder="Select your stream" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="PCB">PCB (Physics, Chemistry, Biology)</SelectItem>
              <SelectItem value="PCM">PCM (Physics, Chemistry, Mathematics)</SelectItem>
              <SelectItem value="Commerce">Commerce</SelectItem>
              <SelectItem value="Arts">Arts & Humanities</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-sm text-muted-foreground mt-2">
            Showing careers relevant to {selectedStream} stream students
          </p>
        </CardContent>
      </Card>

      {/* Overall Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Your {selectedStream} Stream Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground leading-relaxed">{recommendations.overallAnalysis}</p>
        </CardContent>
      </Card>

      {/* Market Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            {selectedStream} Stream Market Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground leading-relaxed">{recommendations.marketInsights}</p>
        </CardContent>
      </Card>

      {/* Career Recommendations */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recommendations.recommendations.map((career, index) => (
          <Card key={index} className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{career.title}</CardTitle>
                <Badge variant="secondary">{selectedStream}</Badge>
              </div>
              <CardDescription className="line-clamp-2">{career.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <DollarSign className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{career.averageSalary}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                  <span className="text-green-600">{career.growthProspects}</span>
                </div>
              </div>

              <Button className="w-full bg-transparent" variant="outline" onClick={() => setSelectedCareer(career)}>
                Explore Career
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardContent className="text-center py-8">
          <Button onClick={generateRecommendations} disabled={loading}>
            Generate New Recommendations
            <Sparkles className="w-4 h-4 ml-2" />
          </Button>
          <p className="text-sm text-muted-foreground mt-2">Get fresh recommendations for {selectedStream} stream</p>
        </CardContent>
      </Card>
    </div>
  )
}
