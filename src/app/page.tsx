import Link from 'next/link'
import { Package, ClipboardList, FileText, Truck, Shield, Clock } from 'lucide-react'

export default function LandingPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-[#1B3A6B] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-blue-800 rounded-full px-3 py-1 text-sm mb-6">
              <Truck className="h-4 w-4" />
              <span>Authorized PAI Industries Distributor</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
              Heavy-Duty Truck Parts,<br />Ordered Online — 24/7
            </h1>
            <p className="text-xl text-blue-200 mb-8">
              Browse our full PAI Industries inventory, submit orders, and receive competitive quotes from our team. No phone tag. No waiting.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/inventory" className="bg-[#2E6DB4] hover:bg-blue-500 text-white font-semibold px-8 py-3 rounded-md text-center transition-colors">
                Browse Parts
              </Link>
              <Link href="/register" className="bg-white text-[#1B3A6B] font-semibold px-8 py-3 rounded-md text-center hover:bg-blue-50 transition-colors">
                Create Account
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Feature cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-2xl font-bold text-[#1B3A6B] text-center mb-10">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: Package, title: 'Browse Inventory', desc: 'Search our full PAI Industries catalog by part number, description, or category. Real-time availability.' },
            { icon: ClipboardList, title: 'Submit Orders', desc: 'Add parts to your order, include notes, and choose pickup or direct ship. Submit in minutes.' },
            { icon: FileText, title: 'Receive & Approve Quotes', desc: 'Our team reviews and prices your order within 1 business day. Approve online or call us.' },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
              <div className="bg-blue-50 rounded-lg p-3 w-fit mb-4">
                <Icon className="h-6 w-6 text-[#2E6DB4]" />
              </div>
              <h3 className="font-semibold text-[#1B3A6B] mb-2">{title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Trust signals */}
      <section className="bg-white border-t border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {[
              { icon: Shield, title: 'Authorized Distributor', desc: 'Genuine PAI Industries parts with full manufacturer warranty.' },
              { icon: Clock, title: '1 Business Day Quotes', desc: 'Our team reviews and prices every order within one business day.' },
              { icon: Truck, title: 'Pickup or Direct Ship', desc: 'Pick up at our Mauricetown location or ship direct from PAI.' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex flex-col items-center">
                <Icon className="h-8 w-8 text-[#2E6DB4] mb-3" />
                <h3 className="font-semibold text-[#1B3A6B] mb-1">{title}</h3>
                <p className="text-sm text-gray-600">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h2 className="text-2xl font-bold text-[#1B3A6B] mb-3">Ready to Order?</h2>
        <p className="text-gray-600 mb-6">Create a free account and browse our full PAI Industries inventory.</p>
        <Link href="/register" className="bg-[#1B3A6B] hover:bg-[#2E6DB4] text-white font-semibold px-8 py-3 rounded-md inline-block transition-colors">
          Get Started — It&apos;s Free
        </Link>
      </section>
    </div>
  )
}
