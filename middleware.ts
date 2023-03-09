import { NextRequest, NextResponse } from 'next/server'

import { createMiddlewareSupabaseClient } from '@supabase/auth-helpers-nextjs'

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - auth (auth/login, auth/signup route)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!auth|_next/static|_next/image|favicon.ico).*)'
  ]
}

export async function middleware(req: NextRequest) {
  // We need to create a response and hand it to the supabase client to be able to modify the response headers.
  const res = NextResponse.next()

  const supabase = createMiddlewareSupabaseClient({ req, res })

  const {
    data: { user }
  } = await supabase.auth.getUser()

  // Authentication successful, forward request to protected route.
  if (user) return res
  console.log('new request', req.nextUrl.pathname)

  if (req.nextUrl.pathname.includes('/auth')) {
    // If the user is not logged in and is trying to access the login page move to next.
    return NextResponse.rewrite(req.nextUrl.pathname)
  }

  // Invalid session redirect to login page.
  const redirectUrl = req.nextUrl.clone()
  redirectUrl.pathname = '/auth/login'
  redirectUrl.searchParams.set(`redirectedFrom`, req.nextUrl.pathname)
  await supabase.auth.signOut()
  return NextResponse.redirect(redirectUrl)
}
