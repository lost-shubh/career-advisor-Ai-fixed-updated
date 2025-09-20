import { NextResponse, type NextRequest } from "next/server"

export async function updateSession(request: NextRequest) {
  const response = NextResponse.next({
    request,
  })

  // Simple auth check - redirect to login if accessing protected routes without auth
  const isProtectedRoute = request.nextUrl.pathname.startsWith("/dashboard")
  const hasAuthCookie = request.cookies.has("sb-access-token")

  if (isProtectedRoute && !hasAuthCookie) {
    const url = request.nextUrl.clone()
    url.pathname = "/auth/login"
    return NextResponse.redirect(url)
  }

  return response
}
