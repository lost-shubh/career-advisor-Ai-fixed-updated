import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient()
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const sortBy = searchParams.get("sort") || "recent" // recent, popular, unanswered

    let query = supabase.from("community_discussions").select(`
        *,
        author:profiles!community_discussions_author_id_fkey(full_name, avatar_url),
        replies:discussion_replies(count),
        likes:discussion_likes(count)
      `)

    if (category) {
      query = query.eq("category", category)
    }

    // Apply sorting
    switch (sortBy) {
      case "popular":
        query = query.order("likes_count", { ascending: false })
        break
      case "unanswered":
        query = query.eq("replies_count", 0).order("created_at", { ascending: false })
        break
      default:
        query = query.order("created_at", { ascending: false })
    }

    const { data: discussions, error } = await query

    if (error) {
      console.error("Error fetching discussions:", error)
      return NextResponse.json({ error: "Failed to fetch discussions" }, { status: 500 })
    }

    return NextResponse.json({ discussions })
  } catch (error) {
    console.error("Error in discussions API:", error)
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
    const { title, content, category, tags } = body

    const discussionData = {
      title,
      content,
      category,
      tags,
      author_id: user.id,
      created_at: new Date().toISOString(),
      likes_count: 0,
      replies_count: 0,
    }

    const { data: discussion, error } = await supabase
      .from("community_discussions")
      .insert([discussionData])
      .select(`
        *,
        author:profiles!community_discussions_author_id_fkey(full_name, avatar_url)
      `)
      .single()

    if (error) {
      console.error("Error creating discussion:", error)
      return NextResponse.json({ error: "Failed to create discussion" }, { status: 500 })
    }

    return NextResponse.json({ discussion }, { status: 201 })
  } catch (error) {
    console.error("Error in create discussion API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
