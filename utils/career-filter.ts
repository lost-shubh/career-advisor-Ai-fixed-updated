export interface CareerStream {
  id: string
  name: string
  description: string
  subjects: string[]
  careerCategories: string[]
}

export const academicStreams: CareerStream[] = [
  {
    id: "science",
    name: "Science Stream",
    description: "Physics, Chemistry, Mathematics, Biology",
    subjects: ["Physics", "Chemistry", "Mathematics", "Biology", "Computer Science"],
    careerCategories: ["Technology", "Healthcare", "Research", "Engineering", "Data Science"],
  },
  {
    id: "commerce",
    name: "Commerce Stream",
    description: "Business Studies, Economics, Accountancy",
    subjects: ["Business Studies", "Economics", "Accountancy", "Mathematics", "English"],
    careerCategories: ["Business", "Finance", "Marketing", "Entrepreneurship", "Management"],
  },
  {
    id: "arts",
    name: "Arts/Humanities Stream",
    description: "History, Geography, Political Science, Literature",
    subjects: ["History", "Geography", "Political Science", "Literature", "Psychology", "Sociology"],
    careerCategories: ["Creative", "Social Work", "Education", "Media", "Government", "Law"],
  },
  {
    id: "vocational",
    name: "Vocational Stream",
    description: "Skill-based practical training",
    subjects: ["Technical Skills", "Practical Training", "Industry Specific"],
    careerCategories: ["Skilled Trades", "Technical Services", "Hospitality", "Beauty & Wellness"],
  },
]

export interface CareerOption {
  id: string
  title: string
  description: string
  category: string
  requiredStreams: string[]
  minEducation: string
  skillLevel: "Beginner" | "Intermediate" | "Advanced"
  salaryRange: string
  growthRate: string
  ageAppropriate: {
    min: number
    max: number
  }
}

export const careerDatabase: CareerOption[] = [
  // Technology Careers
  {
    id: "software-developer",
    title: "Software Developer",
    description: "Design and build software applications",
    category: "Technology",
    requiredStreams: ["science"],
    minEducation: "Bachelor's Degree",
    skillLevel: "Intermediate",
    salaryRange: "₹4-15 LPA",
    growthRate: "+22%",
    ageAppropriate: { min: 18, max: 50 },
  },
  {
    id: "data-scientist",
    title: "Data Scientist",
    description: "Analyze data to derive business insights",
    category: "Data Science",
    requiredStreams: ["science", "commerce"],
    minEducation: "Bachelor's Degree",
    skillLevel: "Advanced",
    salaryRange: "₹6-20 LPA",
    growthRate: "+35%",
    ageAppropriate: { min: 20, max: 45 },
  },

  // Business Careers
  {
    id: "business-analyst",
    title: "Business Analyst",
    description: "Bridge business needs with technology solutions",
    category: "Business",
    requiredStreams: ["commerce", "science"],
    minEducation: "Bachelor's Degree",
    skillLevel: "Intermediate",
    salaryRange: "₹4-16 LPA",
    growthRate: "+14%",
    ageAppropriate: { min: 18, max: 45 },
  },
  {
    id: "digital-marketing",
    title: "Digital Marketing Specialist",
    description: "Promote products through digital channels",
    category: "Marketing",
    requiredStreams: ["commerce", "arts"],
    minEducation: "Bachelor's Degree",
    skillLevel: "Beginner",
    salaryRange: "₹3-12 LPA",
    growthRate: "+25%",
    ageAppropriate: { min: 18, max: 40 },
  },

  // Creative Careers
  {
    id: "ux-designer",
    title: "UX/UI Designer",
    description: "Design user-friendly digital interfaces",
    category: "Creative",
    requiredStreams: ["arts", "science"],
    minEducation: "Bachelor's Degree",
    skillLevel: "Intermediate",
    salaryRange: "₹4-18 LPA",
    growthRate: "+18%",
    ageAppropriate: { min: 18, max: 45 },
  },
  {
    id: "content-creator",
    title: "Content Creator",
    description: "Create engaging content across platforms",
    category: "Creative",
    requiredStreams: ["arts", "commerce"],
    minEducation: "Any Degree",
    skillLevel: "Beginner",
    salaryRange: "₹2-10 LPA",
    growthRate: "+20%",
    ageAppropriate: { min: 16, max: 40 },
  },

  // Healthcare Careers
  {
    id: "doctor",
    title: "Medical Doctor",
    description: "Diagnose and treat medical conditions",
    category: "Healthcare",
    requiredStreams: ["science"],
    minEducation: "MBBS",
    skillLevel: "Advanced",
    salaryRange: "₹8-50 LPA",
    growthRate: "+7%",
    ageAppropriate: { min: 22, max: 60 },
  },

  // Education Careers
  {
    id: "teacher",
    title: "Teacher/Educator",
    description: "Educate and guide students",
    category: "Education",
    requiredStreams: ["arts", "science", "commerce"],
    minEducation: "Bachelor's + B.Ed",
    skillLevel: "Intermediate",
    salaryRange: "₹3-8 LPA",
    growthRate: "+5%",
    ageAppropriate: { min: 20, max: 60 },
  },
]

export function filterCareersByStream(userStream: string, userAge?: number): CareerOption[] {
  return careerDatabase.filter((career) => {
    // Check if user's stream matches required streams
    const streamMatch = career.requiredStreams.includes(userStream)

    // Check age appropriateness if age is provided
    const ageMatch = userAge ? userAge >= career.ageAppropriate.min && userAge <= career.ageAppropriate.max : true

    return streamMatch && ageMatch
  })
}

export function getStreamRecommendations(userStream: string): string[] {
  const stream = academicStreams.find((s) => s.id === userStream)
  return stream ? stream.careerCategories : []
}

export function isCareerAppropriateForAge(career: CareerOption, age: number): boolean {
  return age >= career.ageAppropriate.min && age <= career.ageAppropriate.max
}

export function getCareersByCategory(category: string, userStream?: string): CareerOption[] {
  let careers = careerDatabase.filter((career) => career.category === category)

  if (userStream) {
    careers = careers.filter((career) => career.requiredStreams.includes(userStream))
  }

  return careers
}
