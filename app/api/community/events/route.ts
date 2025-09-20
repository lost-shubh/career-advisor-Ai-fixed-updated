import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient()
    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type") // upcoming, past, all
    const category = searchParams.get("category")

    let query = supabase
      .from("community_events")
      .select(`
        *,
        organizer:profiles(full_name, avatar_url),
        registrations:event_registrations(count)
      `)
      .order("event_date", { ascending: true })

    if (type === "upcoming") {
      query = query.gte("event_date", new Date().toISOString())
    } else if (type === "past") {
      query = query.lt("event_date", new Date().toISOString())
    }

    if (category) {
      query = query.contains("tags", [category])
    }

    const { data: events, error } = await query

    if (error) {
      console.error("Error fetching events:", error)
      return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 })
    }

    return NextResponse.json({ events })
  } catch (error) {
    console.error("Error in events API:", error)
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
    const { title, description, event_date, event_time, type, location, max_attendees, tags, requirements } = body

    const eventData = {
      title,
      description,
      event_date,
      event_time,
      type,
      location,
      max_attendees,
      tags,
      requirements,
      organizer_id: user.id,
      status: "active",
      created_at: new Date().toISOString(),
    }

    const { data: event, error } = await supabase.from("community_events").insert([eventData]).select().single()

    if (error) {
      console.error("Error creating event:", error)
      return NextResponse.json({ error: "Failed to create event" }, { status: 500 })
    }

    return NextResponse.json({ event }, { status: 201 })
  } catch (error) {
    console.error("Error in create event API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
