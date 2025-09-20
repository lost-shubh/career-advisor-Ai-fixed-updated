"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Target,
  TrendingUp,
  Award,
  Calendar,
  ArrowRight,
  Brain,
  Lightbulb,
  MessageCircle,
  User,
  BookOpen,
  Users,
  FileText,
  BarChart3,
  LogOut,
} from "lucide-react"
import { SkillsAssessment } from "./skills-assessment"
import { CareerRecommendations } from "./career-recommendations"
import { LearningRoadmap } from "./learning-roadmap"
import { CommunityHub } from "./community-hub"
import { ResumeBuilder } from "./resume-builder"
import { MarketInsights } from "./market-insights"
import { AIChatbot } from "./ai-chatbot"
import { CalendarGamification } from "./calendar-gamification"
import { SchedulingSystem } from "./scheduling-system"
import { UserProfile } from "./user-profile"

interface DashboardProps {
  userData: any
  onLogout?: () => void
}

const sidebarItems = [
  { id: "overview", label: "Overview", icon: Target },
  { id: "profile", label: "Profile", icon: User },
  { id: "skills", label: "Skills", icon: Brain },
  { id: "careers", label: "Careers", icon: Lightbulb },
  { id: "learning", label: "Learning", icon: BookOpen },
  { id: "progress", label: "Progress", icon: TrendingUp },
  { id: "schedule", label: "Schedule", icon: Calendar },
  { id: "community", label: "Community", icon: Users },
  { id: "resume", label: "Resume", icon: FileText },
  { id: "insights", label: "Market", icon: BarChart3 },
]

export function Dashboard({ userData, onLogout }: DashboardProps) {
  const [activeTab, setActiveTab] = useState("overview")
  const [showChatbot, setShowChatbot] = useState(false)
  const [chatbotMinimized, setChatbotMinimized] = useState(true)

  const hasCompletedAssessment = userData.assessmentCompleted || false
  const canShowProgress = hasCompletedAssessment || !userData.isNewUser

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted flex">
      <div className="w-64 bg-card border-r border-border/40 flex flex-col">
        {/* Sidebar Header */}
        <div className="p-6 border-b border-border/40">
          <h2 className="text-xl font-bold text-foreground">CareerPath AI</h2>
          <p className="text-sm text-muted-foreground mt-1">Welcome, {userData.name}</p>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-4 space-y-2">
          {sidebarItems.map((item) => {
            const Icon = item.icon
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                  activeTab === item.id ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-muted"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            )
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-border/40 space-y-2">
          <Button
            variant="outline"
            onClick={() => {
              setShowChatbot(true)
              setChatbotMinimized(false)
            }}
            className="w-full flex items-center gap-2"
          >
            <MessageCircle className="w-4 h-4" />
            AI Assistant
          </Button>
          {onLogout && (
            <Button variant="outline" onClick={onLogout} className="w-full flex items-center gap-2 bg-transparent">
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-card border-b border-border/40 p-6">
          <h1 className="text-2xl font-bold text-foreground mb-1">
            {sidebarItems.find((item) => item.id === activeTab)?.label || "Dashboard"}
          </h1>
          <p className="text-muted-foreground">
            {activeTab === "overview" && "Your personalized career journey overview"}
            {activeTab === "profile" && "Manage your personal information and preferences"}
            {activeTab === "skills" && "Assess and develop your professional skills"}
            {activeTab === "careers" && "Explore career recommendations tailored for you"}
            {activeTab === "learning" && "Follow structured learning paths for your goals"}
            {activeTab === "progress" && "Track your achievements and milestones"}
            {activeTab === "schedule" && "Book sessions with mentors and counselors"}
            {activeTab === "community" && "Connect with peers and industry professionals"}
            {activeTab === "resume" && "Build and optimize your professional resume"}
            {activeTab === "insights" && "Stay updated with market trends and opportunities"}
          </p>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-6 overflow-auto">
          {!canShowProgress && activeTab === "overview" && (
            <Card className="mb-8 border-primary/20 bg-primary/5">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Target className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1">Complete Your Skills Assessment</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Take our comprehensive assessment to unlock personalized career recommendations and learning
                      paths.
                    </p>
                    <Button onClick={() => setActiveTab("skills")}>
                      Start Assessment
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Tab Content */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              {canShowProgress && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">Skills Mapped</p>
                          <p className="text-2xl font-bold">12</p>
                        </div>
                        <Brain className="w-8 h-8 text-primary" />
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">Career Matches</p>
                          <p className="text-2xl font-bold">8</p>
                        </div>
                        <Target className="w-8 h-8 text-secondary" />
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">Learning Progress</p>
                          <p className="text-2xl font-bold">65%</p>
                        </div>
                        <TrendingUp className="w-8 h-8 text-accent" />
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">Achievements</p>
                          <p className="text-2xl font-bold">5</p>
                        </div>
                        <Award className="w-8 h-8 text-primary" />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {canShowProgress && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Career Recommendations */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Lightbulb className="w-5 h-5 text-primary" />
                        Top Career Recommendations
                      </CardTitle>
                      <CardDescription>
                        Based on your interests in {userData.interests?.slice(0, 2).join(" and ") || "your profile"}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {(userData.careerField?.toLowerCase().includes("medical") ||
                      userData.careerField?.toLowerCase().includes("healthcare")
                        ? [
                            { title: "Doctor (MBBS)", match: 95, growth: "+15%" },
                            { title: "Pharmacist", match: 88, growth: "+12%" },
                            { title: "Nurse", match: 85, growth: "+18%" },
                          ]
                        : userData.careerField?.toLowerCase().includes("engineering")
                          ? [
                              { title: "Software Engineer", match: 92, growth: "+22%" },
                              { title: "Data Scientist", match: 88, growth: "+35%" },
                              { title: "DevOps Engineer", match: 85, growth: "+18%" },
                            ]
                          : [
                              { title: "Business Analyst", match: 78, growth: "+14%" },
                              { title: "Digital Marketing Specialist", match: 75, growth: "+25%" },
                              { title: "Content Creator", match: 72, growth: "+20%" },
                            ]
                      ).map((career, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
                        >
                          <div>
                            <h4 className="font-medium">{career.title}</h4>
                            <p className="text-sm text-muted-foreground">
                              {career.match}% match • {career.growth} growth
                            </p>
                          </div>
                          <Button size="sm" variant="outline" onClick={() => setActiveTab("careers")}>
                            Explore
                            <ArrowRight className="w-4 h-4 ml-1" />
                          </Button>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  {/* Skill Progress */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Target className="w-5 h-5 text-primary" />
                        Skill Development
                      </CardTitle>
                      <CardDescription>Your progress in key areas</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {[
                        { skill: "Programming", progress: 75, level: "Intermediate" },
                        { skill: "Communication", progress: 60, level: "Beginner" },
                        { skill: "Problem Solving", progress: 85, level: "Advanced" },
                      ].map((item, index) => (
                        <div key={index} className="space-y-2">
                          <div className="flex justify-between">
                            <span className="font-medium">{item.skill}</span>
                            <Badge variant="secondary">{item.level}</Badge>
                          </div>
                          <Progress value={item.progress} className="h-2" />
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          )}

          {activeTab === "profile" && <UserProfile userData={userData} />}
          {activeTab === "skills" && <SkillsAssessment userData={userData} />}
          {activeTab === "careers" && <CareerRecommendations userData={userData} />}
          {activeTab === "learning" && <LearningRoadmap userData={userData} />}
          {activeTab === "progress" && <CalendarGamification userData={userData} />}
          {activeTab === "schedule" && <SchedulingSystem userData={userData} />}
          {activeTab === "community" && <CommunityHub userData={userData} />}
          {activeTab === "resume" && <ResumeBuilder userData={userData} />}
          {activeTab === "insights" && <MarketInsights userData={userData} />}
        </div>
      </div>

      {showChatbot && (
        <AIChatbot
          userData={userData}
          isMinimized={chatbotMinimized}
          onToggleMinimize={() => setChatbotMinimized(!chatbotMinimized)}
          onClose={() => setShowChatbot(false)}
        />
      )}
    </div>
  )
}
