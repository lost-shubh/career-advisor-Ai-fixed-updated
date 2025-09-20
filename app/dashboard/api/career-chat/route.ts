import { google } from "@ai-sdk/google"
import { convertToModelMessages, streamText, type UIMessage, tool } from "ai"
import { z } from "zod"

export const maxDuration = 30

const careerAnalysisTool = tool({
  description: "Analyze career compatibility and provide personalized recommendations",
  inputSchema: z.object({
    userProfile: z.object({
      skills: z.array(z.string()),
      interests: z.array(z.string()),
      experience: z.string(),
      education: z.string(),
      careerGoals: z.string(),
    }),
    targetRole: z.string().optional(),
  }),
  execute: async ({ userProfile, targetRole }) => {
    // Simulate career analysis logic
    const compatibilityScore = Math.floor(Math.random() * 40) + 60 // 60-100%
    const recommendations = [
      "Focus on developing technical skills in your area of interest",
      "Consider gaining experience through internships or projects",
      "Network with professionals in your target industry",
      "Pursue relevant certifications to strengthen your profile",
    ]

    return {
      compatibilityScore,
      recommendations,
      suggestedRoles: ["Software Engineer", "Data Analyst", "Product Manager"],
      skillGaps: ["Advanced Programming", "Project Management", "Communication"],
      nextSteps: [
        "Complete online courses in identified skill gaps",
        "Build a portfolio showcasing your abilities",
        "Apply for entry-level positions or internships",
      ],
    }
  },
})

const jobMatchingTool = tool({
  description: "Find job matches based on user profile and preferences",
  inputSchema: z.object({
    skills: z.array(z.string()),
    location: z.string().optional(),
    experienceLevel: z.enum(["entry", "mid", "senior"]),
    industry: z.string().optional(),
  }),
  execute: async ({ skills, location, experienceLevel, industry }) => {
    // Simulate job matching
    const mockJobs = [
      {
        title: "Junior Software Developer",
        company: "TechCorp Inc.",
        location: location || "Remote",
        matchScore: 85,
        requirements: skills.slice(0, 3),
        salary: "$60,000 - $80,000",
      },
      {
        title: "Data Analyst",
        company: "DataFlow Solutions",
        location: location || "New York, NY",
        matchScore: 78,
        requirements: ["Data Analysis", "SQL", "Python"],
        salary: "$55,000 - $75,000",
      },
    ]

    return {
      matches: mockJobs,
      totalFound: mockJobs.length,
      searchCriteria: { skills, location, experienceLevel, industry },
    }
  },
})

const skillAssessmentTool = tool({
  description: "Assess user skills and provide improvement suggestions",
  inputSchema: z.object({
    skillName: z.string(),
    currentLevel: z.enum(["beginner", "intermediate", "advanced"]),
    targetLevel: z.enum(["intermediate", "advanced", "expert"]),
  }),
  execute: async ({ skillName, currentLevel, targetLevel }) => {
    const learningPath = [
      "Complete foundational courses",
      "Practice with real-world projects",
      "Seek mentorship or guidance",
      "Take advanced certifications",
    ]

    return {
      skill: skillName,
      currentLevel,
      targetLevel,
      estimatedTimeToTarget: "3-6 months",
      learningPath,
      recommendedResources: [
        "Online courses (Coursera, Udemy)",
        "Practice platforms (LeetCode, Kaggle)",
        "Professional communities",
        "Industry certifications",
      ],
    }
  },
})

const tools = {
  careerAnalysis: careerAnalysisTool,
  jobMatching: jobMatchingTool,
  skillAssessment: skillAssessmentTool,
}

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json()

  const systemPrompt = `You are CareerBot, an AI career advisor specializing in personalized career guidance. You help users with:

1. Career path recommendations based on skills and interests
2. Job matching and opportunity identification  
3. Skill gap analysis and development planning
4. Interview preparation and resume optimization
5. Industry insights and market trends

Guidelines:
- Be encouraging and supportive while providing realistic advice
- Ask clarifying questions to better understand user needs
- Provide specific, actionable recommendations
- Use the available tools to give data-driven insights
- Keep responses conversational and easy to understand
- Focus on practical next steps the user can take

When users ask about career advice, job searching, or skill development, use the appropriate tools to provide comprehensive analysis.`

  const result = streamText({
    model: google("gemini-1.5-flash"),
    messages: [{ role: "system", content: systemPrompt }, ...convertToModelMessages(messages)],
    tools,
    maxSteps: 3,
    abortSignal: req.signal,
  })

  return result.toUIMessageStreamResponse({
    onFinish: async ({ isAborted }) => {
      if (isAborted) {
        console.log("Career chat aborted")
      }
    },
  })
}
