'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Trash2, ShoppingCart } from 'lucide-react'

// Simple in-memory cart for POC — in production this would use DB/context
export default function CartPage() {
  const router = useRouter()
  const [items] = useState([
    { id: '1', partNumber: 'PAI-131643', description: 'Cummins ISX Cylinder Head Gasket', qty: 2 },
    { id: '2', partNumber: 'PAI-196580', description: 'Meritor Air Cam Brake Repair Kit', qty: 1 },
  ])
  const [notes, setNotes] = useState('')
  const [fulfillment, setFulfillment] = useState<'pickup' | 'ship'>('pickup')
  const [address, setAddress] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [quantities, setQuantities] = useState<Record<string, number>>(
    Object.fromEntries(items.map(i => [i.id, i.qty]))
  )

  const handleSubmit = async () => {
    setSubmitting(true)
    // Simulate order creation
    await new Promise(r => setTimeout(r, 1000))
    router.push('/orders/demo/confirmation')
  }

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <ShoppingCart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-700 mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-6">Browse parts and add them to your order.</p>
        <Link href="/inventory" className="bg-[#1B3A6B] text-white px-6 py-2 rounded-md hover:bg-[#2E6DB4] transition-colors">
          Browse Parts
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-[#1B3A6B] mb-6">Your Order</h1>

      <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-100 mb-6">
        {items.map(item => (
          <div key={item.id} className="p-4 flex items-center gap-4">
            <div className="flex-1">
              <p className="text-xs font-mono text-[#2E6DB4]">{item.partNumber}</p>
              <p className="text-sm font-medium text-gray-900 mt-0.5">{item.description}</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setQuantities(q => ({ ...q, [item.id]: Math.max(1, q[item.id] - 1) }))}
                className="w-7 h-7 rounded border border-gray-300 text-gray-600 hover:bg-gray-50 flex items-center justify-center text-sm"
              >−</button>
              <span className="w-8 text-center text-sm font-medium">{quantities[item.id]}</span>
              <button
                onClick={() => setQuantities(q => ({ ...q, [item.id]: q[item.id] + 1 }))}
                className="w-7 h-7 rounded border border-gray-300 text-gray-600 hover:bg-gray-50 flex items-center justify-center text-sm"
              >+</button>
            </div>
            <button className="p-1.5 text-gray-400 hover:text-red-500 transition-colors">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Order Notes (optional)</label>
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            rows={3}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E6DB4]"
            placeholder="Urgency, vehicle info, special requirements…"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Fulfillment Method</label>
          <div className="space-y-2">
            {([['pickup', 'Will Call (Pickup at Mauricetown)'], ['ship', 'PAI Direct Ship to my address']] as const).map(([val, label]) => (
              <label key={val} className="flex items-center gap-3 p-3 border rounded-md cursor-pointer hover:bg-gray-50">
                <input type="radio" name="fulfillment" value={val} checked={fulfillment === val} onChange={() => setFulfillment(val)} />
                <span className="text-sm">{label}</span>
              </label>
            ))}
          </div>
        </div>

        {fulfillment === 'ship' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ship-to Address</label>
            <textarea
              value={address}
              onChange={e => setAddress(e.target.value)}
              rows={2}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E6DB4]"
              placeholder="123 Depot Rd, Vineland, NJ 08361"
            />
          </div>
        )}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-sm text-[#1B3A6B]">
        <strong>No prices shown</strong> — this is a quote-based order. Our team will review your order and send you pricing within 1 business day.
      </div>

      <div className="flex gap-3 justify-end">
        <Link href="/inventory" className="px-6 py-2 border border-gray-300 rounded-md text-sm text-gray-600 hover:bg-gray-50 transition-colors">
          Continue Shopping
        </Link>
        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="bg-[#1B3A6B] text-white px-8 py-2 rounded-md text-sm font-semibold hover:bg-[#2E6DB4] transition-colors disabled:opacity-60"
        >
          {submitting ? 'Submitting…' : 'Submit Order'}
        </button>
      </div>
    </div>
  )
}
