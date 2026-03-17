'use client'

import { useState } from 'react'
import Link from 'next/link'
import { AlertTriangle, CheckCircle2 } from 'lucide-react'

const UNIT_COST: Record<string, number> = { 'PAI-131643': 125.00, 'PAI-196580': 165.00, 'PAI-430500': 210.00, 'PAI-430200': 88.00 }
const MARGIN_TARGET = 1.43

const DEMO_ITEMS = [
  { id: '1', partNumber: 'PAI-131643', description: 'Cummins ISX Cylinder Head Gasket', qty: 2 },
  { id: '2', partNumber: 'PAI-196580', description: 'Meritor Air Cam Brake Repair Kit', qty: 1 },
]

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function AdminQuotePage(_props: { params: { id: string } }) {
  const [prices, setPrices] = useState<Record<string, string>>({})
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const getRecommended = (pn: string) => {
    const cost = UNIT_COST[pn] ?? 100
    return cost * MARGIN_TARGET
  }

  const getMargin = (pn: string, price: string) => {
    const cost = UNIT_COST[pn] ?? 100
    const p = parseFloat(price)
    if (!p) return null
    return ((p - cost) / p) * 100
  }

  const isBelowMin = (pn: string, price: string) => {
    const recommended = getRecommended(pn)
    const p = parseFloat(price)
    return p > 0 && p < recommended * 0.85
  }

  const handleSubmitQuote = async () => {
    setSubmitting(true)
    await new Promise(r => setTimeout(r, 1000))
    setSubmitted(true)
    setSubmitting(false)
  }

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <CheckCircle2 className="h-14 w-14 text-green-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-[#1B3A6B] mb-2">Quote Submitted</h1>
        <p className="text-gray-500 mb-6">The customer has been notified and can now approve or reject the quote.</p>
        <Link href="/admin/orders" className="bg-[#1B3A6B] text-white px-6 py-2 rounded-md hover:bg-[#2E6DB4] transition-colors text-sm font-medium">
          Back to Order Queue
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link href="/admin/orders" className="text-sm text-[#2E6DB4] hover:underline mb-2 block">← Order Queue</Link>
      <h1 className="text-2xl font-bold text-[#1B3A6B] mb-1">Build Quote</h1>
      <p className="text-sm text-gray-500 mb-6">MT-2026-00001 · John Smith · Smith Trucking LLC</p>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden mb-6">
        <div className="grid grid-cols-5 gap-3 px-6 py-3 bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
          <span className="col-span-2">Part</span>
          <span>Qty</span>
          <span>Recommended</span>
          <span>Your Price</span>
        </div>

        {DEMO_ITEMS.map(item => {
          const rec = getRecommended(item.partNumber)
          const price = prices[item.id] ?? ''
          const margin = getMargin(item.partNumber, price)
          const belowMin = isBelowMin(item.partNumber, price)

          return (
            <div key={item.id} className="px-6 py-4 border-b border-gray-100">
              <div className="grid grid-cols-5 gap-3 items-center">
                <div className="col-span-2">
                  <p className="text-xs font-mono text-[#2E6DB4]">{item.partNumber}</p>
                  <p className="text-sm text-gray-900">{item.description}</p>
                </div>
                <span className="text-sm font-medium">{item.qty}</span>
                <span className="text-sm text-gray-600">${rec.toFixed(2)}</span>
                <div>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-gray-400 text-sm">$</span>
                    <input
                      type="number"
                      step="0.01"
                      value={price}
                      onChange={e => setPrices(p => ({ ...p, [item.id]: e.target.value }))}
                      className={`w-full pl-6 pr-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-[#2E6DB4] ${
                        belowMin ? 'border-red-400 bg-red-50' : 'border-gray-300'
                      }`}
                      placeholder="0.00"
                    />
                  </div>
                  {margin !== null && (
                    <p className={`text-xs mt-1 ${margin < 20 ? 'text-red-600' : 'text-green-600'}`}>
                      {margin.toFixed(1)}% margin
                    </p>
                  )}
                </div>
              </div>
              {belowMin && (
                <div className="mt-2 flex items-center gap-1.5 text-xs text-red-600 bg-red-50 border border-red-200 rounded px-3 py-1.5">
                  <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                  Price is more than 15% below recommended — verify before submitting.
                </div>
              )}
            </div>
          )
        })}

        {Object.keys(prices).length > 0 && (
          <div className="px-6 py-4 bg-gray-50">
            <div className="flex justify-between text-sm font-semibold">
              <span>Quote Total</span>
              <span>
                ${DEMO_ITEMS.reduce((sum, item) => {
                  const p = parseFloat(prices[item.id] ?? '0')
                  return sum + (p * item.qty)
                }, 0).toFixed(2)}
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-3 justify-end">
        <Link href="/admin/orders" className="px-6 py-2 border border-gray-300 rounded-md text-sm text-gray-600 hover:bg-gray-50 transition-colors">
          Cancel
        </Link>
        <button
          onClick={handleSubmitQuote}
          disabled={submitting || DEMO_ITEMS.some(i => !prices[i.id])}
          className="bg-[#1B3A6B] text-white px-8 py-2 rounded-md text-sm font-semibold hover:bg-[#2E6DB4] transition-colors disabled:opacity-50"
        >
          {submitting ? 'Submitting…' : 'Submit Quote to Customer'}
        </button>
      </div>
    </div>
  )
}
