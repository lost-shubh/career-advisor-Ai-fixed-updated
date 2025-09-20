import { openai } from "@ai-sdk/openai"
import { convertToModelMessages, streamText, tool, type UIMessage } from "ai"
import { z } from "zod"
// import { createClient } from "@/lib/supabase/server"

export const maxDuration = 30

// Mock response generator for when no API keys are available
function generateMockCareerResponse(userMessage: string): string {
  const message = userMessage.toLowerCase()
  
  if (message.includes('career') || message.includes('job') || message.includes('recommendation')) {
    return `🎯 **Career Recommendations**

Based on your interests, here are some excellent career paths to consider:

**Technology Careers:**
• Software Developer - Build applications and systems (Growth: +15%)
• Data Scientist - Analyze data for business insights (Growth: +22%)
• UX/UI Designer - Create user-friendly interfaces (Growth: +18%)

**Business Careers:**
• Digital Marketing Manager - Drive online growth (Growth: +12%)
• Business Analyst - Bridge business and tech needs (Growth: +10%)
• Product Manager - Lead product development (Growth: +14%)

**Next Steps:**
1. Assess your current skills and interests
2. Research specific roles that align with your goals
3. Start building relevant skills through online courses
4. Network with professionals in your target field

What specific area interests you most?`
  }
  
  if (message.includes('video') || message.includes('lecture') || message.includes('course')) {
    return `📹 **Video Learning Resources**

Here are recommended video lectures based on your stream:

**Programming & Technology:**
• "Full Stack Web Development" - 16 weeks, 120+ hours
• "Data Science Fundamentals" - 12 weeks, 80+ hours
• "Python Programming Masterclass" - 8 weeks, 60+ hours

**Business & Management:**
• "Digital Marketing Mastery" - 8 weeks, 60+ case studies
• "Business Analytics" - 10 weeks, practical projects
• "Leadership & Management" - 6 weeks, real scenarios

**Skills Development:**
• Communication & Presentation
• Project Management
• Critical Thinking & Problem Solving

Which subject area would you like to explore further?`
  }
  
  if (message.includes('skill') || message.includes('assess') || message.includes('improve')) {
    return `📊 **Skill Assessment & Development**

**Core Skills to Develop:**
• Technical Skills - Programming, data analysis, digital tools
• Soft Skills - Communication, leadership, teamwork
• Industry Knowledge - Market trends, best practices
• Problem Solving - Critical thinking, analytical skills

**Learning Path Recommendations:**
1. **Assessment Phase** - Identify current skill levels
2. **Learning Phase** - Take courses, practice projects
3. **Application Phase** - Real-world projects, internships
4. **Growth Phase** - Advanced skills, mentorship

**Recommended Platforms:**
• Coursera, Udemy, Skillshare for courses
• GitHub for project portfolios
• LinkedIn Learning for professional skills
• Kaggle for data science practice

What specific skill would you like to focus on first?`
  }
  
  // Default welcome response
  return `👋 Hello! I'm your AI Career Advisor.

**I can help you with:**
• 🎯 Career exploration and recommendations
• 📹 Video lectures and learning resources  
• 📊 Skill assessment and development plans
• 💼 Job search strategies and interview prep
• 📄 Resume building and optimization
• 🔮 Industry insights and market trends

**Popular topics to explore:**
• "Show me career recommendations"
• "What video lectures do you recommend?"
• "How can I improve my skills?"
• "Help me with interview preparation"

What would you like to explore today?`
}

const deepseekAI = openai({
  apiKey: process.env.DEEPSEEK_API_KEY || process.env.OPENAI_API_KEY,
  baseURL: "https://api.deepseek.com/v1",
})

const careerRecommendationTool = tool({
  description: "Get personalized career recommendations based on user profile and interests",
  inputSchema: z.object({
    interests: z.array(z.string()).describe("User interests and skills"),
    academicLevel: z.string().describe("Current academic level"),
    stream: z.string().optional().describe("Academic stream if applicable"),
  }),
  async execute({ interests, academicLevel, stream }) {
    // Simulate career recommendation logic
    const careers = [
      { title: "Software Developer", match: 92, growth: "+15%", description: "Build applications and systems" },
      { title: "Data Scientist", match: 88, growth: "+22%", description: "Analyze data to drive decisions" },
      { title: "UX Designer", match: 85, growth: "+18%", description: "Design user experiences" },
      {
        title: "Digital Marketing Manager",
        match: 82,
        growth: "+12%",
        description: "Manage online marketing campaigns",
      },
      { title: "Business Analyst", match: 78, growth: "+10%", description: "Analyze business processes" },
    ]

    return {
      recommendations: careers.slice(0, 3),
      message: `Based on your interests in ${interests.join(", ")} and ${academicLevel} level, here are your top career matches:`,
    }
  },
})

const skillAssessmentTool = tool({
  description: "Assess user skills and provide improvement suggestions",
  inputSchema: z.object({
    skillArea: z.string().describe("The skill area to assess"),
    currentLevel: z.enum(["beginner", "intermediate", "advanced"]).describe("Current skill level"),
  }),
  async execute({ skillArea, currentLevel }) {
    const suggestions = {
      beginner: ["Take online courses", "Practice with tutorials", "Join beginner communities"],
      intermediate: ["Work on projects", "Contribute to open source", "Find a mentor"],
      advanced: ["Lead projects", "Mentor others", "Speak at conferences"],
    }

    return {
      currentLevel,
      suggestions: suggestions[currentLevel],
      nextSteps: `To improve your ${skillArea} skills from ${currentLevel} level, focus on: ${suggestions[currentLevel].join(", ")}`,
    }
  },
})

const curriculumSearchTool = tool({
  description: "Search for relevant curriculum and courses with video content",
  inputSchema: z.object({
    field: z.string().describe("Field of study or career area"),
    level: z.enum(["beginner", "intermediate", "advanced"]).describe("Difficulty level"),
  }),
  async execute({ field, level }) {
    const courses = [
      {
        title: "Full Stack Web Development",
        duration: "16 weeks",
        skills: ["HTML", "CSS", "JavaScript", "React"],
        videoLectures: "120+ hours of video content",
        practicalProjects: "15 hands-on projects",
      },
      {
        title: "Data Science Fundamentals",
        duration: "12 weeks",
        skills: ["Python", "Statistics", "ML"],
        videoLectures: "80+ hours of video tutorials",
        practicalProjects: "10 real-world datasets",
      },
      {
        title: "Digital Marketing Mastery",
        duration: "8 weeks",
        skills: ["SEO", "Social Media", "Analytics"],
        videoLectures: "60+ hours of case studies",
        practicalProjects: "5 marketing campaigns",
      },
    ]

    return {
      courses: courses.slice(0, 2),
      message: `Found relevant ${level} courses in ${field} with comprehensive video content:`,
    }
  },
})

const streamSpecificCareerGuidanceTool = tool({
  description: "Provide stream-specific career guidance",
  inputSchema: z.object({
    stream: z.string().describe("Academic stream (PCB, PCM, Commerce, Arts)"),
  }),
  async execute({ stream }) {
    const guidance = {
      PCB: "Medical, healthcare, biotechnology, research careers with NEET preparation videos",
      PCM: "Engineering, technology, research, aviation careers with JEE preparation videos",
      Commerce: "Business, finance, accounting, management careers with commerce subject videos",
      Arts: "Humanities, social sciences, creative, civil services careers with arts subject videos",
    }

    return {
      stream,
      guidance: guidance[stream as keyof typeof guidance] || "No specific guidance available for this stream",
      message: `Career opportunities in ${stream}: ${guidance[stream as keyof typeof guidance] || "No specific guidance available for this stream"}`,
    }
  },
})

const videoLectureRecommendationTool = tool({
  description: "Recommend video lectures based on user's stream and interests",
  inputSchema: z.object({
    stream: z.string().describe("Academic stream (PCB, PCM, Commerce, Arts)"),
    subject: z.string().optional().describe("Specific subject if mentioned"),
    topic: z.string().optional().describe("Specific topic if mentioned"),
  }),
  async execute({ stream, subject, topic }) {
    // Stream-specific video lecture recommendations
    const lectureRecommendations = {
      PCB: [
        {
          title: "Human Anatomy & Physiology Masterclass",
          subject: "Biology",
          duration: "2 hours",
          difficulty: "Intermediate",
          description: "Comprehensive video series covering human body systems with 3D animations",
          topics: ["Circulatory System", "Nervous System", "Respiratory System"],
        },
        {
          title: "Organic Chemistry Fundamentals",
          subject: "Chemistry",
          duration: "1.5 hours",
          difficulty: "Beginner",
          description: "Interactive video lectures on organic chemistry basics for NEET preparation",
          topics: ["Hydrocarbons", "Functional Groups", "Reaction Mechanisms"],
        },
        {
          title: "NEET Physics Problem Solving",
          subject: "Physics",
          duration: "3 hours",
          difficulty: "Advanced",
          description: "Step-by-step video solutions for NEET physics problems",
          topics: ["Mechanics", "Thermodynamics", "Optics"],
        },
      ],
      PCM: [
        {
          title: "JEE Mathematics Mastery",
          subject: "Mathematics",
          duration: "4 hours",
          difficulty: "Advanced",
          description: "Complete video course covering JEE mathematics syllabus",
          topics: ["Calculus", "Algebra", "Coordinate Geometry"],
        },
        {
          title: "Engineering Physics Concepts",
          subject: "Physics",
          duration: "2.5 hours",
          difficulty: "Intermediate",
          description: "Physics concepts explained with engineering applications",
          topics: ["Waves", "Electromagnetism", "Modern Physics"],
        },
        {
          title: "Programming Fundamentals",
          subject: "Computer Science",
          duration: "3 hours",
          difficulty: "Beginner",
          description: "Learn programming basics with hands-on coding examples",
          topics: ["Python Basics", "Data Structures", "Algorithms"],
        },
      ],
      Commerce: [
        {
          title: "Accounting Principles Explained",
          subject: "Accountancy",
          duration: "2 hours",
          difficulty: "Beginner",
          description: "Visual explanation of accounting concepts with real examples",
          topics: ["Financial Statements", "Journal Entries", "Trial Balance"],
        },
        {
          title: "Business Studies Case Studies",
          subject: "Business Studies",
          duration: "1.5 hours",
          difficulty: "Intermediate",
          description: "Real business case studies and analysis techniques",
          topics: ["Management", "Marketing", "Finance"],
        },
        {
          title: "Economics Made Simple",
          subject: "Economics",
          duration: "2.5 hours",
          difficulty: "Beginner",
          description: "Economics concepts explained with current market examples",
          topics: ["Microeconomics", "Macroeconomics", "Indian Economy"],
        },
      ],
      Arts: [
        {
          title: "Indian History Chronicles",
          subject: "History",
          duration: "3 hours",
          difficulty: "Intermediate",
          description: "Engaging video series on Indian history with visual storytelling",
          topics: ["Ancient India", "Medieval India", "Modern India"],
        },
        {
          title: "Psychology Fundamentals",
          subject: "Psychology",
          duration: "2 hours",
          difficulty: "Beginner",
          description: "Introduction to psychology with practical applications",
          topics: ["Cognitive Psychology", "Social Psychology", "Developmental Psychology"],
        },
        {
          title: "Political Science Insights",
          subject: "Political Science",
          duration: "2.5 hours",
          difficulty: "Intermediate",
          description: "Understanding political systems and governance",
          topics: ["Indian Constitution", "Political Theory", "International Relations"],
        },
      ],
    }

    const streamLectures = lectureRecommendations[stream as keyof typeof lectureRecommendations] || []
    let filteredLectures = [...streamLectures]

    // Filter by subject if specified
    if (subject && streamLectures.length > 0) {
      filteredLectures = streamLectures.filter((lecture) =>
        lecture.subject.toLowerCase().includes(subject.toLowerCase()),
      )
    }

    // Filter by topic if specified
    if (topic && streamLectures.length > 0) {
      filteredLectures = streamLectures.filter(
        (lecture) =>
          lecture.topics.some((t) => t.toLowerCase().includes(topic.toLowerCase())) ||
          lecture.title.toLowerCase().includes(topic.toLowerCase()),
      )
    }

    return {
      lectures: filteredLectures.slice(0, 3),
      message: `Here are recommended video lectures for ${stream} stream${subject ? ` in ${subject}` : ""}${topic ? ` on ${topic}` : ""}:`,
    }
  },
})

export async function POST(req: Request) {
  try {
    console.log("[v0] Chat API called")

    if (!process.env.DEEPSEEK_API_KEY && !process.env.OPENAI_API_KEY && !process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      console.log("[v0] No API keys found, using mock response")
      
      // Generate mock response based on the last user message
      const lastMessage = messages[messages.length - 1]
      const userMessage = lastMessage?.parts?.find(p => p.type === 'text')?.text || 
                         lastMessage?.text || 
                         lastMessage?.content || 
                         'Hello'
      
      const mockResponse = generateMockCareerResponse(userMessage)
      
      return new Response(JSON.stringify({
        id: Date.now().toString(),
        role: 'assistant',
        parts: [{ type: 'text', text: mockResponse }]
      }), {
        headers: {
          'Content-Type': 'application/json',
        }
      })
    }

    const { messages }: { messages: UIMessage[] } = await req.json()
    console.log("[v0] Received messages:", messages.length)

    // Supabase integration disabled for now - using mock context
    const userProfile = null
    console.log("[v0] Using mock user context")

    const userContext = "\nUser Context: Indian student/professional seeking career guidance"

    const systemPrompt = `You are CareerPath AI, a specialized career counselor for Indian students and professionals. Your role is to provide personalized, practical career guidance with access to video learning resources.

${userContext}

Guidelines:
1. Provide career advice relevant to the Indian job market and education system
2. Consider the user's academic stream (PCB, PCM, Commerce, Arts) when suggesting careers and video lectures
3. Include information about required skills, education paths, and growth prospects in India
4. Be encouraging and supportive, understanding Indian cultural context
5. Ask follow-up questions to better understand their goals and stream
6. Use the available tools to provide personalized recommendations including video lectures
7. Provide actionable next steps including entrance exams, courses, and career paths
8. Focus on opportunities available in India and globally for Indian students
9. Recommend relevant video lectures and online courses based on their stream and interests

Stream-specific guidance:
- PCB: Medical, healthcare, biotechnology, research careers with NEET preparation videos
- PCM: Engineering, technology, research, aviation careers with JEE preparation videos  
- Commerce: Business, finance, accounting, management careers with commerce subject videos
- Arts: Humanities, social sciences, creative, civil services careers with arts subject videos

Available tools:
- Career recommendations based on interests, stream, and profile
- Skill assessment and improvement suggestions  
- Curriculum and course search with video content
- Stream-specific career guidance
- Video lecture recommendations based on stream and subjects

When users ask about learning resources, studying, or specific subjects, always recommend relevant video lectures using the video lecture tool.

Keep responses conversational, helpful, and under 200 words unless detailed information is requested.`

    console.log("[v0] Starting AI generation with DeepSeek")

    const result = streamText({
      model: deepseekAI("deepseek-chat"),
      messages: [{ role: "system", content: systemPrompt }, ...convertToModelMessages(messages)],
      maxOutputTokens: 1000,
      temperature: 0.7,
      tools: {
        getCareerRecommendations: careerRecommendationTool,
        assessSkills: skillAssessmentTool,
        searchCurriculum: curriculumSearchTool,
        getStreamSpecificCareerGuidance: streamSpecificCareerGuidanceTool,
        getVideoLectures: videoLectureRecommendationTool,
      },
    })

    console.log("[v0] Returning streaming response")
    return result.toUIMessageStreamResponse()
  } catch (error) {
    console.error("[v0] Chat API error:", error)
    return new Response("Error processing chat request", { status: 500 })
  }
}
