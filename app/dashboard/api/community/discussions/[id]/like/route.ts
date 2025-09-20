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

    const discussionId = params.id

    // Check if user already liked this discussion
    const { data: existingLike } = await supabase
      .from("discussion_likes")
      .select("id")
      .eq("discussion_id", discussionId)
      .eq("user_id", user.id)
      .single()

    if (existingLike) {
      // Unlike
      await supabase.from("discussion_likes").delete().eq("discussion_id", discussionId).eq("user_id", user.id)

      // Decrement likes count
      await supabase.rpc("decrement_discussion_likes", { discussion_id: discussionId })

      return NextResponse.json({ liked: false })
    } else {
      // Like
      await supabase.from("discussion_likes").insert([
        {
          discussion_id: discussionId,
          user_id: user.id,
          created_at: new Date().toISOString(),
        },
      ])

      // Increment likes count
      await supabase.rpc("increment_discussion_likes", { discussion_id: discussionId })

      return NextResponse.json({ liked: true })
    }
  } catch (error) {
    console.error("Error in discussion like API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
