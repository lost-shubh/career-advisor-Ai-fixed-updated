"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, ArrowRight, Info } from "lucide-react"
import { Dashboard } from "./dashboard"
import { curriculumData } from "@/data/curriculum-data"

interface OnboardingFormProps {
  role: string
  userData?: any
}

const steps = [
  { id: "basic", title: "Basic Information" },
  { id: "education", title: "Education & Background" },
  { id: "interests", title: "Interests & Goals" },
  { id: "preferences", title: "Learning Preferences" },
]

const states = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Delhi",
  "Jammu and Kashmir",
  "Ladakh",
]

const educationLevels = ["10th Grade", "12th Grade", "Undergraduate", "Graduate", "Post Graduate", "PhD"]

const getStreamsForLevel = (level: string) => {
  if (level === "10th Grade") {
    return ["General"]
  } else if (level === "12th Grade") {
    return ["Science - PCM", "Science - PCB", "Commerce", "Arts/Humanities"]
  } else {
    return ["Engineering", "Medical", "Commerce", "Arts", "Management", "Law", "Other"]
  }
}

const interests = [
  "Technology & Programming",
  "Healthcare & Medicine",
  "Business & Finance",
  "Arts & Design",
  "Education & Teaching",
  "Sports & Fitness",
  "Environment & Sustainability",
  "Social Work & NGO",
  "Research & Development",
  "Media & Communication",
  "Government & Public Service",
  "Creative Writing",
  "Data Science & Analytics",
  "Digital Marketing",
  "Entrepreneurship",
  "Psychology & Counseling",
]

export function OnboardingForm({ role, userData }: OnboardingFormProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState({
    name: userData?.name || "",
    age: userData?.age || "",
    state: userData?.state || "",
    city: userData?.city || "",
    educationLevel: "",
    stream: "",
    institution: "",
    interests: [] as string[],
    goals: "",
    learningStyle: "",
    timeCommitment: "",
    languages: [] as string[],
  })
  const [showDashboard, setShowDashboard] = useState(false)
  const [availableStreams, setAvailableStreams] = useState<string[]>([])
  const [careerSuggestions, setCareerSuggestions] = useState<string[]>([])

  const getCareerSuggestions = (level: string, stream: string) => {
    if (level === "10th Grade") {
      return curriculumData["10th"].streams["General"].careers
    } else if (
      level === "12th Grade" &&
      curriculumData["12th"].streams[stream as keyof (typeof curriculumData)["12th"]["streams"]]
    ) {
      return curriculumData["12th"].streams[stream as keyof (typeof curriculumData)["12th"]["streams"]].careers
    } else if (
      level === "Undergraduate" &&
      curriculumData["Graduation"].streams[stream as keyof (typeof curriculumData)["Graduation"]["streams"]]
    ) {
      return (
        curriculumData["Graduation"].streams[stream as keyof (typeof curriculumData)["Graduation"]["streams"]]
          .careers || []
      )
    }
    return []
  }

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      // Save user data to localStorage
      const completeUserData = {
        ...formData,
        role,
        isNewUser: false,
        completedOnboarding: true,
        joinDate: new Date().toISOString(),
      }
      localStorage.setItem("careerpath_current_user", JSON.stringify(completeUserData))
      setShowDashboard(true)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleEducationLevelChange = (level: string) => {
    setFormData((prev) => ({ ...prev, educationLevel: level, stream: "" }))
    setAvailableStreams(getStreamsForLevel(level))
    setCareerSuggestions([])
  }

  const handleStreamChange = (stream: string) => {
    setFormData((prev) => ({ ...prev, stream }))
    setCareerSuggestions(getCareerSuggestions(formData.educationLevel, stream))
  }

  const handleInterestToggle = (interest: string) => {
    setFormData((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }))
  }

  const handleLanguageToggle = (language: string) => {
    setFormData((prev) => ({
      ...prev,
      languages: prev.languages.includes(language)
        ? prev.languages.filter((l) => l !== language)
        : [...prev.languages, language],
    }))
  }

  if (showDashboard) {
    return <Dashboard userData={{ ...formData, role }} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold">Welcome! Let's get to know you</h1>
            <span className="text-sm text-muted-foreground">
              Step {currentStep + 1} of {steps.length}
            </span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{steps[currentStep].title}</CardTitle>
            <CardDescription>
              {currentStep === 0 && "Tell us about yourself"}
              {currentStep === 1 && "Share your educational background"}
              {currentStep === 2 && "What interests you most?"}
              {currentStep === 3 && "How do you prefer to learn?"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {currentStep === 0 && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="age">Age</Label>
                    <Input
                      id="age"
                      type="number"
                      value={formData.age}
                      onChange={(e) => setFormData((prev) => ({ ...prev, age: e.target.value }))}
                      placeholder="Your age"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="state">State</Label>
                    <Select
                      value={formData.state}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, state: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select your state" />
                      </SelectTrigger>
                      <SelectContent>
                        {states.map((state) => (
                          <SelectItem key={state} value={state}>
                            {state}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => setFormData((prev) => ({ ...prev, city: e.target.value }))}
                      placeholder="Your city"
                    />
                  </div>
                </div>
              </>
            )}

            {currentStep === 1 && (
              <>
                <div>
                  <Label htmlFor="educationLevel">Current Education Level</Label>
                  <Select value={formData.educationLevel} onValueChange={handleEducationLevelChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your education level" />
                    </SelectTrigger>
                    <SelectContent>
                      {educationLevels.map((level) => (
                        <SelectItem key={level} value={level}>
                          {level}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {availableStreams.length > 0 && (
                  <div>
                    <Label htmlFor="stream">Stream/Field of Study</Label>
                    <Select value={formData.stream} onValueChange={handleStreamChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your stream" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableStreams.map((stream) => (
                          <SelectItem key={stream} value={stream}>
                            {stream}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div>
                  <Label htmlFor="institution">Institution/School/College</Label>
                  <Input
                    id="institution"
                    value={formData.institution}
                    onChange={(e) => setFormData((prev) => ({ ...prev, institution: e.target.value }))}
                    placeholder="Name of your institution"
                  />
                </div>

                {careerSuggestions.length > 0 && (
                  <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Info className="w-4 h-4 text-blue-600" />
                      <Label className="text-blue-800 dark:text-blue-200 font-medium">
                        Career Opportunities in {formData.stream}
                      </Label>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      {careerSuggestions.slice(0, 8).map((career, index) => (
                        <div key={index} className="text-blue-700 dark:text-blue-300">
                          • {career}
                        </div>
                      ))}
                    </div>
                    {careerSuggestions.length > 8 && (
                      <p className="text-xs text-blue-600 dark:text-blue-400 mt-2">
                        +{careerSuggestions.length - 8} more career options available
                      </p>
                    )}
                  </div>
                )}
              </>
            )}

            {currentStep === 2 && (
              <>
                <div>
                  <Label>Areas of Interest (Select all that apply)</Label>
                  <div className="grid grid-cols-2 gap-3 mt-2">
                    {interests.map((interest) => (
                      <div key={interest} className="flex items-center space-x-2">
                        <Checkbox
                          id={interest}
                          checked={formData.interests.includes(interest)}
                          onCheckedChange={() => handleInterestToggle(interest)}
                        />
                        <Label htmlFor={interest} className="text-sm">
                          {interest}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <Label htmlFor="goals">Career Goals & Aspirations</Label>
                  <Textarea
                    id="goals"
                    value={formData.goals}
                    onChange={(e) => setFormData((prev) => ({ ...prev, goals: e.target.value }))}
                    placeholder="Describe your career goals and what you hope to achieve..."
                    rows={4}
                  />
                </div>
              </>
            )}

            {currentStep === 3 && (
              <>
                <div>
                  <Label htmlFor="learningStyle">Preferred Learning Style</Label>
                  <Select
                    value={formData.learningStyle}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, learningStyle: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="How do you learn best?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="visual">Visual (videos, diagrams, infographics)</SelectItem>
                      <SelectItem value="reading">Reading (articles, books, text-based)</SelectItem>
                      <SelectItem value="interactive">Interactive (quizzes, hands-on activities)</SelectItem>
                      <SelectItem value="audio">Audio (podcasts, lectures)</SelectItem>
                      <SelectItem value="mixed">Mixed approach</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="timeCommitment">Time Commitment</Label>
                  <Select
                    value={formData.timeCommitment}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, timeCommitment: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="How much time can you dedicate?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1-2 hours">1-2 hours per week</SelectItem>
                      <SelectItem value="3-5 hours">3-5 hours per week</SelectItem>
                      <SelectItem value="6-10 hours">6-10 hours per week</SelectItem>
                      <SelectItem value="10+ hours">More than 10 hours per week</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Preferred Languages</Label>
                  <div className="grid grid-cols-2 gap-3 mt-2">
                    {["English", "Hindi", "Tamil", "Telugu", "Bengali", "Marathi", "Gujarati", "Kannada"].map(
                      (language) => (
                        <div key={language} className="flex items-center space-x-2">
                          <Checkbox
                            id={language}
                            checked={formData.languages.includes(language)}
                            onCheckedChange={() => handleLanguageToggle(language)}
                          />
                          <Label htmlFor={language} className="text-sm">
                            {language}
                          </Label>
                        </div>
                      ),
                    )}
                  </div>
                </div>
              </>
            )}

            <div className="flex justify-between pt-6">
              <Button variant="outline" onClick={handlePrevious} disabled={currentStep === 0}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>
              <Button onClick={handleNext}>
                {currentStep === steps.length - 1 ? "Complete Setup" : "Next"}
                {currentStep < steps.length - 1 && <ArrowRight className="w-4 h-4 ml-2" />}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
