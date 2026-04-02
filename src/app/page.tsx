import Link from 'next/link'
import { ClipboardList, FileText, Truck, Shield, Clock, Wrench, PhoneCall } from 'lucide-react'

export default function LandingPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-[#1B3A6B] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-blue-800 rounded-full px-3 py-1 text-sm mb-6">
              <Truck className="h-4 w-4" />
              <span>Family Owned Since 1979</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
              Heavy-Duty Diesel Parts Quote Requests,<br />Without Phone Tag
            </h1>
            <p className="text-xl text-blue-200 mb-8">
              Tell us what parts you need, add vehicle and engine details, and send a complete request to our quote desk in minutes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/request-quote" className="bg-[#2E6DB4] hover:bg-blue-500 text-white font-semibold px-8 py-3 rounded-md text-center transition-colors">
                Start A Quote Request
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
        <h2 className="text-2xl font-bold text-[#1B3A6B] text-center mb-10">How Quote Requests Work</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: ClipboardList, title: 'Submit Detailed Request', desc: 'Include truck details, part numbers, urgency, and any notes our parts team needs to quote accurately.' },
            { icon: Wrench, title: 'Technician Review', desc: 'Our quote desk researches fitment and options for new, used, or reman parts.' },
            { icon: FileText, title: 'Receive Quote By Email', desc: 'We send back a finalized quote you can review, approve, and schedule for pickup or delivery.' },
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
              { icon: Shield, title: 'Legacy Of Reliability', desc: 'Trusted by diesel shops for over four decades in Southern New Jersey.' },
              { icon: Clock, title: 'Fast Quote Turnaround', desc: 'Requests are triaged quickly so technicians can keep repairs moving.' },
              { icon: Truck, title: 'New, Used, And Reman Options', desc: 'Flexible sourcing across prime diesel components and assemblies.' },
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

      {/* Service strip */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white border border-gray-200 rounded-xl p-6 md:p-8">
          <h2 className="text-xl font-bold text-[#1B3A6B] mb-4">What We Source Every Day</h2>
          <p className="text-gray-600 mb-5">
            Heavy duty clutches, turbochargers, overhaul kits, transmissions, hoods, power steering boxes, and supporting engine components.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/request-quote" className="bg-[#1B3A6B] hover:bg-[#2E6DB4] text-white font-semibold px-6 py-3 rounded-md text-center transition-colors">
              Request A Quote
            </Link>
            <a href="tel:+18567853222" className="border border-gray-300 text-gray-700 hover:border-[#2E6DB4] hover:text-[#1B3A6B] font-semibold px-6 py-3 rounded-md text-center transition-colors inline-flex justify-center items-center gap-2">
              <PhoneCall className="h-4 w-4" />
              Call (856) 785-3222
            </a>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h2 className="text-2xl font-bold text-[#1B3A6B] mb-3">Start With A Simple, Secure POC</h2>
        <p className="text-gray-600 mb-6">Create your account, submit requests online, and let our team return finalized quotes by email.</p>
        <Link href="/register" className="bg-[#1B3A6B] hover:bg-[#2E6DB4] text-white font-semibold px-8 py-3 rounded-md inline-block transition-colors">
          Create Account
        </Link>
      </section>
    </div>
  )
}
