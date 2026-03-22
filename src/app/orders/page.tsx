import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { listQuoteRequests } from '@/lib/quote-store'

const STATUS_STYLES: Record<string, string> = {
  PENDING: 'bg-amber-100 text-amber-700 border-amber-200',
  REVIEWING: 'bg-blue-100 text-blue-700 border-blue-200',
  QUOTED: 'bg-purple-100 text-purple-700 border-purple-200',
  APPROVED: 'bg-green-100 text-green-700 border-green-200',
  REJECTED: 'bg-red-100 text-red-700 border-red-200',
}

export default async function OrdersPage() {
  const rows = await listQuoteRequests('ALL')

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-[#1B3A6B] mb-6">My Quote Requests</h1>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="hidden md:grid grid-cols-5 gap-4 px-6 py-3 bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
          <span>Request #</span>
          <span>Date</span>
          <span>Status</span>
          <span>Shop</span>
          <span></span>
        </div>

        <div className="divide-y divide-gray-100">
          {rows.length === 0 && <p className="px-6 py-10 text-sm text-gray-500">No quote requests yet. Submit your first request to get started.</p>}

          {rows.map(row => (
            <Link key={row.id} href={`/orders/${row.id}`} className="grid grid-cols-2 md:grid-cols-5 gap-4 px-6 py-4 hover:bg-gray-50 transition-colors items-center">
              <span className="font-medium text-[#1B3A6B]">{row.requestNumber}</span>
              <span className="text-sm text-gray-500">{new Date(row.createdAt).toLocaleDateString()}</span>
              <span className={`text-xs font-medium px-2 py-1 rounded border w-fit ${STATUS_STYLES[row.status] || STATUS_STYLES.PENDING}`}>
                {row.status}
              </span>
              <span className="text-sm text-gray-600">{row.shopName}</span>
              <span className="flex justify-end">
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
