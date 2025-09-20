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

    const groupId = params.id

    // Check if user is already a member
    const { data: existingMember } = await supabase
      .from("group_members")
      .select("id")
      .eq("group_id", groupId)
      .eq("user_id", user.id)
      .single()

    if (existingMember) {
      return NextResponse.json({ error: "Already a member of this group" }, { status: 400 })
    }

    // Check group capacity
    const { data: group } = await supabase
      .from("study_groups")
      .select("max_members, members:group_members(count)")
      .eq("id", groupId)
      .single()

    if (group && group.max_members && group.members[0].count >= group.max_members) {
      return NextResponse.json({ error: "Group is full" }, { status: 400 })
    }

    // Add user to group
    const { data: membership, error } = await supabase
      .from("group_members")
      .insert([
        {
          group_id: groupId,
          user_id: user.id,
          role: "member",
          joined_at: new Date().toISOString(),
        },
      ])
      .select()
      .single()

    if (error) {
      console.error("Error joining study group:", error)
      return NextResponse.json({ error: "Failed to join study group" }, { status: 500 })
    }

    return NextResponse.json({ membership }, { status: 201 })
  } catch (error) {
    console.error("Error in join study group API:", error)
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

    const groupId = params.id

    const { error } = await supabase.from("group_members").delete().eq("group_id", groupId).eq("user_id", user.id)

    if (error) {
      console.error("Error leaving study group:", error)
      return NextResponse.json({ error: "Failed to leave study group" }, { status: 500 })
    }

    return NextResponse.json({ message: "Successfully left study group" })
  } catch (error) {
    console.error("Error in leave study group API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
