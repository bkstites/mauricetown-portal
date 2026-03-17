import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

const STATUS_STYLES: Record<string, string> = {
  PENDING: 'bg-amber-100 text-amber-700 border-amber-200',
  REVIEWING: 'bg-blue-100 text-blue-700 border-blue-200',
  QUOTED: 'bg-purple-100 text-purple-700 border-purple-200',
  APPROVED: 'bg-green-100 text-green-700 border-green-200',
  REJECTED: 'bg-red-100 text-red-700 border-red-200',
}

const DEMO_ORDERS = [
  { id: 'a1', orderNumber: 'MT-2026-00001', customer: 'John Smith', company: 'Smith Trucking LLC', date: '2026-03-16', status: 'PENDING', items: 2 },
  { id: 'a2', orderNumber: 'MT-2026-00002', customer: 'Maria Rodriguez', company: 'Rodriguez Fleet', date: '2026-03-15', status: 'REVIEWING', items: 4 },
  { id: 'a3', orderNumber: 'MT-2026-00003', customer: 'Bob Williams', company: 'Williams & Sons Transport', date: '2026-03-14', status: 'QUOTED', items: 1 },
  { id: 'a4', orderNumber: 'MT-2026-00004', customer: 'John Smith', company: 'Smith Trucking LLC', date: '2026-03-12', status: 'APPROVED', items: 3 },
  { id: 'a5', orderNumber: 'MT-2026-00005', customer: 'Dave Miller', company: 'Miller Logistics', date: '2026-03-10', status: 'REJECTED', items: 2 },
]

const TABS = ['All', 'Pending', 'Reviewing', 'Quoted', 'Approved']

export default function AdminOrderQueue({ searchParams }: { searchParams: { status?: string } }) {
  const activeTab = searchParams.status || 'All'
  const filtered = activeTab === 'All' ? DEMO_ORDERS : DEMO_ORDERS.filter(o => o.status === activeTab.toUpperCase())

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#1B3A6B]">Order Queue</h1>
        <p className="text-sm text-gray-500 mt-1">{DEMO_ORDERS.length} total orders</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-lg p-1 w-fit mb-6 overflow-x-auto">
        {TABS.map(tab => (
          <Link
            key={tab}
            href={tab === 'All' ? '/admin/orders' : `/admin/orders?status=${tab}`}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
              activeTab === tab ? 'bg-white text-[#1B3A6B] shadow-sm' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab}
          </Link>
        ))}
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="hidden md:grid grid-cols-6 gap-4 px-6 py-3 bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
          <span>Order #</span>
          <span>Customer</span>
          <span>Company</span>
          <span>Date</span>
          <span>Status</span>
          <span></span>
        </div>
        <div className="divide-y divide-gray-100">
          {filtered.map(order => (
            <Link key={order.id} href={`/admin/orders/${order.id}/quote`} className="grid grid-cols-2 md:grid-cols-6 gap-4 px-6 py-4 hover:bg-gray-50 transition-colors items-center">
              <span className="font-medium text-[#1B3A6B] text-sm">{order.orderNumber}</span>
              <span className="text-sm text-gray-900">{order.customer}</span>
              <span className="text-sm text-gray-500 hidden md:block">{order.company}</span>
              <span className="text-sm text-gray-500 hidden md:block">{new Date(order.date).toLocaleDateString()}</span>
              <span className={`text-xs font-medium px-2 py-1 rounded border w-fit ${STATUS_STYLES[order.status]}`}>
                {order.status}
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
