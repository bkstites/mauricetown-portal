import Link from 'next/link'
import { CheckCircle2 } from 'lucide-react'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function ConfirmationPage(_props: { params: { id: string } }) {
  const orderNumber = 'MT-2026-00001'
  const today = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })

  return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center">
      <CheckCircle2 className="h-14 w-14 text-green-500 mx-auto mb-4" />
      <h1 className="text-2xl font-bold text-[#1B3A6B] mb-2">Order Submitted</h1>
      <p className="text-gray-500 mb-8">Thank you — your order has been received and is pending review.</p>

      <div className="bg-white rounded-lg border border-gray-200 p-6 text-left mb-8">
        <div className="grid grid-cols-2 gap-4 text-sm mb-6">
          <div>
            <p className="text-gray-500">Order Number</p>
            <p className="font-semibold text-[#1B3A6B] text-lg">{orderNumber}</p>
          </div>
          <div>
            <p className="text-gray-500">Date Submitted</p>
            <p className="font-medium">{today}</p>
          </div>
          <div>
            <p className="text-gray-500">Status</p>
            <span className="inline-block bg-amber-100 text-amber-700 border border-amber-200 text-xs font-medium px-2 py-1 rounded">
              Pending Review
            </span>
          </div>
        </div>

        <div className="border-t pt-4">
          <p className="text-sm font-medium text-gray-700 mb-3">Items Ordered</p>
          <div className="space-y-2">
            {[
              { pn: 'PAI-131643', desc: 'Cummins ISX Cylinder Head Gasket', qty: 2 },
              { pn: 'PAI-196580', desc: 'Meritor Air Cam Brake Repair Kit', qty: 1 },
            ].map(item => (
              <div key={item.pn} className="flex justify-between text-sm">
                <span className="text-gray-600"><span className="font-mono text-[#2E6DB4]">{item.pn}</span> — {item.desc}</span>
                <span className="text-gray-500 ml-3">×{item.qty}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-[#1B3A6B] mb-8">
        Our team will review your order and send you a quote within <strong>1 business day</strong>. You&apos;ll be able to approve or reject the quote right here in the portal.
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link href="/orders" className="bg-[#1B3A6B] text-white px-6 py-2 rounded-md text-sm font-medium hover:bg-[#2E6DB4] transition-colors">
          View My Orders
        </Link>
        <Link href="/inventory" className="border border-gray-300 text-gray-600 px-6 py-2 rounded-md text-sm hover:bg-gray-50 transition-colors">
          Browse More Parts
        </Link>
      </div>
    </div>
  )
}
