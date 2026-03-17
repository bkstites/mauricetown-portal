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
  { id: 'demo', orderNumber: 'MT-2026-00001', date: '2026-03-14', status: 'QUOTED', itemCount: 2 },
  { id: 'demo2', orderNumber: 'MT-2026-00002', date: '2026-03-10', status: 'APPROVED', itemCount: 3 },
  { id: 'demo3', orderNumber: 'MT-2026-00003', date: '2026-03-05', status: 'PENDING', itemCount: 1 },
]

export default function OrdersPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-[#1B3A6B] mb-6">My Orders</h1>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="hidden md:grid grid-cols-5 gap-4 px-6 py-3 bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
          <span>Order #</span>
          <span>Date</span>
          <span>Status</span>
          <span>Items</span>
          <span></span>
        </div>
        <div className="divide-y divide-gray-100">
          {DEMO_ORDERS.map(order => (
            <Link key={order.id} href={`/orders/${order.id}`} className="grid grid-cols-2 md:grid-cols-5 gap-4 px-6 py-4 hover:bg-gray-50 transition-colors items-center">
              <span className="font-medium text-[#1B3A6B]">{order.orderNumber}</span>
              <span className="text-sm text-gray-500">{new Date(order.date).toLocaleDateString()}</span>
              <span className={`text-xs font-medium px-2 py-1 rounded border w-fit ${STATUS_STYLES[order.status]}`}>
                {order.status}
              </span>
              <span className="text-sm text-gray-600">{order.itemCount} part{order.itemCount > 1 ? 's' : ''}</span>
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
