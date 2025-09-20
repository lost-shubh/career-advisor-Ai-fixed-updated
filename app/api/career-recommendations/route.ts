import { google } from "@ai-sdk/google"
import { generateObject } from "ai"
import { z } from "zod"
import { STREAM_CAREERS } from "@/lib/google-ai"

const careerRecommendationSchema = z.object({
  recommendations: z
    .array(
      z.object({
        title: z.string().describe("Career title"),
        matchPercentage: z.number().min(0).max(100).describe("Match percentage based on user profile"),
        description: z.string().describe("Brief description of the career"),
        keySkills: z.array(z.string()).describe("Key skills required for this career"),
        educationPath: z.string().describe("Recommended education path"),
        averageSalary: z.string().describe("Average salary range in India"),
        jobGrowth: z.string().describe("Job growth outlook"),
        industryTrends: z.string().describe("Current industry trends"),
        nextSteps: z.array(z.string()).describe("Immediate next steps to pursue this career"),
        relatedCareers: z.array(z.string()).describe("Related career options"),
      }),
    )
    .length(6)
    .describe("Top 6 career recommendations"),
  overallAnalysis: z.string().describe("Overall analysis of the user's career potential"),
  marketInsights: z.string().describe("Current job market insights relevant to the user"),
})

export async function POST(req: Request) {
  try {
    const { userData, skillsData } = await req.json()

    if (!userData || !skillsData) {
      return Response.json({ error: "Missing user data or skills data" }, { status: 400 })
    }

    // Calculate skill scores
    const calculateSkillScore = (categoryId: string) => {
      const categoryAnswers = skillsData[categoryId] || {}
      const scores = Object.values(categoryAnswers)
        .map(Number)
        .filter((score) => !isNaN(score))
      if (scores.length === 0) return 0
      return Math.round((scores.reduce((sum: number, score: number) => sum + score, 0) / scores.length) * 20)
    }

    const skillScores = {
      technical: calculateSkillScore("technical"),
      analytical: calculateSkillScore("analytical"),
      communication: calculateSkillScore("communication"),
      leadership: calculateSkillScore("leadership"),
    }

    const userStream = userData.stream || "PCB"
    const userCareerField = userData.careerField?.toLowerCase() || ""
    const userInterests = userData.interests || []

    // Get stream-specific careers
    const streamCareers = STREAM_CAREERS[userStream as keyof typeof STREAM_CAREERS] || STREAM_CAREERS.PCB

    let careerFocus = "general career development"
    let specificCareers = streamCareers.join(", ")

    if (userStream === "PCB" || userCareerField.includes("medical") || userCareerField.includes("healthcare")) {
      careerFocus = "healthcare and medical careers"
      specificCareers = STREAM_CAREERS.PCB.join(", ")
    } else if (
      userStream === "PCM" ||
      userCareerField.includes("engineering") ||
      userCareerField.includes("technology")
    ) {
      careerFocus = "engineering and technology careers"
      specificCareers = STREAM_CAREERS.PCM.join(", ")
    } else if (userStream === "Commerce" || userCareerField.includes("business")) {
      careerFocus = "business and commerce careers"
      specificCareers = STREAM_CAREERS.Commerce.join(", ")
    } else if (userStream === "Arts") {
      careerFocus = "arts and humanities careers"
      specificCareers = STREAM_CAREERS.Arts.join(", ")
    }

    const prompt = `
    Analyze this Indian student's profile and provide personalized career recommendations focused on ${careerFocus} for ${userStream} stream students:

    Personal Information:
    - Name: ${userData.name}
    - Age: ${userData.age}
    - Location: ${userData.city}, ${userData.state}
    - Education Level: ${userData.educationLevel}
    - Academic Stream: ${userStream}
    - Institution: ${userData.institution}
    - Career Field Interest: ${userData.careerField}
    - Specific Interests: ${userInterests.join(", ")}
    - Career Goals: ${userData.goals}
    - Learning Style: ${userData.learningStyle}
    - Time Commitment: ${userData.timeCommitment}
    - Languages: ${userData.languages?.join(", ") || "English, Hindi"}

    Skills Assessment Results:
    - Technical Skills: ${skillScores.technical}%
    - Analytical Thinking: ${skillScores.analytical}%
    - Communication: ${skillScores.communication}%
    - Leadership: ${skillScores.leadership}%

    IMPORTANT: Focus ONLY on careers relevant to ${userStream} stream students. Choose from these careers: ${specificCareers}

    Stream-Specific Guidelines:
    ${
      userStream === "PCB"
        ? `
    - Focus on medical careers: Doctor, Dentist, Pharmacist, Biotechnologist, Medical Researcher, Veterinarian, Physiotherapist, Nurse, Medical Laboratory Technician, Biomedical Engineer, Forensic Scientist, Nutritionist
    - Include healthcare administration and health-tech roles
    - Consider medical research and pharmaceutical careers
    - Emphasize NEET preparation and medical entrance exams
    `
        : userStream === "PCM"
          ? `
    - Focus on engineering and technology: Engineer, Software Developer, Data Scientist, Architect, Pilot, Astronomer, Physicist, Mathematician, Statistician, Actuary, Research Scientist, Technology Consultant
    - Include emerging tech roles like AI/ML, cybersecurity, robotics
    - Consider JEE preparation and engineering entrance exams
    - Include research and development opportunities
    `
          : userStream === "Commerce"
            ? `
    - Focus on business and finance: Chartered Accountant, Investment Banker, Financial Analyst, Marketing Manager, Business Analyst, Entrepreneur, HR Manager, Operations Manager, Digital Marketing Specialist, E-commerce Manager, Supply Chain Manager
    - Include fintech and digital commerce opportunities
    - Consider CA, CMA, and other professional certifications
    - Include startup and entrepreneurship paths
    `
            : `
    - Focus on humanities and social sciences: Journalist, Lawyer, Psychologist, Social Worker, Teacher, Content Writer, Graphic Designer, Historian, Linguist, Political Scientist, Anthropologist, Philosopher
    - Include civil services and government opportunities
    - Consider UPSC and state service examinations
    - Include media, content creation, and social impact roles
    `
    }

    Please provide career recommendations that:
    1. Are STRICTLY relevant to the ${userStream} stream
    2. Are realistic for the Indian job market
    3. Consider the student's current education level and stream
    4. Align with their interests and skills within their stream
    5. Include both traditional and emerging career paths within ${userStream}
    6. Consider the evolving job market in India for ${userStream} graduates
    7. Provide practical, actionable next steps specific to ${userStream}

    Focus on careers that are growing in India's economy within the ${userStream} stream.
    `

    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY || "AIzaSyArK9RgoElkRBT6Ln9RGOlvNO0STiAMZTQ"

    const { object } = await generateObject({
      model: google("gemini-1.5-flash", { apiKey }),
      schema: careerRecommendationSchema,
      prompt,
      temperature: 0.7,
    })

    return Response.json({ recommendations: object })
  } catch (error) {
    console.error("Error generating career recommendations:", error)

    const fallbackRecommendations = {
      recommendations: [
        {
          title: "Software Developer",
          matchPercentage: 85,
          description: "Design and develop software applications and systems",
          keySkills: ["Programming", "Problem Solving", "Analytical Thinking"],
          educationPath: "Bachelor's in Computer Science or related field",
          averageSalary: "INR 4-12 Lakhs per annum",
          jobGrowth: "High demand with 15-20% annual growth",
          industryTrends: "Growing demand for AI/ML and cloud technologies",
          nextSteps: ["Learn programming languages", "Build projects", "Apply for internships"],
          relatedCareers: ["Data Scientist", "Web Developer", "Mobile App Developer"],
        },
      ],
      overallAnalysis: "Based on your profile, you show strong potential in technology careers.",
      marketInsights: "The Indian IT sector continues to grow with excellent opportunities for skilled professionals.",
    }

    return Response.json({ recommendations: fallbackRecommendations })
  }
}
