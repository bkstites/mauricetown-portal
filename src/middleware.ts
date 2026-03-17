import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  // Refresh session if needed
  try {
    const supabase = createMiddlewareClient({ req, res })
    await supabase.auth.getSession()
  } catch {
    // Supabase not configured — allow all in POC mode
  }
  return res
}

export const config = {
  matcher: ['/inventory/:path*', '/cart/:path*', '/orders/:path*', '/admin/:path*'],
}
