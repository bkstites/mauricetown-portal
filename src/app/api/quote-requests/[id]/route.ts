import { NextRequest, NextResponse } from 'next/server'
import { getRequestAppUser, isStaffRole } from '@/lib/auth'
import { getQuoteRequestById, updateQuoteRequestById } from '@/lib/quote-store'
import { sendEmail } from '@/lib/email'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const user = await getRequestAppUser()
  if (!user) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
  }

  const row = await getQuoteRequestById(params.id, isStaffRole(user.role) ? undefined : { email: user.email })
  if (!row) {
    return NextResponse.json({ error: 'Quote request not found' }, { status: 404 })
  }
  return NextResponse.json(row)
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getRequestAppUser()
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    if (!isStaffRole(user.role)) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    const body = await req.json()
    const status = body.status ? String(body.status).toUpperCase() : undefined
    const quoteTotal = body.quoteTotal !== undefined && body.quoteTotal !== null
      ? Number(body.quoteTotal)
      : undefined

    const updated = await updateQuoteRequestById(params.id, {
      status: status as 'PENDING' | 'REVIEWING' | 'QUOTED' | 'APPROVED' | 'REJECTED' | undefined,
      quoteTotal: Number.isFinite(quoteTotal) ? quoteTotal : undefined,
      quoteNotes: body.quoteNotes ? String(body.quoteNotes) : undefined,
    })

    if (!updated) {
      return NextResponse.json({ error: 'Quote request not found' }, { status: 404 })
    }

    if (updated.status === 'QUOTED') {
      await sendEmail({
        to: updated.email,
        subject: `Your Quote Is Ready: ${updated.requestNumber}`,
        text: `Your quote is ready.\n\nRequest ID: ${updated.requestNumber}\nQuoted Total: ${updated.quoteTotal ? `$${updated.quoteTotal}` : 'Pending'}\n\nNotes:\n${updated.quoteNotes || 'None'}\n\nPlease sign in to review and approve/reject your quote.`,
      })
    }

    return NextResponse.json(updated)
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
