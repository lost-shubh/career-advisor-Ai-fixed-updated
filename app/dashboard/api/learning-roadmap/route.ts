import { google } from "@ai-sdk/google"
import { generateObject } from "ai"
import { z } from "zod"

const learningRoadmapSchema = z.object({
  roadmaps: z
    .array(
      z.object({
        id: z.string().describe("Unique identifier for the roadmap"),
        title: z.string().describe("Roadmap title"),
        description: z.string().describe("Brief description of what this roadmap covers"),
        duration: z.string().describe("Estimated completion time"),
        difficulty: z.enum(["Beginner", "Intermediate", "Advanced"]).describe("Difficulty level"),
        category: z.string().describe("Category like Programming, Design, Business, etc."),
        prerequisites: z.array(z.string()).describe("Prerequisites for this roadmap"),
        learningOutcomes: z.array(z.string()).describe("What the learner will achieve"),
        modules: z
          .array(
            z.object({
              id: z.string().describe("Module identifier"),
              title: z.string().describe("Module title"),
              description: z.string().describe("Module description"),
              duration: z.string().describe("Estimated time to complete"),
              topics: z.array(z.string()).describe("Topics covered in this module"),
              resources: z
                .array(
                  z.object({
                    type: z
                      .enum(["video", "article", "course", "book", "practice", "project"])
                      .describe("Type of resource"),
                    title: z.string().describe("Resource title"),
                    description: z.string().describe("Resource description"),
                    url: z.string().optional().describe("Resource URL if available"),
                    duration: z.string().describe("Time required"),
                    difficulty: z.enum(["Easy", "Medium", "Hard"]).describe("Resource difficulty"),
                  }),
                )
                .describe("Learning resources for this module"),
              assessment: z
                .object({
                  type: z.enum(["quiz", "project", "assignment"]).describe("Assessment type"),
                  description: z.string().describe("Assessment description"),
                  criteria: z.array(z.string()).describe("Assessment criteria"),
                })
                .describe("Module assessment"),
            }),
          )
          .describe("Roadmap modules"),
        careerAlignment: z.array(z.string()).describe("Careers this roadmap aligns with"),
        skillsGained: z.array(z.string()).describe("Skills gained from completing this roadmap"),
      }),
    )
    .describe("Personalized learning roadmaps"),
  recommendations: z.string().describe("Overall recommendations for the learner"),
})

export async function POST(req: Request) {
  try {
    const { userData, careerInterests, skillLevel, streamFocus } = await req.json()

    const userCareerField = userData.careerField?.toLowerCase() || ""
    const userStream = userData.stream?.toLowerCase() || ""
    let careerFocus = "general skill development"
    let specificGuidance = ""

    if (
      userStream.includes("pcb") ||
      userStream.includes("medical") ||
      userCareerField.includes("medical") ||
      userCareerField.includes("healthcare")
    ) {
      careerFocus = "medical and healthcare career preparation"
      specificGuidance = `
      CRITICAL: Focus exclusively on medical and healthcare pathways for PCB/Medical stream students:
      
      PRIMARY FOCUS AREAS:
      - NEET preparation and medical entrance exam strategies
      - Medical science fundamentals (anatomy, physiology, biochemistry, pathology)
      - Healthcare technology and digital health innovations
      - Medical research methodologies and evidence-based practice
      - Patient care, medical ethics, and healthcare communication
      - Pharmaceutical sciences and drug development
      - Healthcare management and hospital administration
      - Alternative medicine systems (Ayurveda, Homeopathy)
      - Nursing and allied health sciences
      - Medical laboratory technology and diagnostics
      - Public health and epidemiology
      - Biomedical engineering and medical devices
      
      CAREER PATHWAYS TO EMPHASIZE:
      - MBBS (Doctor), BDS (Dentist), BAMS (Ayurveda), BHMS (Homeopathy)
      - Nursing, Physiotherapy, Occupational Therapy
      - Medical Laboratory Technology, Radiology Technology
      - Pharmacy, Biotechnology, Microbiology
      - Healthcare Administration, Hospital Management
      - Medical Research, Clinical Research
      - Public Health, Epidemiology
      - Medical Writing, Healthcare Journalism
      `
    } else if (
      userStream.includes("pcm") ||
      userStream.includes("engineering") ||
      userCareerField.includes("engineering") ||
      userCareerField.includes("technology")
    ) {
      careerFocus = "engineering and technology skill development"
      specificGuidance = `
      CRITICAL: Focus exclusively on engineering and technology pathways for PCM/Engineering stream students:
      
      PRIMARY FOCUS AREAS:
      - JEE preparation and engineering entrance exam strategies
      - Programming languages and software development (Python, Java, C++, JavaScript)
      - Engineering mathematics and advanced problem-solving techniques
      - Data structures, algorithms, and computational thinking
      - Web development, mobile app development, and full-stack technologies
      - Data science, machine learning, and artificial intelligence
      - Cloud computing, DevOps, and system architecture
      - Cybersecurity and information security
      - Robotics, IoT, and embedded systems
      - Computer networks and distributed systems
      - Database management and big data technologies
      - Software engineering principles and project management
      
      CAREER PATHWAYS TO EMPHASIZE:
      - Software Engineer, Full-Stack Developer, Mobile App Developer
      - Data Scientist, Machine Learning Engineer, AI Researcher
      - Cybersecurity Analyst, Network Engineer, Cloud Architect
      - Mechanical Engineer, Civil Engineer, Electrical Engineer
      - Robotics Engineer, IoT Developer, Embedded Systems Engineer
      - Product Manager, Technical Lead, Engineering Manager
      - Research Scientist, Technology Consultant
      - Startup Founder, Technology Entrepreneur
      `
    } else if (
      userStream.includes("commerce") ||
      userCareerField.includes("business") ||
      userCareerField.includes("commerce")
    ) {
      careerFocus = "business and commerce skill development"
      specificGuidance = `
      CRITICAL: Focus exclusively on business and commerce pathways for Commerce stream students:
      
      PRIMARY FOCUS AREAS:
      - Business fundamentals and strategic management
      - Financial accounting, cost accounting, and financial analysis
      - Taxation, auditing, and compliance
      - Economics, business economics, and market analysis
      - Marketing, digital marketing, and brand management
      - Sales, customer relationship management, and business development
      - Entrepreneurship, startup development, and innovation
      - Investment banking, financial planning, and wealth management
      - International business and global trade
      - E-commerce, digital business transformation
      - Business law, corporate governance, and ethics
      - Supply chain management and operations
      
      CAREER PATHWAYS TO EMPHASIZE:
      - Chartered Accountant (CA), Cost Accountant (CMA), Company Secretary (CS)
      - Financial Analyst, Investment Banker, Financial Planner
      - Marketing Manager, Digital Marketing Specialist, Brand Manager
      - Business Analyst, Management Consultant, Strategy Consultant
      - Entrepreneur, Business Owner, Startup Founder
      - Sales Manager, Business Development Manager
      - Banking Professional, Insurance Specialist
      - Import-Export Manager, International Trade Specialist
      `
    } else if (userStream.includes("arts") || userStream.includes("humanities") || userCareerField.includes("arts")) {
      careerFocus = "arts and humanities skill development"
      specificGuidance = `
      CRITICAL: Focus exclusively on arts and humanities pathways for Arts/Humanities stream students:
      
      PRIMARY FOCUS AREAS:
      - Creative writing, literature, and literary analysis
      - Communication skills, public speaking, and presentation
      - Media studies, journalism, and content creation
      - Psychology, sociology, and human behavior studies
      - History, political science, and social sciences
      - Languages, linguistics, and translation studies
      - Fine arts, visual arts, and creative design
      - Philosophy, ethics, and critical thinking
      - Cultural studies and anthropology
      - Education, teaching methodologies, and curriculum development
      - Social work, community development, and NGO management
      - Digital content creation, blogging, and social media
      
      CAREER PATHWAYS TO EMPHASIZE:
      - Writer, Author, Journalist, Content Creator
      - Teacher, Professor, Education Consultant
      - Psychologist, Counselor, Social Worker
      - Civil Services (IAS, IPS, IFS), Government Jobs
      - Lawyer, Legal Advisor, Paralegal
      - Translator, Interpreter, Language Specialist
      - Artist, Designer, Creative Director
      - Museum Curator, Historian, Researcher
      - NGO Worker, Social Activist, Community Organizer
      - Media Professional, Public Relations Specialist
      `
    }

    const prompt = `
    Create personalized learning roadmaps for this Indian student focused on ${careerFocus}:

    Student Profile:
    - Name: ${userData.name}
    - Age: ${userData.age}
    - Education Level: ${userData.educationLevel}
    - Stream: ${userData.stream} (THIS IS CRITICAL - ALL ROADMAPS MUST BE RELEVANT TO THIS STREAM)
    - Career Field Interest: ${userData.careerField}
    - Specific Interests: ${userData.interests?.join(", ") || "Not specified"}
    - Career Goals: ${userData.goals}
    - Learning Style: ${userData.learningStyle}
    - Time Commitment: ${userData.timeCommitment}
    - Languages: ${userData.languages?.join(", ") || "English, Hindi"}

    Career Interests: ${careerInterests.join(", ")}
    Current Skill Level: ${skillLevel}
    Stream Focus: ${streamFocus || getStreamSpecificPrompt(userData).streamFocus}

    ${specificGuidance}

    MANDATORY REQUIREMENTS:
    1. ALL roadmaps MUST be 100% relevant to the student's stream (${userData.stream})
    2. If PCB/Medical stream: Focus ONLY on medical, healthcare, and life sciences careers
    3. If PCM/Engineering stream: Focus ONLY on engineering, technology, and mathematical sciences
    4. If Commerce stream: Focus ONLY on business, finance, and commerce careers
    5. If Arts/Humanities stream: Focus ONLY on liberal arts, social sciences, and creative fields
    6. Include entrance exam preparation relevant to their stream (NEET for medical, JEE for engineering, etc.)
    7. Provide Indian education system context and career pathways
    8. Include both academic and skill-based learning paths
    9. Make roadmaps progressive from beginner to advanced levels
    10. Include practical projects and real-world applications

    Create 3-4 comprehensive learning roadmaps that are EXCLUSIVELY tailored to the ${userData.stream} stream.
    Each roadmap should have 4-6 modules with detailed resources and assessments.
    Focus on Indian educational context, entrance exams, and career opportunities specific to their stream.
    `

    const { object } = await generateObject({
      model: google("gemini-1.5-flash"),
      schema: learningRoadmapSchema,
      prompt,
      temperature: 0.7,
    })

    return Response.json({ roadmaps: object })
  } catch (error) {
    console.error("Error generating learning roadmap:", error)
    return Response.json({ error: "Failed to generate learning roadmap" }, { status: 500 })
  }
}

function getStreamSpecificPrompt(userData) {
  const userStream = userData.stream?.toLowerCase() || ""
  let streamFocus = ""

  if (userStream.includes("pcb") || userStream.includes("medical")) {
    streamFocus = "medical and healthcare"
  } else if (userStream.includes("pcm") || userStream.includes("engineering")) {
    streamFocus = "engineering and technology"
  } else if (userStream.includes("commerce")) {
    streamFocus = "business and commerce"
  } else if (userStream.includes("arts") || userStream.includes("humanities")) {
    streamFocus = "arts and humanities"
  }

  return { streamFocus }
}
