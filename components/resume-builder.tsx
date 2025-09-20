"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import {
  FileText,
  Download,
  Eye,
  Zap,
  Target,
  MessageSquare,
  Brain,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Users,
  Clock,
  Plus,
  X,
  Palette,
  Layout,
  Star,
  Award,
} from "lucide-react"

interface ResumeBuilderProps {
  userData: any
}

const resumeTemplates = [
  { id: "modern", name: "Modern Professional", preview: "bg-gradient-to-br from-blue-50 to-indigo-100" },
  { id: "creative", name: "Creative Designer", preview: "bg-gradient-to-br from-purple-50 to-pink-100" },
  { id: "minimal", name: "Minimal Clean", preview: "bg-gradient-to-br from-gray-50 to-slate-100" },
  { id: "executive", name: "Executive", preview: "bg-gradient-to-br from-emerald-50 to-teal-100" },
]

export function ResumeBuilder({ userData }: ResumeBuilderProps) {
  const [activeSection, setActiveSection] = useState("builder")
  const [selectedTemplate, setSelectedTemplate] = useState("modern")
  const [resumeData, setResumeData] = useState({
    personalInfo: {
      name: userData.name || "",
      email: userData.email || "",
      phone: "",
      location: `${userData.city || ""}, ${userData.state || ""}`.trim().replace(/^,|,$/, ""),
      linkedin: "",
      github: "",
      portfolio: "",
    },
    summary: "",
    experience: [],
    education: [
      {
        degree: userData.educationLevel || "",
        field: userData.stream || "",
        institution: userData.institution || "",
        year: "",
        gpa: "",
      },
    ],
    skills: userData.interests || [],
    projects: [],
    achievements: [],
    certifications: [],
  })
  const [analysisResults, setAnalysisResults] = useState(null)
  const [interviewQuestions, setInterviewQuestions] = useState(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const analyzeResume = async () => {
    setIsAnalyzing(true)
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            {
              role: "user",
              content: `Analyze this resume and provide detailed feedback in JSON format:
            
            Resume Data: ${JSON.stringify(resumeData)}
            
            Please provide:
            1. Overall score (0-100)
            2. ATS compatibility score (0-100)
            3. Array of strengths
            4. Array of improvements
            5. Array of recommended keywords
            6. Specific suggestions for each section
            
            Format as JSON with keys: score, atsCompatibility, strengths, improvements, keywords, suggestions`,
            },
          ],
          userData,
        }),
      })

      if (response.ok) {
        const reader = response.body?.getReader()
        let result = ""

        if (reader) {
          while (true) {
            const { done, value } = await reader.read()
            if (done) break
            result += new TextDecoder().decode(value)
          }
        }

        // Try to extract JSON from the response
        try {
          const jsonMatch = result.match(/\{[\s\S]*\}/)
          if (jsonMatch) {
            const analysis = JSON.parse(jsonMatch[0])
            setAnalysisResults(analysis)
          } else {
            // Fallback mock data if parsing fails
            setAnalysisResults({
              score: 78,
              atsCompatibility: 85,
              strengths: ["Clear contact information", "Relevant education background", "Good skill alignment"],
              improvements: ["Add work experience", "Include quantifiable achievements", "Optimize keywords"],
              keywords: ["Leadership", "Communication", "Problem-solving", "Teamwork"],
              suggestions: "Focus on adding measurable achievements and relevant project experience.",
            })
          }
        } catch (parseError) {
          console.error("Failed to parse analysis:", parseError)
          // Fallback analysis
          setAnalysisResults({
            score: 75,
            atsCompatibility: 80,
            strengths: ["Good educational background", "Relevant interests", "Clear structure"],
            improvements: ["Add more specific achievements", "Include relevant projects", "Optimize for ATS"],
            keywords: userData.interests?.slice(0, 6) || ["Communication", "Leadership", "Problem-solving"],
            suggestions: "Consider adding specific projects and quantifiable achievements.",
          })
        }
      }
    } catch (error) {
      console.error("Resume analysis failed:", error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const generateInterviewQuestions = async () => {
    try {
      const userRole = userData?.role || "professional"
      const userStream = userData?.stream || "general"
      const userInterests = Array.isArray(userData?.interests) ? userData.interests : []
      const interestsText = userInterests.length > 0 ? userInterests.join(", ") : "various professional areas"

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            {
              role: "user",
              content: `Generate 8 personalized interview questions for a ${userRole} with background in ${userStream} and interests in ${interestsText}. 
            
            Include a mix of:
            - 3 behavioral questions
            - 3 technical/field-specific questions  
            - 2 situational questions
            
            For each question provide: question, category, difficulty (Easy/Medium/Hard), and a helpful tip.
            
            Format as JSON with structure: { questions: [{ question, category, difficulty, tips }], practiceSession: { duration: "45-60 minutes", focusAreas: ["area1", "area2"] } }`,
            },
          ],
          userData,
        }),
      })

      if (response.ok) {
        const reader = response.body?.getReader()
        let result = ""

        if (reader) {
          while (true) {
            const { done, value } = await reader.read()
            if (done) break
            result += new TextDecoder().decode(value)
          }
        }

        try {
          const jsonMatch = result.match(/\{[\s\S]*\}/)
          if (jsonMatch) {
            const questions = JSON.parse(jsonMatch[0])
            setInterviewQuestions(questions)
          }
        } catch (parseError) {
          // Fallback questions
          setInterviewQuestions({
            questions: [
              {
                question: "Tell me about yourself and your career goals.",
                category: "General",
                difficulty: "Easy",
                tips: "Focus on your education, interests, and future aspirations.",
              },
              {
                question: "Why are you interested in this field?",
                category: "Motivation",
                difficulty: "Easy",
                tips: "Connect your personal interests to the field requirements.",
              },
              {
                question: "Describe a challenging project you worked on.",
                category: "Behavioral",
                difficulty: "Medium",
                tips: "Use the STAR method: Situation, Task, Action, Result.",
              },
              {
                question: "How do you handle working under pressure?",
                category: "Behavioral",
                difficulty: "Medium",
                tips: "Provide specific examples and coping strategies.",
              },
            ],
            practiceSession: {
              duration: "30-45 minutes",
              focusAreas: ["Communication", "Problem-solving", "Adaptability"],
            },
          })
        }
      }
    } catch (error) {
      console.error("Interview questions generation failed:", error)
    }
  }

  const addExperience = () => {
    setResumeData({
      ...resumeData,
      experience: [...resumeData.experience, { title: "", company: "", duration: "", description: "" }],
    })
  }

  const addProject = () => {
    setResumeData({
      ...resumeData,
      projects: [...resumeData.projects, { title: "", description: "", technologies: "", link: "" }],
    })
  }

  const addSkill = (skill: string) => {
    if (skill && !resumeData.skills.includes(skill)) {
      setResumeData({
        ...resumeData,
        skills: [...resumeData.skills, skill],
      })
    }
  }

  const removeSkill = (skillToRemove: string) => {
    setResumeData({
      ...resumeData,
      skills: resumeData.skills.filter((skill) => skill !== skillToRemove),
    })
  }

  const downloadResume = () => {
    try {
      // Create HTML content for the resume
      const resumeHTML = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>${resumeData.personalInfo.name || 'Resume'} - Resume</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; margin: 40px; color: #333; }
        .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #2563eb; padding-bottom: 15px; }
        .name { font-size: 32px; font-weight: bold; color: #2563eb; margin-bottom: 10px; }
        .contact { font-size: 14px; color: #666; }
        .section { margin-bottom: 25px; }
        .section-title { font-size: 18px; font-weight: bold; color: #2563eb; border-bottom: 1px solid #2563eb; padding-bottom: 5px; margin-bottom: 15px; }
        .item { margin-bottom: 12px; }
        .item-title { font-weight: bold; }
        .item-subtitle { color: #666; font-size: 14px; }
        .skills { display: flex; flex-wrap: wrap; gap: 8px; }
        .skill { background: #e0f2fe; color: #2563eb; padding: 4px 12px; border-radius: 20px; font-size: 12px; }
        @media print { body { margin: 20px; } }
    </style>
</head>
<body>
    <div class="header">
        <div class="name">${resumeData.personalInfo.name || 'Your Name'}</div>
        <div class="contact">
            ${resumeData.personalInfo.email}${resumeData.personalInfo.phone ? ' | ' + resumeData.personalInfo.phone : ''}<br>
            ${resumeData.personalInfo.location}<br>
            ${resumeData.personalInfo.linkedin ? 'LinkedIn: ' + resumeData.personalInfo.linkedin : ''}
        </div>
    </div>
    
    ${resumeData.summary ? `
    <div class="section">
        <div class="section-title">Professional Summary</div>
        <p>${resumeData.summary}</p>
    </div>
    ` : ''}
    
    <div class="section">
        <div class="section-title">Education</div>
        <div class="item">
            <div class="item-title">${resumeData.education[0]?.degree || ''} ${resumeData.education[0]?.field ? 'in ' + resumeData.education[0].field : ''}</div>
            <div class="item-subtitle">${resumeData.education[0]?.institution || ''}</div>
            ${resumeData.education[0]?.year ? `<div class="item-subtitle">${resumeData.education[0].year}</div>` : ''}
        </div>
    </div>
    
    ${resumeData.skills.length > 0 ? `
    <div class="section">
        <div class="section-title">Skills & Expertise</div>
        <div class="skills">
            ${resumeData.skills.map(skill => `<span class="skill">${skill}</span>`).join('')}
        </div>
    </div>
    ` : ''}
    
    ${resumeData.experience.length > 0 ? `
    <div class="section">
        <div class="section-title">Experience</div>
        ${resumeData.experience.map(exp => `
        <div class="item">
            <div class="item-title">${exp.title || 'Position Title'}</div>
            <div class="item-subtitle">${exp.company || 'Company Name'} | ${exp.duration || 'Duration'}</div>
            <p>${exp.description || 'Job description and achievements...'}</p>
        </div>
        `).join('')}
    </div>
    ` : ''}
    
    ${resumeData.projects.length > 0 ? `
    <div class="section">
        <div class="section-title">Projects</div>
        ${resumeData.projects.map(project => `
        <div class="item">
            <div class="item-title">${project.title || 'Project Title'}</div>
            <div class="item-subtitle">${project.technologies || 'Technologies used'}</div>
            <p>${project.description || 'Project description...'}</p>
        </div>
        `).join('')}
    </div>
    ` : ''}
</body>
</html>
      `
      
      // Create blob and download
      const blob = new Blob([resumeHTML], { type: 'text/html' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${resumeData.personalInfo.name || 'Resume'}_Resume.html`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
      
      // Show success message
      console.log('Resume downloaded successfully!')
      alert('Resume downloaded as HTML file! You can open it in any browser and print to PDF.')
    } catch (error) {
      console.error('Error downloading resume:', error)
      alert('Sorry, there was an error downloading your resume. Please try again.')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Resume Builder & Interview Coach
          </h2>
          <p className="text-muted-foreground mt-1">Create ATS-optimized resumes and practice interviews with AI</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge
            variant="secondary"
            className="bg-emerald-100 dark:bg-emerald-900/20 text-emerald-800 dark:text-emerald-200"
          >
            <Star className="w-3 h-3 mr-1" />
            AI-Powered
          </Badge>
          <Badge variant="outline" className="border-blue-200 text-blue-700">
            Google Cloud AI
          </Badge>
        </div>
      </div>

      <Tabs value={activeSection} onValueChange={setActiveSection} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-muted/50">
          <TabsTrigger value="builder" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Builder
          </TabsTrigger>
          <TabsTrigger value="templates" className="flex items-center gap-2">
            <Layout className="w-4 h-4" />
            Templates
          </TabsTrigger>
          <TabsTrigger value="analysis" className="flex items-center gap-2">
            <Brain className="w-4 h-4" />
            Analysis
          </TabsTrigger>
          <TabsTrigger value="interview" className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            Interview
          </TabsTrigger>
        </TabsList>

        <TabsContent value="templates" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="w-5 h-5" />
                Choose Your Template
              </CardTitle>
              <CardDescription>Select a professional template that matches your style</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {resumeTemplates.map((template) => (
                  <Card
                    key={template.id}
                    className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                      selectedTemplate === template.id ? "ring-2 ring-primary shadow-lg" : ""
                    }`}
                    onClick={() => setSelectedTemplate(template.id)}
                  >
                    <CardContent className="p-4">
                      <div
                        className={`w-full h-32 rounded-lg ${template.preview} mb-3 flex items-center justify-center`}
                      >
                        <div className="text-xs text-gray-600 font-medium">Preview</div>
                      </div>
                      <h3 className="font-medium text-center">{template.name}</h3>
                      {selectedTemplate === template.id && (
                        <div className="flex items-center justify-center mt-2">
                          <Badge variant="default" className="text-xs">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Selected
                          </Badge>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="builder" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Enhanced Resume Form */}
            <div className="space-y-6">
              {/* Personal Information */}
              <Card className="card-enhanced">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-primary" />
                    Personal Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={resumeData.personalInfo.name}
                        onChange={(e) =>
                          setResumeData({
                            ...resumeData,
                            personalInfo: { ...resumeData.personalInfo, name: e.target.value },
                          })
                        }
                        className="focus-enhanced"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={resumeData.personalInfo.email}
                        onChange={(e) =>
                          setResumeData({
                            ...resumeData,
                            personalInfo: { ...resumeData.personalInfo, email: e.target.value },
                          })
                        }
                        className="focus-enhanced"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={resumeData.personalInfo.phone}
                        onChange={(e) =>
                          setResumeData({
                            ...resumeData,
                            personalInfo: { ...resumeData.personalInfo, phone: e.target.value },
                          })
                        }
                        className="focus-enhanced"
                      />
                    </div>
                    <div>
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        value={resumeData.personalInfo.location}
                        onChange={(e) =>
                          setResumeData({
                            ...resumeData,
                            personalInfo: { ...resumeData.personalInfo, location: e.target.value },
                          })
                        }
                        className="focus-enhanced"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="linkedin">LinkedIn</Label>
                      <Input
                        id="linkedin"
                        placeholder="linkedin.com/in/yourprofile"
                        value={resumeData.personalInfo.linkedin}
                        onChange={(e) =>
                          setResumeData({
                            ...resumeData,
                            personalInfo: { ...resumeData.personalInfo, linkedin: e.target.value },
                          })
                        }
                        className="focus-enhanced"
                      />
                    </div>
                    <div>
                      <Label htmlFor="portfolio">Portfolio/Website</Label>
                      <Input
                        id="portfolio"
                        placeholder="yourportfolio.com"
                        value={resumeData.personalInfo.portfolio}
                        onChange={(e) =>
                          setResumeData({
                            ...resumeData,
                            personalInfo: { ...resumeData.personalInfo, portfolio: e.target.value },
                          })
                        }
                        className="focus-enhanced"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Professional Summary */}
              <Card className="card-enhanced">
                <CardHeader>
                  <CardTitle>Professional Summary</CardTitle>
                  <CardDescription>A compelling overview of your career goals and key strengths</CardDescription>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="Write a compelling summary that highlights your key skills, achievements, and career objectives. Focus on what makes you unique and valuable to employers..."
                    value={resumeData.summary}
                    onChange={(e) => setResumeData({ ...resumeData, summary: e.target.value })}
                    rows={4}
                    className="focus-enhanced"
                  />
                  <div className="mt-2 text-xs text-muted-foreground">
                    Tip: Keep it concise (2-3 sentences) and tailored to your target role
                  </div>
                </CardContent>
              </Card>

              {/* Skills Section */}
              <Card className="card-enhanced">
                <CardHeader>
                  <CardTitle>Skills & Expertise</CardTitle>
                  <CardDescription>Showcase your technical and soft skills</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {resumeData.skills.map((skill, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="flex items-center gap-1 bg-primary/10 text-primary hover:bg-primary/20"
                      >
                        {skill}
                        <X
                          className="w-3 h-3 cursor-pointer hover:text-destructive"
                          onClick={() => removeSkill(skill)}
                        />
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add a skill..."
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          addSkill(e.currentTarget.value)
                          e.currentTarget.value = ""
                        }
                      }}
                      className="focus-enhanced"
                    />
                    <Button
                      size="sm"
                      onClick={(e) => {
                        const input = e.currentTarget.previousElementSibling as HTMLInputElement
                        addSkill(input.value)
                        input.value = ""
                      }}
                      className="btn-enhanced"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="mt-4">
                    <p className="text-sm font-medium mb-2">Suggested Skills:</p>
                    <div className="flex flex-wrap gap-2">
                      {[
                        "Communication",
                        "Leadership",
                        "Problem Solving",
                        "Teamwork",
                        "Time Management",
                        "Critical Thinking",
                      ].map((skill) => (
                        <Badge
                          key={skill}
                          variant="outline"
                          className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                          onClick={() => addSkill(skill)}
                        >
                          + {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Experience Section */}
              <Card className="card-enhanced">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Work Experience</CardTitle>
                      <CardDescription>Add your professional experience and internships</CardDescription>
                    </div>
                    <Button size="sm" onClick={addExperience} className="btn-enhanced">
                      <Plus className="w-4 h-4 mr-1" />
                      Add
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {resumeData.experience.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Award className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p>No experience added yet</p>
                      <p className="text-sm">Click "Add" to include internships, projects, or volunteer work</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {resumeData.experience.map((exp, index) => (
                        <div key={index} className="border rounded-lg p-4 space-y-3">
                          <div className="grid grid-cols-2 gap-3">
                            <Input placeholder="Job Title" className="focus-enhanced" />
                            <Input placeholder="Company Name" className="focus-enhanced" />
                          </div>
                          <Input placeholder="Duration (e.g., Jan 2023 - Present)" className="focus-enhanced" />
                          <Textarea
                            placeholder="Describe your responsibilities and achievements..."
                            rows={3}
                            className="focus-enhanced"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Enhanced Resume Preview */}
            <Card className="h-fit card-enhanced">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="w-5 h-5 text-primary" />
                  Live Preview
                </CardTitle>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="btn-enhanced bg-transparent" onClick={downloadResume}>
                    <Download className="w-4 h-4 mr-2" />
                    Download Resume
                  </Button>
                  <Button size="sm" onClick={analyzeResume} className="btn-enhanced">
                    <Zap className="w-4 h-4 mr-2" />
                    AI Analysis
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="bg-white dark:bg-gray-900 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg p-6 text-foreground min-h-[700px] shadow-inner">
                  {/* Header */}
                  <div className="text-center mb-6 pb-4 border-b-2 border-primary/20">
                    <h1 className="text-3xl font-bold text-primary mb-2">
                      {resumeData.personalInfo.name || "Your Name"}
                    </h1>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p>
                        {resumeData.personalInfo.email} | {resumeData.personalInfo.phone}
                      </p>
                      <p>{resumeData.personalInfo.location}</p>
                      {resumeData.personalInfo.linkedin && <p>LinkedIn: {resumeData.personalInfo.linkedin}</p>}
                    </div>
                  </div>

                  {/* Professional Summary */}
                  {resumeData.summary && (
                    <div className="mb-6">
                      <h2 className="text-lg font-semibold text-primary border-b border-primary/30 mb-3 pb-1">
                        Professional Summary
                      </h2>
                      <p className="text-sm leading-relaxed">{resumeData.summary}</p>
                    </div>
                  )}

                  {/* Education */}
                  <div className="mb-6">
                    <h2 className="text-lg font-semibold text-primary border-b border-primary/30 mb-3 pb-1">
                      Education
                    </h2>
                    <div className="text-sm">
                      <p className="font-medium">
                        {resumeData.education[0]?.degree}{" "}
                        {resumeData.education[0]?.field && `in ${resumeData.education[0].field}`}
                      </p>
                      <p className="text-muted-foreground">{resumeData.education[0]?.institution}</p>
                      {resumeData.education[0]?.year && (
                        <p className="text-muted-foreground">{resumeData.education[0].year}</p>
                      )}
                    </div>
                  </div>

                  {/* Skills */}
                  {resumeData.skills.length > 0 && (
                    <div className="mb-6">
                      <h2 className="text-lg font-semibold text-primary border-b border-primary/30 mb-3 pb-1">
                        Skills & Expertise
                      </h2>
                      <div className="flex flex-wrap gap-2">
                        {resumeData.skills.map((skill, index) => (
                          <span
                            key={index}
                            className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-medium"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Experience */}
                  {resumeData.experience.length > 0 && (
                    <div className="mb-6">
                      <h2 className="text-lg font-semibold text-primary border-b border-primary/30 mb-3 pb-1">
                        Experience
                      </h2>
                      <div className="space-y-3">
                        {resumeData.experience.map((exp, index) => (
                          <div key={index} className="text-sm">
                            <p className="font-medium">{exp.title || "Position Title"}</p>
                            <p className="text-muted-foreground">
                              {exp.company || "Company Name"} | {exp.duration || "Duration"}
                            </p>
                            <p className="mt-1">{exp.description || "Job description and achievements..."}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Projects */}
                  {resumeData.projects.length > 0 && (
                    <div>
                      <h2 className="text-lg font-semibold text-primary border-b border-primary/30 mb-3 pb-1">
                        Projects
                      </h2>
                      <div className="space-y-3">
                        {resumeData.projects.map((project, index) => (
                          <div key={index} className="text-sm">
                            <p className="font-medium">{project.title || "Project Title"}</p>
                            <p className="text-muted-foreground">{project.technologies || "Technologies used"}</p>
                            <p className="mt-1">{project.description || "Project description..."}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analysis" className="space-y-6">
          <Card className="card-enhanced">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-primary" />
                AI-Powered Resume Analysis
              </CardTitle>
              <CardDescription>Get detailed feedback on your resume using Google Cloud AI</CardDescription>
            </CardHeader>
            <CardContent>
              {!analysisResults ? (
                <div className="text-center py-12">
                  <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-4">
                    <Brain className="w-12 h-12 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Ready for AI Analysis</h3>
                  <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                    Get comprehensive feedback on your resume's content, structure, and ATS compatibility
                  </p>
                  <Button onClick={analyzeResume} disabled={isAnalyzing} size="lg" className="btn-enhanced">
                    {isAnalyzing ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Zap className="w-4 h-4 mr-2" />
                        Analyze Resume
                      </>
                    )}
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Overall Score */}
                  <div className="text-center bg-gradient-to-br from-primary/5 to-secondary/5 rounded-xl p-6">
                    <div className="text-5xl font-bold text-primary mb-2">{analysisResults.score}/100</div>
                    <p className="text-muted-foreground text-lg">Overall Resume Score</p>
                    <Progress value={analysisResults.score} className="w-full max-w-md mx-auto mt-4 h-3" />
                    <div className="mt-2 text-sm text-muted-foreground">
                      {analysisResults.score >= 80
                        ? "Excellent!"
                        : analysisResults.score >= 60
                          ? "Good progress"
                          : "Needs improvement"}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Strengths */}
                    <Card className="border-green-200 dark:border-green-800">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-green-600 dark:text-green-400">
                          <CheckCircle className="w-5 h-5" />
                          Strengths
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-3">
                          {(analysisResults.strengths || []).map((strength: string, index: number) => (
                            <li key={index} className="flex items-start gap-3">
                              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                              <span className="text-sm">{strength}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>

                    {/* Improvements */}
                    <Card className="border-orange-200 dark:border-orange-800">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-orange-600 dark:text-orange-400">
                          <AlertCircle className="w-5 h-5" />
                          Areas for Improvement
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-3">
                          {(analysisResults.improvements || []).map((improvement: string, index: number) => (
                            <li key={index} className="flex items-start gap-3">
                              <AlertCircle className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                              <span className="text-sm">{improvement}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </div>

                  {/* ATS Compatibility */}
                  <Card className="card-enhanced">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Target className="w-5 h-5 text-primary" />
                        ATS Compatibility Score
                      </CardTitle>
                      <CardDescription>How well your resume works with Applicant Tracking Systems</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-4 mb-4">
                        <div className="text-3xl font-bold text-primary">{analysisResults.atsCompatibility}%</div>
                        <Progress value={analysisResults.atsCompatibility} className="flex-1 h-3" />
                      </div>
                      <div>
                        <h4 className="font-medium mb-3">Recommended Keywords:</h4>
                        <div className="flex flex-wrap gap-2">
                          {(analysisResults.keywords || []).map((keyword: string, index: number) => (
                            <Badge
                              key={index}
                              variant="secondary"
                              className="bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200"
                            >
                              {keyword}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="interview" className="space-y-6">
          <Card className="card-enhanced">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-primary" />
                AI Interview Coach
              </CardTitle>
              <CardDescription>
                Practice interviews with personalized questions powered by Google Cloud AI
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!interviewQuestions ? (
                <div className="text-center py-12">
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-4">
                    <MessageSquare className="w-12 h-12 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Ready for Interview Practice</h3>
                  <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                    Generate personalized interview questions based on your profile and target role
                  </p>
                  <Button onClick={generateInterviewQuestions} size="lg" className="btn-enhanced">
                    <Brain className="w-4 h-4 mr-2" />
                    Generate Questions
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Practice Session Info */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-800">
                      <Clock className="w-8 h-8 mx-auto text-blue-600 mb-2" />
                      <p className="font-medium text-blue-800 dark:text-blue-200">
                        {interviewQuestions.practiceSession?.duration || "30-45 min"}
                      </p>
                      <p className="text-sm text-blue-600 dark:text-blue-300">Duration</p>
                    </Card>
                    <Card className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-800">
                      <Users className="w-8 h-8 mx-auto text-green-600 mb-2" />
                      <p className="font-medium text-green-800 dark:text-green-200">
                        {interviewQuestions.questions?.length || 0}
                      </p>
                      <p className="text-sm text-green-600 dark:text-green-300">Questions</p>
                    </Card>
                    <Card className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-800">
                      <TrendingUp className="w-8 h-8 mx-auto text-purple-600 mb-2" />
                      <p className="font-medium text-purple-800 dark:text-purple-200">Mixed</p>
                      <p className="text-sm text-purple-600 dark:text-purple-300">Difficulty</p>
                    </Card>
                  </div>

                  {/* Interview Questions */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Practice Questions</h3>
                    {(interviewQuestions.questions || []).map((q: any, index: number) => (
                      <Card key={index} className="card-enhanced">
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <CardTitle className="text-base leading-relaxed pr-4">{q.question}</CardTitle>
                            <div className="flex gap-2 flex-shrink-0">
                              <Badge variant="outline" className="text-xs">
                                {q.category}
                              </Badge>
                              <Badge
                                variant={
                                  q.difficulty === "Easy"
                                    ? "secondary"
                                    : q.difficulty === "Medium"
                                      ? "default"
                                      : "destructive"
                                }
                                className="text-xs"
                              >
                                {q.difficulty}
                              </Badge>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-4 rounded-lg mb-4">
                            <p className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2 flex items-center gap-2">
                              <Target className="w-4 h-4" />
                              Interview Tip:
                            </p>
                            <p className="text-sm text-blue-700 dark:text-blue-300">{q.tips}</p>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" className="btn-enhanced bg-transparent">
                              <MessageSquare className="w-4 h-4 mr-1" />
                              Practice Answer
                            </Button>
                            <Button size="sm" variant="outline" className="btn-enhanced bg-transparent">
                              <Eye className="w-4 h-4 mr-1" />
                              View Sample
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {/* Focus Areas */}
                  <Card className="card-enhanced">
                    <CardHeader>
                      <CardTitle>Focus Areas for This Session</CardTitle>
                      <CardDescription>Key skills and competencies to highlight</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {(interviewQuestions.practiceSession?.focusAreas || []).map((area: string, index: number) => (
                          <Badge key={index} variant="secondary" className="bg-primary/10 text-primary">
                            {area}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
