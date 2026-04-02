import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies })
  await supabase.auth.signOut()

  const requestUrl = new URL(request.url)
  return NextResponse.redirect(new URL('/', requestUrl.origin))
}
