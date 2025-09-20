import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient()
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const level = searchParams.get("level")

    let query = supabase
      .from("study_groups")
      .select(`
        *,
        moderator:profiles!study_groups_moderator_id_fkey(full_name, avatar_url),
        members:group_members(count),
        next_session:group_sessions(session_date, session_time)
      `)
      .eq("status", "active")
      .order("created_at", { ascending: false })

    if (category) {
      query = query.eq("category", category)
    }

    if (level) {
      query = query.eq("level", level)
    }

    const { data: groups, error } = await query

    if (error) {
      console.error("Error fetching study groups:", error)
      return NextResponse.json({ error: "Failed to fetch study groups" }, { status: 500 })
    }

    return NextResponse.json({ groups })
  } catch (error) {
    console.error("Error in study groups API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { name, description, category, level, topics, meeting_schedule, max_members, requirements } = body

    const groupData = {
      name,
      description,
      category,
      level,
      topics,
      meeting_schedule,
      max_members,
      requirements,
      moderator_id: user.id,
      status: "active",
      created_at: new Date().toISOString(),
    }

    const { data: group, error } = await supabase.from("study_groups").insert([groupData]).select().single()

    if (error) {
      console.error("Error creating study group:", error)
      return NextResponse.json({ error: "Failed to create study group" }, { status: 500 })
    }

    // Add creator as first member
    await supabase.from("group_members").insert([
      {
        group_id: group.id,
        user_id: user.id,
        role: "moderator",
        joined_at: new Date().toISOString(),
      },
    ])

    return NextResponse.json({ group }, { status: 201 })
  } catch (error) {
    console.error("Error in create study group API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
