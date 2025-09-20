"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { EnhancedRewardsStore } from "./enhanced-rewards-store"
import {
  Calendar,
  Trophy,
  Target,
  Flame,
  Star,
  Award,
  CheckCircle,
  TrendingUp,
  Gift,
  Medal,
  Crown,
  Sparkles,
} from "lucide-react"

interface CalendarGamificationProps {
  userData: any
}

const achievements = [
  {
    id: "first_login",
    name: "Welcome Aboard",
    description: "Complete your first login",
    icon: Star,
    color: "text-blue-500",
    unlocked: true,
  },
  {
    id: "profile_complete",
    name: "Profile Master",
    description: "Complete your profile 100%",
    icon: CheckCircle,
    color: "text-green-500",
    unlocked: true,
  },
  {
    id: "first_assessment",
    name: "Self Discoverer",
    description: "Complete your first skills assessment",
    icon: Target,
    color: "text-purple-500",
    unlocked: false,
  },
  {
    id: "week_streak",
    name: "Consistent Learner",
    description: "Maintain a 7-day learning streak",
    icon: Flame,
    color: "text-orange-500",
    unlocked: false,
  },
  {
    id: "month_streak",
    name: "Dedication Champion",
    description: "Maintain a 30-day learning streak",
    icon: Trophy,
    color: "text-yellow-500",
    unlocked: false,
  },
  {
    id: "resume_builder",
    name: "Resume Pro",
    description: "Create and optimize your resume",
    icon: Award,
    color: "text-indigo-500",
    unlocked: false,
  },
  {
    id: "interview_practice",
    name: "Interview Ready",
    description: "Complete 5 interview practice sessions",
    icon: Medal,
    color: "text-pink-500",
    unlocked: false,
  },
  {
    id: "career_explorer",
    name: "Path Finder",
    description: "Explore 10 different career paths",
    icon: Crown,
    color: "text-emerald-500",
    unlocked: false,
  },
]

const dailyTasks = [
  { id: "daily_login", name: "Daily Check-in", points: 10, completed: true },
  { id: "skill_assessment", name: "Complete Skills Assessment", points: 50, completed: false },
  { id: "career_exploration", name: "Explore New Career Path", points: 30, completed: false },
  { id: "resume_update", name: "Update Resume Section", points: 25, completed: true },
  { id: "interview_practice", name: "Practice Interview Questions", points: 40, completed: false },
]

const weeklyGoals = [
  { id: "learning_hours", name: "Complete 5 hours of learning", progress: 3, target: 5, points: 100 },
  { id: "assessments", name: "Complete 3 skill assessments", progress: 1, target: 3, points: 150 },
  { id: "career_research", name: "Research 5 career paths", progress: 2, target: 5, points: 120 },
]

export function CalendarGamification({ userData }: CalendarGamificationProps) {
  const [currentStreak, setCurrentStreak] = useState(5)
  const [totalPoints, setTotalPoints] = useState(1250)
  const [level, setLevel] = useState(3)
  const [levelProgress, setLevelProgress] = useState(65)
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [activityData, setActivityData] = useState<{ [key: string]: number }>({})

  // Generate activity data for the past 90 days
  useEffect(() => {
    const data: { [key: string]: number } = {}
    const today = new Date()

    for (let i = 0; i < 90; i++) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split("T")[0]

      // Simulate activity levels (0-4)
      const activity = Math.random() > 0.3 ? Math.floor(Math.random() * 4) + 1 : 0
      data[dateStr] = activity
    }

    setActivityData(data)
  }, [])

  const getActivityColor = (level: number) => {
    switch (level) {
      case 0:
        return "bg-gray-100 dark:bg-gray-800"
      case 1:
        return "bg-green-200 dark:bg-green-900"
      case 2:
        return "bg-green-300 dark:bg-green-700"
      case 3:
        return "bg-green-400 dark:bg-green-600"
      case 4:
        return "bg-green-500 dark:bg-green-500"
      default:
        return "bg-gray-100 dark:bg-gray-800"
    }
  }

  const renderCalendarGrid = () => {
    const today = new Date()
    const startDate = new Date(today)
    startDate.setDate(startDate.getDate() - 89) // 90 days ago

    const days = []
    for (let i = 0; i < 90; i++) {
      const date = new Date(startDate)
      date.setDate(date.getDate() + i)
      const dateStr = date.toISOString().split("T")[0]
      const activity = activityData[dateStr] || 0

      days.push(
        <div
          key={dateStr}
          className={`w-3 h-3 rounded-sm ${getActivityColor(activity)} cursor-pointer hover:ring-2 hover:ring-primary transition-all`}
          title={`${date.toLocaleDateString()}: ${activity > 0 ? `${activity} activities` : "No activity"}`}
        />,
      )
    }

    return days
  }

  const completedTasks = dailyTasks.filter((task) => task.completed).length
  const totalDailyPoints = dailyTasks.filter((task) => task.completed).reduce((sum, task) => sum + task.points, 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Progress & Achievements
          </h2>
          <p className="text-muted-foreground mt-1">Track your learning journey and earn rewards</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-center">
            <div className="flex items-center gap-1 text-orange-500">
              <Flame className="w-5 h-5" />
              <span className="text-2xl font-bold">{currentStreak}</span>
            </div>
            <p className="text-xs text-muted-foreground">Day Streak</p>
          </div>
          <div className="text-center">
            <div className="flex items-center gap-1 text-yellow-500">
              <Star className="w-5 h-5" />
              <span className="text-2xl font-bold">{totalPoints}</span>
            </div>
            <p className="text-xs text-muted-foreground">Total Points</p>
          </div>
          <div className="text-center">
            <div className="flex items-center gap-1 text-purple-500">
              <Crown className="w-5 h-5" />
              <span className="text-2xl font-bold">{level}</span>
            </div>
            <p className="text-xs text-muted-foreground">Level</p>
          </div>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 bg-muted/50">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="calendar" className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Activity
          </TabsTrigger>
          <TabsTrigger value="achievements" className="flex items-center gap-2">
            <Trophy className="w-4 h-4" />
            Achievements
          </TabsTrigger>
          <TabsTrigger value="leaderboard" className="flex items-center gap-2">
            <Medal className="w-4 h-4" />
            Leaderboard
          </TabsTrigger>
          <TabsTrigger value="rewards" className="flex items-center gap-2">
            <Gift className="w-4 h-4" />
            Rewards Store
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Level Progress */}
          <Card className="card-enhanced">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Crown className="w-5 h-5 text-purple-500" />
                Level {level} - Career Explorer
              </CardTitle>
              <CardDescription>
                {1000 - levelProgress * 10} points to Level {level + 1}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Progress value={levelProgress} className="h-3 mb-2" />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>{levelProgress * 10}/1000 XP</span>
                <span>Next: Career Specialist</span>
              </div>
            </CardContent>
          </Card>

          {/* Daily Tasks */}
          <Card className="card-enhanced">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    Daily Tasks
                  </CardTitle>
                  <CardDescription>
                    {completedTasks}/{dailyTasks.length} completed • {totalDailyPoints} points earned today
                  </CardDescription>
                </div>
                <Badge
                  variant="secondary"
                  className="bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200"
                >
                  +{totalDailyPoints} XP
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {dailyTasks.map((task) => (
                  <div key={task.id} className="flex items-center justify-between p-3 rounded-lg border bg-card/50">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          task.completed ? "bg-green-500 border-green-500" : "border-muted-foreground"
                        }`}
                      >
                        {task.completed && <CheckCircle className="w-3 h-3 text-white" />}
                      </div>
                      <span className={task.completed ? "line-through text-muted-foreground" : ""}>{task.name}</span>
                    </div>
                    <Badge variant={task.completed ? "secondary" : "outline"}>+{task.points} XP</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Weekly Goals */}
          <Card className="card-enhanced">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-blue-500" />
                Weekly Goals
              </CardTitle>
              <CardDescription>Complete these goals to earn bonus points</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {weeklyGoals.map((goal) => (
                  <div key={goal.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{goal.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">
                          {goal.progress}/{goal.target}
                        </span>
                        <Badge variant="outline">+{goal.points} XP</Badge>
                      </div>
                    </div>
                    <Progress value={(goal.progress / goal.target) * 100} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="calendar" className="space-y-6">
          <Card className="card-enhanced">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                Activity Calendar
              </CardTitle>
              <CardDescription>Your learning activity over the past 90 days</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Activity Grid */}
                <div className="flex flex-col gap-2">
                  <div className="grid grid-cols-13 gap-1 max-w-4xl">{renderCalendarGrid()}</div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>90 days ago</span>
                    <div className="flex items-center gap-2">
                      <span>Less</span>
                      <div className="flex gap-1">
                        <div className="w-3 h-3 rounded-sm bg-gray-100 dark:bg-gray-800"></div>
                        <div className="w-3 h-3 rounded-sm bg-green-200 dark:bg-green-900"></div>
                        <div className="w-3 h-3 rounded-sm bg-green-300 dark:bg-green-700"></div>
                        <div className="w-3 h-3 rounded-sm bg-green-400 dark:bg-green-600"></div>
                        <div className="w-3 h-3 rounded-sm bg-green-500 dark:bg-green-500"></div>
                      </div>
                      <span>More</span>
                    </div>
                    <span>Today</span>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
                  <Card className="text-center p-4">
                    <div className="text-2xl font-bold text-green-500">{currentStreak}</div>
                    <div className="text-sm text-muted-foreground">Current Streak</div>
                  </Card>
                  <Card className="text-center p-4">
                    <div className="text-2xl font-bold text-blue-500">23</div>
                    <div className="text-sm text-muted-foreground">Longest Streak</div>
                  </Card>
                  <Card className="text-center p-4">
                    <div className="text-2xl font-bold text-purple-500">67</div>
                    <div className="text-sm text-muted-foreground">Active Days</div>
                  </Card>
                  <Card className="text-center p-4">
                    <div className="text-2xl font-bold text-orange-500">74%</div>
                    <div className="text-sm text-muted-foreground">Consistency</div>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="achievements" className="space-y-6">
          <Card className="card-enhanced">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-500" />
                Achievements & Badges
              </CardTitle>
              <CardDescription>
                {achievements.filter((a) => a.unlocked).length}/{achievements.length} achievements unlocked
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {achievements.map((achievement) => {
                  const Icon = achievement.icon
                  return (
                    <Card
                      key={achievement.id}
                      className={`p-4 transition-all duration-200 ${
                        achievement.unlocked
                          ? "bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-yellow-200 dark:border-yellow-800"
                          : "opacity-60 grayscale"
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div
                          className={`p-2 rounded-full ${
                            achievement.unlocked
                              ? "bg-yellow-100 dark:bg-yellow-900/30"
                              : "bg-gray-100 dark:bg-gray-800"
                          }`}
                        >
                          <Icon className={`w-5 h-5 ${achievement.unlocked ? achievement.color : "text-gray-400"}`} />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-sm">{achievement.name}</h3>
                          <p className="text-xs text-muted-foreground">{achievement.description}</p>
                        </div>
                        {achievement.unlocked && <Sparkles className="w-4 h-4 text-yellow-500" />}
                      </div>
                      {achievement.unlocked && (
                        <Badge
                          variant="secondary"
                          className="w-full justify-center bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200"
                        >
                          Unlocked!
                        </Badge>
                      )}
                    </Card>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Achievements */}
          <Card className="card-enhanced">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-blue-500" />
                Next Achievements
              </CardTitle>
              <CardDescription>Keep going to unlock these badges</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {achievements
                  .filter((a) => !a.unlocked)
                  .slice(0, 3)
                  .map((achievement) => {
                    const Icon = achievement.icon
                    return (
                      <div key={achievement.id} className="flex items-center gap-3 p-3 rounded-lg border bg-card/50">
                        <Icon className={`w-5 h-5 ${achievement.color}`} />
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">{achievement.name}</h4>
                          <p className="text-xs text-muted-foreground">{achievement.description}</p>
                        </div>
                        <Badge variant="outline">Coming Soon</Badge>
                      </div>
                    )
                  })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="leaderboard" className="space-y-6">
          <Card className="card-enhanced">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Medal className="w-5 h-5 text-gold" />
                Weekly Leaderboard
              </CardTitle>
              <CardDescription>See how you rank among other learners this week</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { rank: 1, name: "Alex Chen", points: 2450, level: 5, avatar: "AC" },
                  { rank: 2, name: "Priya Sharma", points: 2380, level: 4, avatar: "PS" },
                  {
                    rank: 3,
                    name: "You",
                    points: 1250,
                    level: 3,
                    avatar: userData.name?.charAt(0) || "U",
                    isUser: true,
                  },
                  { rank: 4, name: "Rahul Kumar", points: 1180, level: 3, avatar: "RK" },
                  { rank: 5, name: "Sarah Johnson", points: 1050, level: 3, avatar: "SJ" },
                ].map((user) => (
                  <div
                    key={user.rank}
                    className={`flex items-center gap-4 p-4 rounded-lg border ${
                      user.isUser ? "bg-primary/5 border-primary/20 ring-1 ring-primary/20" : "bg-card/50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                          user.rank === 1
                            ? "bg-yellow-100 text-yellow-800"
                            : user.rank === 2
                              ? "bg-gray-100 text-gray-800"
                              : user.rank === 3
                                ? "bg-orange-100 text-orange-800"
                                : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {user.rank <= 3 ? (
                          user.rank === 1 ? (
                            <Crown className="w-4 h-4" />
                          ) : user.rank === 2 ? (
                            <Medal className="w-4 h-4" />
                          ) : (
                            <Award className="w-4 h-4" />
                          )
                        ) : (
                          user.rank
                        )}
                      </div>
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-semibold text-primary">
                        {user.avatar}
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className={`font-semibold ${user.isUser ? "text-primary" : ""}`}>{user.name}</span>
                        {user.isUser && <Badge variant="secondary">You</Badge>}
                      </div>
                      <div className="text-sm text-muted-foreground">Level {user.level}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-lg">{user.points.toLocaleString()}</div>
                      <div className="text-xs text-muted-foreground">points</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Rewards */}
          <Card className="card-enhanced">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gift className="w-5 h-5 text-pink-500" />
                Rewards Store
              </CardTitle>
              <CardDescription>Redeem your points for exclusive rewards</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { name: "Premium Resume Template", cost: 500, description: "Unlock exclusive resume designs" },
                  { name: "1-on-1 Career Counseling", cost: 2000, description: "30-minute session with expert" },
                  { name: "Industry Certification Voucher", cost: 1500, description: "Free certification exam" },
                  { name: "LinkedIn Profile Review", cost: 800, description: "Professional profile optimization" },
                ].map((reward, index) => (
                  <Card key={index} className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-sm">{reward.name}</h4>
                      <Badge variant="outline">{reward.cost} pts</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-3">{reward.description}</p>
                    <Button
                      size="sm"
                      variant={totalPoints >= reward.cost ? "default" : "secondary"}
                      disabled={totalPoints < reward.cost}
                      className="w-full"
                    >
                      {totalPoints >= reward.cost ? "Redeem" : "Not enough points"}
                    </Button>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rewards" className="space-y-6">
          <EnhancedRewardsStore userData={userData} userPoints={totalPoints} userLevel={level} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
