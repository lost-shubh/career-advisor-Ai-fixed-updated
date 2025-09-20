import { google } from "@ai-sdk/google"
import { generateObject } from "ai"
import { z } from "zod"

const getGoogleAI = () => {
  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY || "AIzaSyArK9RgoElkRBT6Ln9RGOlvNO0STiAMZTQ"
  return google("gemini-1.5-flash", { apiKey })
}

export interface CareerRecommendation {
  title: string
  description: string
  requiredSkills: string[]
  averageSalary: string
  growthProspects: string
  educationPath: string[]
  relevantCourses: string[]
}

export interface LectureContent {
  id: string
  title: string
  description: string
  duration: string
  difficulty: "Beginner" | "Intermediate" | "Advanced"
  topics: string[]
  videoUrl?: string
  materials: string[]
  stream: "PCB" | "PCM" | "Commerce" | "Arts" | "General"
}

// Stream-specific career datasets
export const STREAM_CAREERS = {
  PCB: [
    "Doctor",
    "Dentist",
    "Pharmacist",
    "Biotechnologist",
    "Medical Researcher",
    "Veterinarian",
    "Physiotherapist",
    "Nurse",
    "Medical Laboratory Technician",
    "Biomedical Engineer",
    "Forensic Scientist",
    "Nutritionist",
  ],
  PCM: [
    "Engineer",
    "Software Developer",
    "Data Scientist",
    "Architect",
    "Pilot",
    "Astronomer",
    "Physicist",
    "Mathematician",
    "Statistician",
    "Actuary",
    "Research Scientist",
    "Technology Consultant",
  ],
  Commerce: [
    "Chartered Accountant",
    "Investment Banker",
    "Financial Analyst",
    "Marketing Manager",
    "Business Analyst",
    "Entrepreneur",
    "HR Manager",
    "Operations Manager",
    "Digital Marketing Specialist",
    "E-commerce Manager",
    "Supply Chain Manager",
  ],
  Arts: [
    "Journalist",
    "Lawyer",
    "Psychologist",
    "Social Worker",
    "Teacher",
    "Content Writer",
    "Graphic Designer",
    "Historian",
    "Linguist",
    "Political Scientist",
    "Anthropologist",
    "Philosopher",
  ],
}

export const STREAM_SUBJECTS = {
  PCB: ["Physics", "Chemistry", "Biology", "Mathematics", "English"],
  PCM: ["Physics", "Chemistry", "Mathematics", "Computer Science", "English"],
  Commerce: ["Accountancy", "Business Studies", "Economics", "Mathematics", "English"],
  Arts: ["History", "Geography", "Political Science", "Psychology", "English", "Sociology"],
}

const lectureSchema = z.object({
  lectures: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      description: z.string(),
      duration: z.string(),
      difficulty: z.enum(["Beginner", "Intermediate", "Advanced"]),
      topics: z.array(z.string()),
      materials: z.array(z.string()),
      stream: z.string(),
    }),
  ),
})

function generateFallbackRecommendations(stream: keyof typeof STREAM_CAREERS): CareerRecommendation[] {
  const careers = STREAM_CAREERS[stream]
  return careers.slice(0, 5).map((career, index) => ({
    title: career,
    description: `A career in ${career} involves applying specialized knowledge to make a meaningful impact in your field.`,
    requiredSkills: [
      "Analytical skills",
      "Attention to detail",
      "Problem-solving skills",
      "Communication skills",
      "Teamwork",
    ],
    averageSalary: "INR 5-10 Lakhs per annum",
    growthProspects: "High growth potential with increasing demand",
    educationPath: ["10th", "12th", "Bachelor's degree", "Master's degree"],
    relevantCourses: ["Foundation courses", "Specialized training", "Professional certifications"],
  }))
}

export async function generateCareerRecommendations(
  stream: keyof typeof STREAM_CAREERS,
  interests: string[],
  skills: string[],
): Promise<CareerRecommendation[]> {
  try {
    const model = getGoogleAI()
    const streamCareers = STREAM_CAREERS[stream]

    const careerSchema = z.object({
      recommendations: z.array(
        z.object({
          title: z.string(),
          description: z.string(),
          requiredSkills: z.array(z.string()),
          averageSalary: z.string(),
          growthProspects: z.string(),
          educationPath: z.array(z.string()),
          relevantCourses: z.array(z.string()),
        }),
      ),
    })

    const prompt = `
      Based on the student's stream (${stream}), interests (${interests.join(", ")}), and skills (${skills.join(", ")}), 
      recommend 5 specific career paths from these options: ${streamCareers.join(", ")}.
      
      For each career, provide:
      1. Title
      2. Brief description (2-3 sentences)
      3. Required skills (5-7 skills)
      4. Average salary range in India
      5. Growth prospects
      6. Education path (step by step)
      7. Relevant courses/certifications
    `

    const { object } = await generateObject({
      model,
      schema: careerSchema,
      prompt,
      temperature: 0.7,
    })

    return object.recommendations
  } catch (error) {
    console.error("Error generating career recommendations:", error)
    return generateFallbackRecommendations(stream)
  }
}

export async function generateLectures(
  stream: keyof typeof STREAM_SUBJECTS,
  subject: string,
  customPrompt?: string,
): Promise<LectureContent[]> {
  try {
    const model = getGoogleAI()

    const basePrompt =
      customPrompt ||
      `
      Create 6 comprehensive lecture topics for ${subject} in ${stream} stream for Indian students.
      Each lecture should be practical and career-focused, connecting theory to real-world applications.
      
      Consider:
      - Indian education system and curriculum standards
      - Career opportunities in India and globally
      - Practical applications and industry relevance
      - Progressive difficulty levels
      - Interactive learning elements
      
      Provide lectures with: id, title, description, duration, difficulty, topics, materials, stream.
    `

    const { object } = await generateObject({
      model,
      schema: lectureSchema,
      prompt: basePrompt,
      temperature: 0.7,
    })

    return object.lectures.map((lecture, index) => ({
      ...lecture,
      id: lecture.id || `${subject.toLowerCase().replace(/\s+/g, "-")}-${index + 1}`,
      stream: stream as "PCB" | "PCM" | "Commerce" | "Arts" | "General",
      difficulty: lecture.difficulty as "Beginner" | "Intermediate" | "Advanced",
    }))
  } catch (error) {
    console.error("Error generating lectures:", error)
    return generateFallbackLectures(stream, subject)
  }
}

function generateFallbackLectures(stream: keyof typeof STREAM_SUBJECTS, subject: string): LectureContent[] {
  const difficulties: ("Beginner" | "Intermediate" | "Advanced")[] = [
    "Beginner",
    "Beginner",
    "Intermediate",
    "Intermediate",
    "Advanced",
    "Advanced",
  ]

  return Array.from({ length: 6 }, (_, i) => ({
    id: `${subject.toLowerCase().replace(/\s+/g, "-")}-${i + 1}`,
    title: `${subject} Fundamentals - Part ${i + 1}`,
    description: `Comprehensive introduction to key concepts in ${subject} with practical applications and career connections.`,
    duration: "45 minutes",
    difficulty: difficulties[i],
    topics: [
      `${subject} basics`,
      "Practical applications",
      "Career connections",
      "Problem solving",
      "Real-world examples",
    ],
    materials: ["Video lecture", "Study notes", "Practice exercises", "Interactive quizzes", "Career insights"],
    stream: stream as "PCB" | "PCM" | "Commerce" | "Arts" | "General",
  }))
}

export async function generateChatResponse(message: string, context: any) {
  try {
    const model = getGoogleAI()

    const prompt = `
      You are a career counselor AI for Indian students. Respond to: "${message}"
      
      Context: ${JSON.stringify(context)}
      
      Provide helpful, encouraging advice focused on Indian education system and career opportunities.
      Keep responses concise but informative.
    `

    const { object } = await generateObject({
      model,
      schema: z.object({ response: z.string() }),
      prompt,
      temperature: 0.7,
    })

    return object.response
  } catch (error) {
    console.error("Error generating chat response:", error)
    return "I'm here to help with your career questions! Could you please rephrase your question?"
  }
}
