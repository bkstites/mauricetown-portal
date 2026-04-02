import { NextRequest, NextResponse } from 'next/server'
import { getRequestAppUser, isStaffRole } from '@/lib/auth'
import { createQuoteRequest, listQuoteRequests } from '@/lib/quote-store'
import { sendEmail } from '@/lib/email'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET(req: NextRequest) {
  const user = await getRequestAppUser()
  if (!user) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const status = searchParams.get('status')?.toUpperCase() ?? 'ALL'
  const rows = await listQuoteRequests(status, isStaffRole(user.role) ? undefined : { email: user.email })
  return NextResponse.json({ rows })
}

export async function POST(req: NextRequest) {
  try {
    const user = await getRequestAppUser()
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const body = await req.json()

    const requiredFields = ['contactName', 'shopName', 'partsNeeded', 'repairContext'] as const
    for (const field of requiredFields) {
      if (!body[field] || String(body[field]).trim() === '') {
        return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 })
      }
    }

    const created = await createQuoteRequest({
      contactName: String(body.contactName),
      shopName: String(body.shopName),
      email: user.email,
      phone: body.phone ? String(body.phone) : '',
      vehicleYear: body.vehicleYear ? String(body.vehicleYear) : '',
      vehicleMake: body.vehicleMake ? String(body.vehicleMake) : '',
      vehicleModel: body.vehicleModel ? String(body.vehicleModel) : '',
      vin: body.vin ? String(body.vin) : '',
      engineModel: body.engineModel ? String(body.engineModel) : '',
      urgency: body.urgency ? String(body.urgency) : 'same_week',
      neededBy: body.neededBy ? String(body.neededBy) : '',
      preferredCondition: body.preferredCondition ? String(body.preferredCondition) : 'any',
      deliveryMethod: body.deliveryMethod ? String(body.deliveryMethod) : 'pickup',
      partsNeeded: String(body.partsNeeded),
      repairContext: String(body.repairContext),
    })

    const contactEmail = created.email
    const internalEmail = process.env.QUOTE_INBOX_EMAIL || 'mauricetowntruckrepair@gmail.com'

    await Promise.allSettled([
      sendEmail({
        to: contactEmail,
        subject: `Quote Request Received: ${created.requestNumber}`,
        text: `Thanks for your request.\n\nRequest ID: ${created.requestNumber}\nShop: ${created.shopName}\n\nOur team will review and respond by email with a finalized quote.`,
      }),
      sendEmail({
        to: internalEmail,
        subject: `New Quote Request: ${created.requestNumber}`,
        text: `New request submitted.\n\nRequest ID: ${created.requestNumber}\nContact: ${created.contactName}\nEmail: ${created.email}\nShop: ${created.shopName}\nUrgency: ${created.urgency}\n\nParts Needed:\n${created.partsNeeded}\n\nRepair Context:\n${created.repairContext}`,
      }),
    ])

    return NextResponse.json(created, { status: 201 })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
