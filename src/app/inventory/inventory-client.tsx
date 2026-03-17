'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Search, ShoppingCart, Package } from 'lucide-react'
import { getAvailabilityBadge } from '@/lib/utils'

interface Part {
  id: string
  partNumber: string
  description: string
  category: string
  qtyOnHand: number
}

interface CartItem { partId: string; qty: number }

export default function InventoryClient({ parts }: { parts: Part[] }) {
  const [search, setSearch] = useState('')
  const [categories, setCategories] = useState<string[]>([])
  const [cart, setCart] = useState<CartItem[]>([])
  const [added, setAdded] = useState<string | null>(null)

  const allCategories = useMemo(() => Array.from(new Set(parts.map(p => p.category))), [parts])

  const filtered = useMemo(() => {
    return parts.filter(p => {
      const matchSearch = !search ||
        p.partNumber.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase())
      const matchCat = categories.length === 0 || categories.includes(p.category)
      return matchSearch && matchCat
    })
  }, [parts, search, categories])

  const toggleCategory = (cat: string) => {
    setCategories(prev => prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat])
  }

  const addToCart = (partId: string) => {
    setCart(prev => {
      const existing = prev.find(i => i.partId === partId)
      if (existing) return prev.map(i => i.partId === partId ? { ...i, qty: i.qty + 1 } : i)
      return [...prev, { partId, qty: 1 }]
    })
    setAdded(partId)
    setTimeout(() => setAdded(null), 1500)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1B3A6B]">Parts Inventory</h1>
          <p className="text-sm text-gray-500 mt-1">PAI Industries — {parts.length} parts available</p>
        </div>
        {cart.length > 0 && (
          <Link href="/cart" className="flex items-center gap-2 bg-[#1B3A6B] text-white px-4 py-2 rounded-md text-sm hover:bg-[#2E6DB4] transition-colors">
            <ShoppingCart className="h-4 w-4" />
            View Cart ({cart.reduce((a, i) => a + i.qty, 0)})
          </Link>
        )}
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <aside className="w-full md:w-56 flex-shrink-0">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="mb-4">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Search</label>
              <div className="relative">
                <Search className="h-4 w-4 text-gray-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Part # or description"
                  className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2E6DB4]"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Category</label>
              {allCategories.map(cat => (
                <label key={cat} className="flex items-center gap-2 py-1 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={categories.includes(cat)}
                    onChange={() => toggleCategory(cat)}
                    className="rounded border-gray-300 text-[#2E6DB4]"
                  />
                  <span className="text-sm text-gray-700">{cat}</span>
                </label>
              ))}
            </div>
          </div>
        </aside>

        {/* Grid */}
        <div className="flex-1">
          {parts.length === 0 ? (
            <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
              <Package className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No parts found. Database not configured yet.</p>
              <p className="text-xs text-gray-400 mt-1">Connect Supabase and run the seed to see inventory.</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
              <p className="text-gray-500">No parts match your search.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {filtered.map(part => {
                const badge = getAvailabilityBadge(part.qtyOnHand)
                const inCart = cart.find(i => i.partId === part.id)
                return (
                  <div key={part.id} className="bg-white rounded-lg border border-gray-200 p-5 flex flex-col gap-3 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-xs font-mono font-medium text-[#2E6DB4] bg-blue-50 px-2 py-0.5 rounded">
                        {part.partNumber}
                      </span>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded border ${badge.color}`}>
                        {badge.label}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-gray-900 leading-snug flex-1">{part.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded">{part.category}</span>
                      <button
                        onClick={() => addToCart(part.id)}
                        disabled={part.qtyOnHand === 0}
                        className={`text-xs font-medium px-3 py-1.5 rounded transition-colors ${
                          part.qtyOnHand === 0
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : added === part.id
                            ? 'bg-green-600 text-white'
                            : 'bg-[#1B3A6B] text-white hover:bg-[#2E6DB4]'
                        }`}
                      >
                        {added === part.id ? '✓ Added' : inCart ? `In Cart (${inCart.qty})` : 'Add to Order'}
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
