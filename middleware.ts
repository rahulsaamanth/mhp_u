import { NextRequest, NextResponse } from "next/server"
import { auth } from "./auth"

export default async function middleware(request: NextRequest) {
  const session = await auth()
  const { nextUrl } = request

  if (
    nextUrl.pathname.startsWith("/_next") || // System files
    nextUrl.pathname.startsWith("/api") || // API routes
    nextUrl.pathname.startsWith("/static") || // Static files
    nextUrl.pathname.includes(".") || // Files with extensions
    nextUrl.pathname.startsWith("/login") // Login page itself
  ) {
    return NextResponse.next()
  }

  // if (!session?.user) {
  //   const encodedCallbackUrl = encodeURIComponent(nextUrl.pathname)
  //   return NextResponse.redirect(
  //     new URL(`/login?callbackUrl=${encodedCallbackUrl}`, nextUrl)
  //   )
  // }

  return NextResponse.next()
}

export const config = {
  matcher: [
    // Match all paths except static files, api routes for non-auth, images, etc.
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
