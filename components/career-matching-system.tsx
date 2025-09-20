"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/hooks/use-toast"
import {
  Search,
  MapPin,
  DollarSign,
  Clock,
  Star,
  Heart,
  ExternalLink,
  Filter,
  Briefcase,
  TrendingUp,
  Building,
  Target,
  BookOpen,
  ChevronRight,
  RefreshCw,
} from "lucide-react"

interface CareerMatchingSystemProps {
  userData: any
}

interface JobMatch {
  id: string
  title: string
  company: string
  location: string
  type: "Full-time" | "Part-time" | "Contract" | "Remote"
  salary: {
    min: number
    max: number
    currency: string
  }
  matchScore: number
  description: string
  requirements: string[]
  benefits: string[]
  skills: string[]
  experienceLevel: "Entry" | "Mid" | "Senior"
  industry: string
  postedDate: Date
  applicationDeadline?: Date
  isRemote: boolean
  companySize: string
  companyRating: number
}

interface CareerPath {
  id: string
  title: string
  description: string
  averageSalary: string
  growthRate: string
  requiredSkills: string[]
  educationLevel: string
  experienceRequired: string
  industries: string[]
  relatedRoles: string[]
  matchScore: number
}

const mockJobMatches: JobMatch[] = [
  {
    id: "1",
    title: "Senior Software Engineer",
    company: "TechFlow Inc.",
    location: "San Francisco, CA",
    type: "Full-time",
    salary: { min: 120000, max: 160000, currency: "USD" },
    matchScore: 95,
    description: "Join our innovative team building next-generation software solutions...",
    requirements: ["5+ years experience", "React/Node.js", "System design"],
    benefits: ["Health insurance", "401k", "Flexible hours", "Remote work"],
    skills: ["React", "Node.js", "TypeScript", "AWS"],
    experienceLevel: "Senior",
    industry: "Technology",
    postedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    isRemote: true,
    companySize: "100-500",
    companyRating: 4.5,
  },
  {
    id: "2",
    title: "Product Manager",
    company: "InnovateCorp",
    location: "New York, NY",
    type: "Full-time",
    salary: { min: 100000, max: 140000, currency: "USD" },
    matchScore: 87,
    description: "Lead product strategy and development for our flagship products...",
    requirements: ["3+ years PM experience", "Agile methodology", "Data analysis"],
    benefits: ["Health insurance", "Stock options", "Learning budget"],
    skills: ["Product Strategy", "Agile", "Analytics", "Leadership"],
    experienceLevel: "Mid",
    industry: "Technology",
    postedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    isRemote: false,
    companySize: "500+",
    companyRating: 4.2,
  },
  {
    id: "3",
    title: "Data Scientist",
    company: "DataVision Labs",
    location: "Remote",
    type: "Full-time",
    salary: { min: 90000, max: 130000, currency: "USD" },
    matchScore: 82,
    description: "Apply machine learning to solve complex business problems...",
    requirements: ["Python/R", "Machine Learning", "Statistics", "SQL"],
    benefits: ["Remote work", "Health insurance", "Professional development"],
    skills: ["Python", "Machine Learning", "SQL", "Statistics"],
    experienceLevel: "Mid",
    industry: "Data & Analytics",
    postedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    isRemote: true,
    companySize: "50-100",
    companyRating: 4.7,
  },
]

const mockCareerPaths: CareerPath[] = [
  {
    id: "1",
    title: "Software Engineering",
    description: "Design, develop, and maintain software applications and systems",
    averageSalary: "$95,000 - $180,000",
    growthRate: "22% (Much faster than average)",
    requiredSkills: ["Programming", "Problem Solving", "System Design", "Testing"],
    educationLevel: "Bachelor's degree in Computer Science or related field",
    experienceRequired: "0-2 years for entry level",
    industries: ["Technology", "Finance", "Healthcare", "E-commerce"],
    relatedRoles: ["DevOps Engineer", "Technical Lead", "Software Architect"],
    matchScore: 94,
  },
  {
    id: "2",
    title: "Data Science",
    description: "Extract insights from data to drive business decisions",
    averageSalary: "$85,000 - $165,000",
    growthRate: "31% (Much faster than average)",
    requiredSkills: ["Statistics", "Programming", "Machine Learning", "Data Visualization"],
    educationLevel: "Bachelor's or Master's in Data Science, Statistics, or related field",
    experienceRequired: "1-3 years for entry level",
    industries: ["Technology", "Finance", "Healthcare", "Retail"],
    relatedRoles: ["Data Analyst", "ML Engineer", "Research Scientist"],
    matchScore: 89,
  },
  {
    id: "3",
    title: "Product Management",
    description: "Guide product development from conception to launch",
    averageSalary: "$90,000 - $170,000",
    growthRate: "19% (Much faster than average)",
    requiredSkills: ["Strategy", "Analytics", "Communication", "Leadership"],
    educationLevel: "Bachelor's degree, MBA preferred",
    experienceRequired: "2-4 years in related field",
    industries: ["Technology", "Consumer Goods", "Finance", "Healthcare"],
    relatedRoles: ["Product Owner", "Program Manager", "Business Analyst"],
    matchScore: 85,
  },
]

export function CareerMatchingSystem({ userData }: CareerMatchingSystemProps) {
  const [activeTab, setActiveTab] = useState("jobs")
  const [jobMatches, setJobMatches] = useState<JobMatch[]>(mockJobMatches)
  const [careerPaths, setCareerPaths] = useState<CareerPath[]>(mockCareerPaths)
  const [filters, setFilters] = useState({
    location: "",
    jobType: "all",
    experienceLevel: "all",
    salaryRange: [0, 200000],
    remoteOnly: false,
    industry: "all",
  })
  const [searchQuery, setSearchQuery] = useState("")
  const [savedJobs, setSavedJobs] = useState<Set<string>>(new Set())
  const [isLoading, setIsLoading] = useState(false)

  const handleSaveJob = (jobId: string) => {
    setSavedJobs((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(jobId)) {
        newSet.delete(jobId)
        toast({
          title: "Job removed from saved",
          description: "Job has been removed from your saved list",
        })
      } else {
        newSet.add(jobId)
        toast({
          title: "Job saved!",
          description: "Job has been added to your saved list",
        })
      }
      return newSet
    })
  }

  const handleSearch = async () => {
    setIsLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Filter jobs based on search criteria
    const filtered = mockJobMatches.filter((job) => {
      const matchesQuery =
        !searchQuery ||
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.skills.some((skill) => skill.toLowerCase().includes(searchQuery.toLowerCase()))

      const matchesLocation =
        !filters.location || job.location.toLowerCase().includes(filters.location.toLowerCase()) || job.isRemote

      const matchesType = filters.jobType === "all" || job.type === filters.jobType
      const matchesLevel = filters.experienceLevel === "all" || job.experienceLevel === filters.experienceLevel
      const matchesSalary = job.salary.min >= filters.salaryRange[0] && job.salary.max <= filters.salaryRange[1]
      const matchesRemote = !filters.remoteOnly || job.isRemote
      const matchesIndustry = filters.industry === "all" || job.industry === filters.industry

      return (
        matchesQuery &&
        matchesLocation &&
        matchesType &&
        matchesLevel &&
        matchesSalary &&
        matchesRemote &&
        matchesIndustry
      )
    })

    setJobMatches(filtered)
    setIsLoading(false)
  }

  const getMatchScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600 bg-green-100"
    if (score >= 80) return "text-blue-600 bg-blue-100"
    if (score >= 70) return "text-yellow-600 bg-yellow-100"
    return "text-gray-600 bg-gray-100"
  }

  const formatSalary = (salary: JobMatch["salary"]) => {
    return `$${(salary.min / 1000).toFixed(0)}k - $${(salary.max / 1000).toFixed(0)}k`
  }

  const getDaysAgo = (date: Date) => {
    const days = Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60 * 24))
    return days === 0 ? "Today" : days === 1 ? "1 day ago" : `${days} days ago`
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-6 h-6" />
            AI-Powered Career Matching
          </CardTitle>
          <CardDescription>
            Discover personalized job opportunities and career paths based on your skills, interests, and goals
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="jobs" className="flex items-center gap-2">
            <Briefcase className="w-4 h-4" />
            Job Matches
          </TabsTrigger>
          <TabsTrigger value="careers" className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Career Paths
          </TabsTrigger>
          <TabsTrigger value="saved" className="flex items-center gap-2">
            <Heart className="w-4 h-4" />
            Saved ({savedJobs.size})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="jobs" className="space-y-6">
          {/* Search and Filters */}
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-1">
                    <Input
                      placeholder="Search jobs, companies, or skills..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full"
                    />
                  </div>
                  <Button onClick={handleSearch} disabled={isLoading}>
                    {isLoading ? (
                      <RefreshCw className="w-4 h-4 animate-spin mr-2" />
                    ) : (
                      <Search className="w-4 h-4 mr-2" />
                    )}
                    Search
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Location</Label>
                    <Input
                      placeholder="City, State, or Remote"
                      value={filters.location}
                      onChange={(e) => setFilters((prev) => ({ ...prev, location: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Job Type</Label>
                    <Select
                      value={filters.jobType}
                      onValueChange={(value) => setFilters((prev) => ({ ...prev, jobType: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="Full-time">Full-time</SelectItem>
                        <SelectItem value="Part-time">Part-time</SelectItem>
                        <SelectItem value="Contract">Contract</SelectItem>
                        <SelectItem value="Remote">Remote</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Experience Level</Label>
                    <Select
                      value={filters.experienceLevel}
                      onValueChange={(value) => setFilters((prev) => ({ ...prev, experienceLevel: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Levels</SelectItem>
                        <SelectItem value="Entry">Entry Level</SelectItem>
                        <SelectItem value="Mid">Mid Level</SelectItem>
                        <SelectItem value="Senior">Senior Level</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Industry</Label>
                    <Select
                      value={filters.industry}
                      onValueChange={(value) => setFilters((prev) => ({ ...prev, industry: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Industries</SelectItem>
                        <SelectItem value="Technology">Technology</SelectItem>
                        <SelectItem value="Finance">Finance</SelectItem>
                        <SelectItem value="Healthcare">Healthcare</SelectItem>
                        <SelectItem value="Data & Analytics">Data & Analytics</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">
                    Salary Range: ${filters.salaryRange[0].toLocaleString()} - $
                    {filters.salaryRange[1].toLocaleString()}
                  </Label>
                  <Slider
                    value={filters.salaryRange}
                    onValueChange={(value) => setFilters((prev) => ({ ...prev, salaryRange: value }))}
                    max={200000}
                    min={0}
                    step={5000}
                    className="w-full"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remote-only"
                    checked={filters.remoteOnly}
                    onCheckedChange={(checked) => setFilters((prev) => ({ ...prev, remoteOnly: checked as boolean }))}
                  />
                  <Label htmlFor="remote-only" className="text-sm">
                    Remote jobs only
                  </Label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Job Results */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">
                {jobMatches.length} Job{jobMatches.length !== 1 ? "s" : ""} Found
              </h3>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Filter className="w-4 h-4" />
                Sorted by match score
              </div>
            </div>

            {jobMatches.map((job) => (
              <Card key={job.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="text-lg font-semibold">{job.title}</h4>
                        <Badge className={`${getMatchScoreColor(job.matchScore)} font-medium`}>
                          {job.matchScore}% match
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                        <span className="flex items-center gap-1">
                          <Building className="w-4 h-4" />
                          {job.company}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {job.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <DollarSign className="w-4 h-4" />
                          {formatSalary(job.salary)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {getDaysAgo(job.postedDate)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{job.description}</p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSaveJob(job.id)}
                        className={savedJobs.has(job.id) ? "text-red-600 border-red-200" : ""}
                      >
                        <Heart className={`w-4 h-4 ${savedJobs.has(job.id) ? "fill-current" : ""}`} />
                      </Button>
                      <div className="flex items-center gap-1 text-xs">
                        <Star className="w-3 h-3 fill-current text-yellow-500" />
                        {job.companyRating}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <h5 className="text-sm font-medium mb-1">Required Skills:</h5>
                      <div className="flex flex-wrap gap-1">
                        {job.skills.map((skill, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h5 className="text-sm font-medium mb-1">Benefits:</h5>
                      <div className="flex flex-wrap gap-1">
                        {job.benefits.slice(0, 4).map((benefit, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {benefit}
                          </Badge>
                        ))}
                        {job.benefits.length > 4 && (
                          <Badge variant="outline" className="text-xs">
                            +{job.benefits.length - 4} more
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-2">
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>{job.type}</span>
                        <span>{job.experienceLevel} level</span>
                        <span>{job.companySize} employees</span>
                        {job.isRemote && <Badge className="bg-green-500 text-xs">Remote</Badge>}
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                        <Button size="sm">
                          Apply Now
                          <ExternalLink className="w-3 h-3 ml-1" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="careers" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {careerPaths.map((career) => (
              <Card key={career.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{career.title}</CardTitle>
                      <CardDescription>{career.description}</CardDescription>
                    </div>
                    <Badge className={`${getMatchScoreColor(career.matchScore)} font-medium`}>
                      {career.matchScore}% match
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Average Salary:</span>
                      <p className="text-muted-foreground">{career.averageSalary}</p>
                    </div>
                    <div>
                      <span className="font-medium">Growth Rate:</span>
                      <p className="text-green-600">{career.growthRate}</p>
                    </div>
                    <div>
                      <span className="font-medium">Education:</span>
                      <p className="text-muted-foreground">{career.educationLevel}</p>
                    </div>
                    <div>
                      <span className="font-medium">Experience:</span>
                      <p className="text-muted-foreground">{career.experienceRequired}</p>
                    </div>
                  </div>

                  <div>
                    <h5 className="text-sm font-medium mb-2">Required Skills:</h5>
                    <div className="flex flex-wrap gap-1">
                      {career.requiredSkills.map((skill, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h5 className="text-sm font-medium mb-2">Top Industries:</h5>
                    <div className="flex flex-wrap gap-1">
                      {career.industries.map((industry, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {industry}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h5 className="text-sm font-medium mb-2">Related Roles:</h5>
                    <div className="space-y-1">
                      {career.relatedRoles.map((role, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <ChevronRight className="w-3 h-3" />
                          {role}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                      <BookOpen className="w-4 h-4 mr-2" />
                      Learn More
                    </Button>
                    <Button size="sm" className="flex-1">
                      <Target className="w-4 h-4 mr-2" />
                      Start Path
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="saved" className="space-y-6">
          {savedJobs.size > 0 ? (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Your Saved Jobs ({savedJobs.size})</h3>
              {jobMatches
                .filter((job) => savedJobs.has(job.id))
                .map((job) => (
                  <Card key={job.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="text-lg font-semibold">{job.title}</h4>
                            <Badge className={`${getMatchScoreColor(job.matchScore)} font-medium`}>
                              {job.matchScore}% match
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                            <span className="flex items-center gap-1">
                              <Building className="w-4 h-4" />
                              {job.company}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              {job.location}
                            </span>
                            <span className="flex items-center gap-1">
                              <DollarSign className="w-4 h-4" />
                              {formatSalary(job.salary)}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleSaveJob(job.id)}
                            className="text-red-600 border-red-200"
                          >
                            <Heart className="w-4 h-4 fill-current" />
                          </Button>
                          <Button size="sm">
                            Apply Now
                            <ExternalLink className="w-3 h-3 ml-1" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          ) : (
            <Card>
              <CardContent className="pt-6 text-center py-12">
                <Heart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Saved Jobs Yet</h3>
                <p className="text-muted-foreground mb-4">
                  Save jobs you're interested in to keep track of opportunities
                </p>
                <Button onClick={() => setActiveTab("jobs")}>Browse Jobs</Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
