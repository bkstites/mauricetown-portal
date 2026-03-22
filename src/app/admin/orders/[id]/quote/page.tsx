'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { CheckCircle2 } from 'lucide-react'

type QuoteRequest = {
  id: string
  requestNumber: string
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
  status: 'PENDING' | 'REVIEWING' | 'QUOTED' | 'APPROVED' | 'REJECTED'
  quoteTotal: string | null
  quoteNotes: string | null
  createdAt: string
}

export default function AdminQuotePage({ params }: { params: { id: string } }) {
  const [row, setRow] = useState<QuoteRequest | null>(null)
  const [quoteTotal, setQuoteTotal] = useState('')
  const [quoteNotes, setQuoteNotes] = useState('')
  const [status, setStatus] = useState<'PENDING' | 'REVIEWING' | 'QUOTED' | 'APPROVED' | 'REJECTED'>('REVIEWING')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      const res = await fetch(`/api/quote-requests/${params.id}`)
      if (!res.ok) {
        setError('Unable to load quote request')
        setLoading(false)
        return
      }
      const payload = await res.json()
      setRow(payload)
      setStatus(payload.status)
      setQuoteTotal(payload.quoteTotal || '')
      setQuoteNotes(payload.quoteNotes || '')
      setLoading(false)
    }
    load()
  }, [params.id])

  const submitQuote = async () => {
    if (!row) {
      return
    }

    setSubmitting(true)
    setError('')

    const res = await fetch(`/api/quote-requests/${row.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        status,
        quoteTotal: quoteTotal ? Number(quoteTotal) : undefined,
        quoteNotes,
      }),
    })

    if (!res.ok) {
      const payload = await res.json()
      setError(payload.error || 'Unable to update quote')
      setSubmitting(false)
      return
    }

    const payload = await res.json()
    setRow(payload)
    setSaved(true)
    setSubmitting(false)
  }

  if (loading) {
    return <div className="max-w-3xl mx-auto px-4 py-10 text-sm text-gray-500">Loading request...</div>
  }

  if (!row) {
    return <div className="max-w-3xl mx-auto px-4 py-10 text-sm text-red-600">Request not found.</div>
  }

  if (saved && status === 'QUOTED') {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <CheckCircle2 className="h-14 w-14 text-green-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-[#1B3A6B] mb-2">Quote Submitted</h1>
        <p className="text-gray-500 mb-2">Customer email has been triggered for quote delivery.</p>
        <p className="text-sm text-gray-500 mb-6">{row.requestNumber} · {row.email}</p>
        <Link href="/admin/orders" className="bg-[#1B3A6B] text-white px-6 py-2 rounded-md hover:bg-[#2E6DB4] transition-colors text-sm font-medium">
          Back to Associate Queue
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link href="/admin/orders" className="text-sm text-[#2E6DB4] hover:underline mb-2 block">← Associate Queue</Link>
      <h1 className="text-2xl font-bold text-[#1B3A6B] mb-1">Review Quote Request</h1>
      <p className="text-sm text-gray-500 mb-6">{row.requestNumber} · {row.contactName} · {row.shopName}</p>

      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6 space-y-5">
        <section>
          <h2 className="font-semibold text-[#1B3A6B] mb-2">Request Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
            <p><span className="text-gray-500">Email:</span> {row.email}</p>
            <p><span className="text-gray-500">Phone:</span> {row.phone || 'N/A'}</p>
            <p><span className="text-gray-500">Urgency:</span> {row.urgency}</p>
            <p><span className="text-gray-500">Vehicle:</span> {[row.vehicleYear, row.vehicleMake, row.vehicleModel].filter(Boolean).join(' ') || 'N/A'}</p>
            <p><span className="text-gray-500">VIN:</span> {row.vin || 'N/A'}</p>
            <p><span className="text-gray-500">Engine:</span> {row.engineModel || 'N/A'}</p>
          </div>
        </section>

        <section>
          <h3 className="text-sm font-semibold text-gray-700 mb-1">Parts Needed</h3>
          <p className="text-sm text-gray-700 whitespace-pre-wrap">{row.partsNeeded}</p>
        </section>

        <section>
          <h3 className="text-sm font-semibold text-gray-700 mb-1">Repair Context</h3>
          <p className="text-sm text-gray-700 whitespace-pre-wrap">{row.repairContext}</p>
        </section>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
        <h2 className="font-semibold text-[#1B3A6B]">Associate Quote Actions</h2>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select
            value={status}
            onChange={e => setStatus(e.target.value as typeof status)}
            className="w-full md:w-72 border border-gray-300 rounded-md px-3 py-2 text-sm"
          >
            <option value="PENDING">PENDING</option>
            <option value="REVIEWING">REVIEWING</option>
            <option value="QUOTED">QUOTED</option>
            <option value="APPROVED">APPROVED</option>
            <option value="REJECTED">REJECTED</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Quoted Total (USD)</label>
          <input
            value={quoteTotal}
            onChange={e => setQuoteTotal(e.target.value)}
            type="number"
            step="0.01"
            className="w-full md:w-72 border border-gray-300 rounded-md px-3 py-2 text-sm"
            placeholder="0.00"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Quote Notes</label>
          <textarea
            value={quoteNotes}
            onChange={e => setQuoteNotes(e.target.value)}
            rows={4}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            placeholder="Include fitment assumptions, lead times, and quote validity."
          />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="flex justify-end">
          <button
            onClick={submitQuote}
            disabled={submitting}
            className="bg-[#1B3A6B] text-white px-6 py-2 rounded-md text-sm font-semibold hover:bg-[#2E6DB4] transition-colors disabled:opacity-50"
          >
            {submitting ? 'Saving…' : 'Save / Send Update'}
          </button>
        </div>
      </div>
    </div>
  )
}
