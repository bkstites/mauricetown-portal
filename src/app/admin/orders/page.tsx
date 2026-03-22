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

const TABS = ['ALL', 'PENDING', 'REVIEWING', 'QUOTED', 'APPROVED', 'REJECTED']

export default async function AdminOrderQueue({ searchParams }: { searchParams: { status?: string } }) {
  const activeTab = (searchParams.status || 'ALL').toUpperCase()
  const rows = await listQuoteRequests(activeTab)

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#1B3A6B]">Associate Quote Queue</h1>
        <p className="text-sm text-gray-500 mt-1">{rows.length} requests in current view</p>
      </div>

      <div className="flex gap-1 bg-gray-100 rounded-lg p-1 w-fit mb-6 overflow-x-auto">
        {TABS.map(tab => (
          <Link
            key={tab}
            href={tab === 'ALL' ? '/admin/orders' : `/admin/orders?status=${tab}`}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
              activeTab === tab ? 'bg-white text-[#1B3A6B] shadow-sm' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab.charAt(0) + tab.slice(1).toLowerCase()}
          </Link>
        ))}
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="hidden md:grid grid-cols-6 gap-4 px-6 py-3 bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
          <span>Request #</span>
          <span>Contact</span>
          <span>Shop</span>
          <span>Date</span>
          <span>Status</span>
          <span></span>
        </div>

        <div className="divide-y divide-gray-100">
          {rows.length === 0 && <p className="px-6 py-10 text-sm text-gray-500">No quote requests found for this status.</p>}

          {rows.map(row => (
            <Link
              key={row.id}
              href={`/admin/orders/${row.id}/quote`}
              className="grid grid-cols-2 md:grid-cols-6 gap-4 px-6 py-4 hover:bg-gray-50 transition-colors items-center"
            >
              <span className="font-medium text-[#1B3A6B] text-sm">{row.requestNumber}</span>
              <span className="text-sm text-gray-900">{row.contactName}</span>
              <span className="text-sm text-gray-500 hidden md:block">{row.shopName}</span>
              <span className="text-sm text-gray-500 hidden md:block">{new Date(row.createdAt).toLocaleDateString()}</span>
              <span className={`text-xs font-medium px-2 py-1 rounded border w-fit ${STATUS_STYLES[row.status] || STATUS_STYLES.PENDING}`}>
                {row.status}
              </span>
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
