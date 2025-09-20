import { google } from "@ai-sdk/google"
import { openai } from "@ai-sdk/openai"
import { convertToModelMessages, streamText, type UIMessage } from "ai"
import { NextRequest, NextResponse } from "next/server"

export const maxDuration = 30

// Mock response generator for when no API keys are available
function generateMockResponse(lastUserMessage: string): string {
  const message = lastUserMessage.toLowerCase()
  
  if (message.includes('career') || message.includes('job')) {
    return `🎯 **Career Guidance**

Based on your interests, here are some career paths to consider:

**Technology Careers:**
• Software Developer - Build applications and systems
• Data Scientist - Analyze data to drive business decisions  
• UX/UI Designer - Create user-friendly interfaces

**Business Careers:**
• Digital Marketing Manager - Drive online growth strategies
• Business Analyst - Bridge business and technology needs
• Project Manager - Lead cross-functional teams

**Next Steps:**
1. Identify your core interests and strengths
2. Research specific roles that align with your goals
3. Start building relevant skills through online courses
4. Network with professionals in your target field

Would you like me to dive deeper into any specific career path?`
  }
  
  if (message.includes('skill') || message.includes('learn')) {
    return `📚 **Skill Development**

Here's a personalized learning path:

**Core Skills to Develop:**
• Communication & Presentation
• Problem-solving & Critical thinking
• Digital literacy & Tech skills
• Leadership & Teamwork

**Learning Resources:**
• Online platforms: Coursera, Udemy, Skillshare
• Practice projects and portfolios
• Professional communities and forums
• Mentorship and networking

**Action Plan:**
1. Assess your current skill level
2. Set specific, measurable learning goals
3. Dedicate 1-2 hours daily to skill building
4. Apply skills through real projects

What specific skill would you like to focus on first?`
  }
  
  if (message.includes('interview') || message.includes('preparation')) {
    return `💼 **Interview Preparation**

**Common Interview Questions:**
• "Tell me about yourself"
• "Why are you interested in this role?"
• "What are your strengths and weaknesses?"
• "Describe a challenging project you worked on"

**Preparation Tips:**
1. Research the company and role thoroughly
2. Practice your responses using the STAR method
3. Prepare thoughtful questions for the interviewer
4. Do mock interviews with friends or mentors

**What to Bring:**
• Multiple copies of your resume
• Portfolio or work samples (if applicable)
• List of references
• Notepad and pen

Would you like help preparing for a specific type of interview?`
  }
  
  if (message.includes('resume') || message.includes('cv')) {
    return `📄 **Resume Optimization**

**Key Resume Sections:**
• Professional summary (2-3 sentences)
• Work experience with quantified achievements
• Skills relevant to target role
• Education and certifications

**Best Practices:**
• Use action verbs (managed, developed, improved)
• Quantify accomplishments with numbers
• Tailor content to each job application
• Keep it concise (1-2 pages max)

**Common Mistakes to Avoid:**
• Typos and grammatical errors
• Generic, one-size-fits-all content
• Missing contact information
• Unprofessional email address

Would you like help with a specific section of your resume?`
  }
  
  // Default response
  return `👋 Hi there! I'm your AI career advisor.

I can help you with:
• **Career exploration** - Discover paths that match your interests
• **Skill development** - Plan your learning journey  
• **Job search** - Find opportunities and prepare applications
• **Interview prep** - Practice and get ready to shine
• **Resume building** - Create a standout professional profile

What would you like to explore today? Just ask me anything about your career!`
}

export async function POST(req: NextRequest) {
  try {
    const { messages }: { messages: UIMessage[] } = await req.json()
    
    if (!messages || messages.length === 0) {
      return NextResponse.json({ error: "No messages provided" }, { status: 400 })
    }

    const lastMessage = messages[messages.length - 1]
    
    // Check if we have API keys available
    const hasGoogleKey = !!process.env.GOOGLE_GENERATIVE_AI_API_KEY && 
                        process.env.GOOGLE_GENERATIVE_AI_API_KEY !== 'your_google_ai_api_key_here'
    const hasOpenAIKey = !!process.env.OPENAI_API_KEY && 
                        process.env.OPENAI_API_KEY !== 'your_openai_api_key_here'

    // If no API keys, return mock response
    if (!hasGoogleKey && !hasOpenAIKey) {
      console.log("No API keys found, using mock response")
      
      const mockResponse = generateMockResponse(
        lastMessage.parts?.find(p => p.type === 'text')?.text || lastMessage.toString()
      )
      
      // Return a streaming-like response for consistency
      return new Response(
        JSON.stringify({
          id: Date.now().toString(),
          role: 'assistant',
          parts: [{ type: 'text', text: mockResponse }]
        }),
        {
          headers: {
            'Content-Type': 'application/json',
          }
        }
      )
    }

    // Use AI if keys are available
    const systemPrompt = `You are CareerBot, a friendly and knowledgeable AI career advisor. 

Your role is to provide:
- Personalized career guidance and recommendations
- Job search strategies and interview preparation  
- Skill development planning and learning resources
- Resume and professional profile optimization
- Industry insights and market trends

Guidelines:
- Be encouraging, supportive, and professional
- Ask clarifying questions to understand user needs better
- Provide specific, actionable advice
- Keep responses conversational and under 300 words
- Focus on practical next steps

Always end your responses with a relevant follow-up question to keep the conversation flowing.`

    let model
    if (hasGoogleKey) {
      model = google("gemini-1.5-flash")
    } else if (hasOpenAIKey) {
      model = openai("gpt-3.5-turbo")
    }

    const result = streamText({
      model: model!,
      messages: [
        { role: "system", content: systemPrompt },
        ...convertToModelMessages(messages)
      ],
      maxTokens: 500,
      temperature: 0.7,
    })

    return result.toUIMessageStreamResponse()

  } catch (error) {
    console.error("Chat API error:", error)
    
    // Fallback to mock response on error
    const mockResponse = generateMockResponse("help")
    
    return new Response(
      JSON.stringify({
        id: Date.now().toString(),
        role: 'assistant', 
        parts: [{ 
          type: 'text', 
          text: "I'm here to help with your career questions! Due to a technical issue, I'm running in offline mode, but I can still provide valuable career guidance. What would you like to know?" 
        }]
      }),
      {
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }
}