import { type NextRequest, NextResponse } from "next/server"
import { generateLectures, STREAM_SUBJECTS } from "@/lib/google-ai"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const stream = searchParams.get("stream") as keyof typeof STREAM_SUBJECTS
    const subject = searchParams.get("subject")

    if (!stream || !STREAM_SUBJECTS[stream]) {
      return NextResponse.json({ error: "Invalid stream parameter" }, { status: 400 })
    }

    if (subject && !STREAM_SUBJECTS[stream].includes(subject)) {
      return NextResponse.json({ error: "Invalid subject for this stream" }, { status: 400 })
    }

    let lectures
    if (subject) {
      // Generate lectures for specific subject
      lectures = await generateLectures(stream, subject)
    } else {
      // Generate lectures for all subjects in the stream
      const allLectures = []
      for (const subj of STREAM_SUBJECTS[stream]) {
        const subjectLectures = await generateLectures(stream, subj)
        allLectures.push(...subjectLectures)
      }
      lectures = allLectures
    }

    return NextResponse.json({ lectures })
  } catch (error) {
    console.error("Error generating lectures:", error)
    return NextResponse.json({ error: "Failed to generate lectures" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { stream, subject, customPrompt } = body

    if (!stream || !STREAM_SUBJECTS[stream]) {
      return NextResponse.json({ error: "Invalid stream parameter" }, { status: 400 })
    }

    // Generate custom lectures based on user prompt
    const lectures = await generateLectures(stream, subject || "General", customPrompt)

    return NextResponse.json({ lectures })
  } catch (error) {
    console.error("Error generating custom lectures:", error)
    return NextResponse.json({ error: "Failed to generate custom lectures" }, { status: 500 })
  }
}
