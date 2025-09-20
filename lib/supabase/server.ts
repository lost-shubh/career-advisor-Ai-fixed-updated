import { createClient as createSupabaseClient } from "@supabase/supabase-js"
import { cookies } from "next/headers"

export async function createClient() {
  const cookieStore = await cookies()

  // Get the auth token from cookies if available
  const authToken = cookieStore.get("sb-access-token")?.value

  const supabase = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    },
  )

  // Set the auth token if available
  if (authToken) {
    supabase.auth.setSession({
      access_token: authToken,
      refresh_token: cookieStore.get("sb-refresh-token")?.value || "",
    })
  }

  return supabase
}
