import { NextFetchEvent, NextRequest, NextResponse } from 'next/server'

import { createMiddlewareSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

/**
 * Rate limit SDK example.
 * @see https://github.com/upstash/ratelimit/blob/main/examples/nextjs/middleware.ts
 */
const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.cachedFixedWindow(10, '10 s'),
  timeout: 5000, // 5 seconds
  ephemeralCache: new Map(),
  analytics: true
})

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

export async function middleware(
  req: NextRequest,
  event: NextFetchEvent
): Promise<Response | undefined> {
  const ip = req.ip ?? '127.0.0.1'
  const { success, pending, limit, reset, remaining } = await ratelimit.limit(
    `ratelimit_middleware_${ip}`
  )
  event.waitUntil(pending)

  // If the request is rate limited, return a 429 response.
  const res = success
    ? NextResponse.next()
    : NextResponse.redirect(new URL('/api/blocked', req.url))
  res.headers.set('X-RateLimit-Limit', limit.toString())
  res.headers.set('X-RateLimit-Remaining', remaining.toString())
  res.headers.set('X-RateLimit-Reset', reset.toString())

  // now we pass response to the supabase client further header modifications
  const supabase = createMiddlewareSupabaseClient({ req, res })

  const {
    data: { user }
  } = await supabase.auth.getUser()

  // Authentication successful, forward request to protected route.
  if (user) return res

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
