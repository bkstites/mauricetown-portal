'use client'

import { useState } from 'react'
import Link from 'next/link'
import { CheckCircle2, XCircle } from 'lucide-react'

const STATUS_STYLES: Record<string, string> = {
  PENDING: 'bg-amber-100 text-amber-700 border-amber-200',
  REVIEWING: 'bg-blue-100 text-blue-700 border-blue-200',
  QUOTED: 'bg-purple-100 text-purple-700 border-purple-200',
  APPROVED: 'bg-green-100 text-green-700 border-green-200',
  REJECTED: 'bg-red-100 text-red-700 border-red-200',
}

const DEMO_ORDER = {
  orderNumber: 'MT-2026-00001',
  status: 'QUOTED',
  date: '2026-03-14',
  quotedAt: '2026-03-15',
  expiresAt: '2026-03-22',
  items: [
    { partNumber: 'PAI-131643', description: 'Cummins ISX Cylinder Head Gasket', qty: 2, unitPrice: 187.50 },
    { partNumber: 'PAI-196580', description: 'Meritor Air Cam Brake Repair Kit', qty: 1, unitPrice: 243.00 },
  ],
  tax: 0.06625,
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function OrderDetailPage(_props: { params: { id: string } }) {
  const [status, setStatus] = useState(DEMO_ORDER.status)
  const [acting, setActing] = useState(false)

  const subtotal = DEMO_ORDER.items.reduce((a, i) => a + i.unitPrice * i.qty, 0)
  const taxAmt = subtotal * DEMO_ORDER.tax
  const total = subtotal + taxAmt

  const handleApprove = async () => {
    setActing(true)
    await new Promise(r => setTimeout(r, 800))
    setStatus('APPROVED')
    setActing(false)
  }

  const handleReject = async () => {
    setActing(true)
    await new Promise(r => setTimeout(r, 800))
    setStatus('REJECTED')
    setActing(false)
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <Link href="/orders" className="text-sm text-[#2E6DB4] hover:underline mb-1 block">← My Orders</Link>
          <h1 className="text-2xl font-bold text-[#1B3A6B]">{DEMO_ORDER.orderNumber}</h1>
        </div>
        <span className={`text-sm font-medium px-3 py-1 rounded border ${STATUS_STYLES[status]}`}>{status}</span>
      </div>

      {/* Order details */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm mb-4">
          <div><p className="text-gray-500">Submitted</p><p className="font-medium">{new Date(DEMO_ORDER.date).toLocaleDateString()}</p></div>
          <div><p className="text-gray-500">Items</p><p className="font-medium">{DEMO_ORDER.items.length} parts</p></div>
        </div>
        <div className="border-t pt-4">
          <p className="text-sm font-medium text-gray-700 mb-3">Parts Ordered</p>
          <div className="space-y-2">
            {DEMO_ORDER.items.map(item => (
              <div key={item.partNumber} className="flex justify-between text-sm">
                <span><span className="font-mono text-[#2E6DB4]">{item.partNumber}</span> — {item.description}</span>
                <span className="text-gray-500 ml-3">×{item.qty}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quote panel */}
      {status === 'QUOTED' && (
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-purple-900">Quote Ready for Review</h2>
            <span className="text-xs text-purple-600 bg-purple-100 border border-purple-200 px-2 py-1 rounded">
              Expires {new Date(DEMO_ORDER.expiresAt).toLocaleDateString()}
            </span>
          </div>

          <div className="divide-y divide-purple-200 mb-4">
            {DEMO_ORDER.items.map(item => (
              <div key={item.partNumber} className="py-3 flex justify-between text-sm">
                <div>
                  <p className="font-mono text-[#2E6DB4] text-xs">{item.partNumber}</p>
                  <p className="text-gray-800">{item.description} ×{item.qty}</p>
                </div>
                <p className="font-medium text-gray-900">${(item.unitPrice * item.qty).toFixed(2)}</p>
              </div>
            ))}
          </div>

          <div className="border-t border-purple-200 pt-3 space-y-1 text-sm">
            <div className="flex justify-between text-gray-600"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
            <div className="flex justify-between text-gray-600"><span>NJ Sales Tax (6.625%)</span><span>${taxAmt.toFixed(2)}</span></div>
            <div className="flex justify-between font-bold text-gray-900 text-base pt-1 border-t border-purple-200">
              <span>Total</span><span>${total.toFixed(2)}</span>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={handleApprove}
              disabled={acting}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-md transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="h-4 w-4" />
              {acting ? 'Processing…' : 'Approve Quote'}
            </button>
            <button
              onClick={handleReject}
              disabled={acting}
              className="flex-1 border border-red-300 text-red-600 hover:bg-red-50 font-medium py-2 rounded-md transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
            >
              <XCircle className="h-4 w-4" />
              Reject
            </button>
          </div>
        </div>
      )}

      {status === 'APPROVED' && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
          <CheckCircle2 className="h-10 w-10 text-green-500 mx-auto mb-2" />
          <h2 className="font-semibold text-green-800 mb-1">Quote Approved</h2>
          <p className="text-sm text-green-700">Our team has been notified and will proceed with your order.</p>
        </div>
      )}

      {status === 'REJECTED' && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <XCircle className="h-10 w-10 text-red-400 mx-auto mb-2" />
          <h2 className="font-semibold text-red-800 mb-1">Quote Rejected</h2>
          <p className="text-sm text-red-700">Please contact us if you&apos;d like to discuss alternative pricing.</p>
        </div>
      )}
    </div>
  )
}
