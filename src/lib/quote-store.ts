import { prisma } from '@/lib/prisma'

export type QuoteRequestInput = {
  contactName: string
  shopName: string
  email: string
  phone?: string
  vehicleYear?: string
  vehicleMake?: string
  vehicleModel?: string
  vin?: string
  engineModel?: string
  urgency: string
  neededBy?: string
  preferredCondition: string
  deliveryMethod: string
  partsNeeded: string
  repairContext: string
}

type QuoteStatus = 'PENDING' | 'REVIEWING' | 'QUOTED' | 'APPROVED' | 'REJECTED'

type QuoteRequestRecord = QuoteRequestInput & {
  id: string
  requestNumber: string
  status: QuoteStatus
  quoteTotal: string | null
  quoteNotes: string | null
  quotedAt: string | null
  createdAt: string
}

type QuoteRequestPatch = {
  status?: QuoteStatus
  quoteTotal?: number
  quoteNotes?: string
}

const memoryKey = '__mt_quote_requests__'

function getMemoryStore(): QuoteRequestRecord[] {
  const g = globalThis as typeof globalThis & { [memoryKey]?: QuoteRequestRecord[] }
  if (!g[memoryKey]) {
    g[memoryKey] = []
  }
  return g[memoryKey]!
}

function generateRequestNumber() {
  const date = new Date()
  const y = date.getFullYear().toString().slice(-2)
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  const n = String(Date.now()).slice(-5)
  return `MTQ-${y}${m}${d}-${n}`
}

function serializeDbRecord(record: {
  id: string
  requestNumber: string
  contactName: string
  shopName: string
  email: string
  phone: string | null
  vehicleYear: string | null
  vehicleMake: string | null
  vehicleModel: string | null
  vin: string | null
  engineModel: string | null
  urgency: string
  neededBy: string | null
  preferredCondition: string
  deliveryMethod: string
  partsNeeded: string
  repairContext: string
  status: string
  quoteTotal: { toString(): string } | null
  quoteNotes: string | null
  quotedAt: Date | null
  createdAt: Date
}): QuoteRequestRecord {
  return {
    id: record.id,
    requestNumber: record.requestNumber,
    contactName: record.contactName,
    shopName: record.shopName,
    email: record.email,
    phone: record.phone ?? '',
    vehicleYear: record.vehicleYear ?? '',
    vehicleMake: record.vehicleMake ?? '',
    vehicleModel: record.vehicleModel ?? '',
    vin: record.vin ?? '',
    engineModel: record.engineModel ?? '',
    urgency: record.urgency,
    neededBy: record.neededBy ?? '',
    preferredCondition: record.preferredCondition,
    deliveryMethod: record.deliveryMethod,
    partsNeeded: record.partsNeeded,
    repairContext: record.repairContext,
    status: record.status as QuoteStatus,
    quoteTotal: record.quoteTotal ? record.quoteTotal.toString() : null,
    quoteNotes: record.quoteNotes,
    quotedAt: record.quotedAt ? record.quotedAt.toISOString() : null,
    createdAt: record.createdAt.toISOString(),
  }
}

export async function createQuoteRequest(input: QuoteRequestInput): Promise<QuoteRequestRecord> {
  const requestNumber = generateRequestNumber()

  try {
    const created = await prisma.quoteRequest.create({
      data: {
        requestNumber,
        contactName: input.contactName,
        shopName: input.shopName,
        email: input.email,
        phone: input.phone,
        vehicleYear: input.vehicleYear,
        vehicleMake: input.vehicleMake,
        vehicleModel: input.vehicleModel,
        vin: input.vin,
        engineModel: input.engineModel,
        urgency: input.urgency,
        neededBy: input.neededBy,
        preferredCondition: input.preferredCondition,
        deliveryMethod: input.deliveryMethod,
        partsNeeded: input.partsNeeded,
        repairContext: input.repairContext,
      },
    })
    return serializeDbRecord(created)
  } catch {
    const record: QuoteRequestRecord = {
      id: `mem-${Date.now()}`,
      requestNumber,
      ...input,
      status: 'PENDING',
      quoteTotal: null,
      quoteNotes: null,
      quotedAt: null,
      createdAt: new Date().toISOString(),
    }
    const store = getMemoryStore()
    store.unshift(record)
    return record
  }
}

export async function listQuoteRequests(status?: string): Promise<QuoteRequestRecord[]> {
  try {
    const rows = await prisma.quoteRequest.findMany({
      where: status && status !== 'ALL' ? { status: status as QuoteStatus } : undefined,
      orderBy: { createdAt: 'desc' },
    })
    return rows.map(serializeDbRecord)
  } catch {
    const store = getMemoryStore()
    if (!status || status === 'ALL') {
      return store
    }
    return store.filter(r => r.status === status)
  }
}

export async function getQuoteRequestById(id: string): Promise<QuoteRequestRecord | null> {
  try {
    const row = await prisma.quoteRequest.findUnique({ where: { id } })
    return row ? serializeDbRecord(row) : null
  } catch {
    const store = getMemoryStore()
    return store.find(r => r.id === id) ?? null
  }
}

export async function updateQuoteRequestById(id: string, patch: QuoteRequestPatch): Promise<QuoteRequestRecord | null> {
  try {
    const updated = await prisma.quoteRequest.update({
      where: { id },
      data: {
        status: patch.status,
        quoteTotal: typeof patch.quoteTotal === 'number' ? patch.quoteTotal : undefined,
        quoteNotes: patch.quoteNotes,
        quotedAt: patch.status === 'QUOTED' ? new Date() : undefined,
      },
    })
    return serializeDbRecord(updated)
  } catch {
    const store = getMemoryStore()
    const idx = store.findIndex(r => r.id === id)
    if (idx === -1) {
      return null
    }

    const existing = store[idx]
    const next: QuoteRequestRecord = {
      ...existing,
      status: (patch.status ?? existing.status) as QuoteStatus,
      quoteTotal: typeof patch.quoteTotal === 'number' ? patch.quoteTotal.toFixed(2) : existing.quoteTotal,
      quoteNotes: patch.quoteNotes ?? existing.quoteNotes,
      quotedAt: patch.status === 'QUOTED' ? new Date().toISOString() : existing.quotedAt,
    }
    store[idx] = next
    return next
  }
}
