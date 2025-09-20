import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const eventId = params.id

    // Check if user is already registered
    const { data: existingRegistration } = await supabase
      .from("event_registrations")
      .select("id")
      .eq("event_id", eventId)
      .eq("user_id", user.id)
      .single()

    if (existingRegistration) {
      return NextResponse.json({ error: "Already registered for this event" }, { status: 400 })
    }

    // Check event capacity
    const { data: event } = await supabase
      .from("community_events")
      .select("max_attendees, registrations:event_registrations(count)")
      .eq("id", eventId)
      .single()

    if (event && event.max_attendees && event.registrations[0].count >= event.max_attendees) {
      return NextResponse.json({ error: "Event is full" }, { status: 400 })
    }

    // Register user for event
    const { data: registration, error } = await supabase
      .from("event_registrations")
      .insert([
        {
          event_id: eventId,
          user_id: user.id,
          registered_at: new Date().toISOString(),
          status: "confirmed",
        },
      ])
      .select()
      .single()

    if (error) {
      console.error("Error registering for event:", error)
      return NextResponse.json({ error: "Failed to register for event" }, { status: 500 })
    }

    return NextResponse.json({ registration }, { status: 201 })
  } catch (error) {
    console.error("Error in event registration API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const eventId = params.id

    const { error } = await supabase.from("event_registrations").delete().eq("event_id", eventId).eq("user_id", user.id)

    if (error) {
      console.error("Error unregistering from event:", error)
      return NextResponse.json({ error: "Failed to unregister from event" }, { status: 500 })
    }

    return NextResponse.json({ message: "Successfully unregistered from event" })
  } catch (error) {
    console.error("Error in event unregistration API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
