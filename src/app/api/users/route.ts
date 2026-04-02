import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  try {
    const { email, name, company, phone } = await req.json()

    if (!email || !name) {
      return NextResponse.json({ error: 'Email and name are required' }, { status: 400 })
    }

    const { prisma } = await import('@/lib/prisma')
    const user = await prisma.user.upsert({
      where: { email },
      update: { name, company, phone },
      create: { email, name, company, phone },
    })
    return NextResponse.json(user)
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
