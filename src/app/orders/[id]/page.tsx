import Link from 'next/link'
import { getQuoteRequestById } from '@/lib/quote-store'

const STATUS_STYLES: Record<string, string> = {
  PENDING: 'bg-amber-100 text-amber-700 border-amber-200',
  REVIEWING: 'bg-blue-100 text-blue-700 border-blue-200',
  QUOTED: 'bg-purple-100 text-purple-700 border-purple-200',
  APPROVED: 'bg-green-100 text-green-700 border-green-200',
  REJECTED: 'bg-red-100 text-red-700 border-red-200',
}

export default async function OrderDetailPage({ params }: { params: { id: string } }) {
  const row = await getQuoteRequestById(params.id)

  if (!row) {
    return <div className="max-w-3xl mx-auto px-4 py-10 text-sm text-red-600">Quote request not found.</div>
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <Link href="/orders" className="text-sm text-[#2E6DB4] hover:underline mb-1 block">← My Requests</Link>
          <h1 className="text-2xl font-bold text-[#1B3A6B]">{row.requestNumber}</h1>
        </div>
        <span className={`text-sm font-medium px-3 py-1 rounded border ${STATUS_STYLES[row.status] || STATUS_STYLES.PENDING}`}>
          {row.status}
        </span>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm mb-4">
          <div><p className="text-gray-500">Submitted</p><p className="font-medium">{new Date(row.createdAt).toLocaleDateString()}</p></div>
          <div><p className="text-gray-500">Shop</p><p className="font-medium">{row.shopName}</p></div>
          <div><p className="text-gray-500">Contact</p><p className="font-medium">{row.contactName}</p></div>
        </div>

        <div className="border-t pt-4 space-y-4">
          <div>
            <p className="text-sm font-medium text-gray-700 mb-1">Parts Requested</p>
            <p className="text-sm text-gray-600 whitespace-pre-wrap">{row.partsNeeded}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700 mb-1">Repair Context</p>
            <p className="text-sm text-gray-600 whitespace-pre-wrap">{row.repairContext}</p>
          </div>
        </div>
      </div>

      {row.status === 'QUOTED' && (
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
          <h2 className="font-semibold text-purple-900 mb-2">Quote Ready</h2>
          <p className="text-sm text-purple-800 mb-2">
            Quoted Total: <span className="font-semibold">{row.quoteTotal ? `$${row.quoteTotal}` : 'Pending update'}</span>
          </p>
          <p className="text-sm text-purple-800 whitespace-pre-wrap">{row.quoteNotes || 'No notes provided.'}</p>
          <p className="text-xs text-purple-700 mt-3">A quote email was sent to {row.email}.</p>
        </div>
      )}
    </div>
  )
}
