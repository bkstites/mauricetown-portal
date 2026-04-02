'use client'

import { useEffect, useMemo, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { ClipboardCheck, Mail, Phone } from 'lucide-react'

type QuoteForm = {
  contactName: string
  shopName: string
  email: string
  phone: string
  vehicleYear: string
  vehicleMake: string
  vehicleModel: string
  vin: string
  engineModel: string
  urgency: string
  neededBy: string
  preferredCondition: string
  deliveryMethod: string
  partsNeeded: string
  repairContext: string
}

const initialForm: QuoteForm = {
  contactName: '',
  shopName: '',
  email: '',
  phone: '',
  vehicleYear: '',
  vehicleMake: '',
  vehicleModel: '',
  vin: '',
  engineModel: '',
  urgency: 'same_week',
  neededBy: '',
  preferredCondition: 'any',
  deliveryMethod: 'pickup',
  partsNeeded: '',
  repairContext: '',
}

export default function RequestQuotePage() {
  const supabase = createClientComponentClient()
  const [form, setForm] = useState<QuoteForm>(initialForm)
  const [loading, setLoading] = useState(false)
  const [authReady, setAuthReady] = useState(false)
  const [error, setError] = useState('')
  const [requestId, setRequestId] = useState('')

  useEffect(() => {
    let active = true

    const loadUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!active) {
        return
      }

      setForm(prev => ({
        ...prev,
        email: user?.email ?? prev.email,
        contactName: prev.contactName || (typeof user?.user_metadata?.name === 'string' ? user.user_metadata.name : ''),
      }))
      setAuthReady(true)
    }

    loadUser()

    return () => {
      active = false
    }
  }, [supabase.auth])

  const isValid = useMemo(() => {
    return Boolean(
      form.contactName.trim() &&
        form.shopName.trim() &&
        form.email.trim() &&
        form.partsNeeded.trim() &&
        form.repairContext.trim(),
    )
  }, [authReady, form])

  const update = (field: keyof QuoteForm, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isValid) {
      setError('Please complete all required fields.')
      return
    }

    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/quote-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      if (!res.ok) {
        const payload = await res.json()
        throw new Error(payload.error || 'Failed to submit quote request')
      }

      const payload = await res.json()
      setRequestId(payload.requestNumber)
      setForm(initialForm)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unable to save your request right now. Please try again.'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-[#1B3A6B]">Submit A Parts Quote Request</h1>
          <p className="text-gray-600 mt-2">
            Provide as much detail as possible so our quote desk can research fitment, pricing, and availability quickly.
          </p>
        </div>

        {requestId && (
          <div className="mb-6 rounded-lg border border-green-200 bg-green-50 p-4">
            <div className="flex items-start gap-3">
              <ClipboardCheck className="h-5 w-5 text-green-700 mt-0.5" />
              <div>
                <p className="text-green-900 font-semibold">Request submitted successfully</p>
                <p className="text-green-800 text-sm mt-1">
                  Request ID: <span className="font-semibold">{requestId}</span>. Our team will respond by email with a finalized quote.
                </p>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 md:p-8 space-y-6">
          <section>
            <h2 className="text-lg font-semibold text-[#1B3A6B] mb-4">Contact Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input id="contactName" label="Contact Name" value={form.contactName} onChange={v => update('contactName', v)} required />
              <Input id="shopName" label="Shop / Fleet Name" value={form.shopName} onChange={v => update('shopName', v)} required />
              <Input
                id="email"
                label="Email"
                type="email"
                value={form.email}
                onChange={v => update('email', v)}
                required
                readOnly
                helperText="Requests are tied to the signed-in account email."
              />
              <Input id="phone" label="Phone" type="tel" value={form.phone} onChange={v => update('phone', v)} />
            </div>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#1B3A6B] mb-4">Truck And Engine Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input id="vehicleYear" label="Year" value={form.vehicleYear} onChange={v => update('vehicleYear', v)} />
              <Input id="vehicleMake" label="Make" value={form.vehicleMake} onChange={v => update('vehicleMake', v)} />
              <Input id="vehicleModel" label="Model" value={form.vehicleModel} onChange={v => update('vehicleModel', v)} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <Input id="vin" label="VIN (last 8 or full)" value={form.vin} onChange={v => update('vin', v)} />
              <Input id="engineModel" label="Engine Model / Serial" value={form.engineModel} onChange={v => update('engineModel', v)} />
            </div>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#1B3A6B] mb-4">Request Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                id="urgency"
                label="Urgency"
                value={form.urgency}
                onChange={v => update('urgency', v)}
                options={[
                  ['same_day', 'Same Day'],
                  ['same_week', 'Same Week'],
                  ['planned', 'Planned Maintenance'],
                ]}
              />
              <Input id="neededBy" label="Needed By" type="date" value={form.neededBy} onChange={v => update('neededBy', v)} />
              <Select
                id="preferredCondition"
                label="Condition Preference"
                value={form.preferredCondition}
                onChange={v => update('preferredCondition', v)}
                options={[
                  ['any', 'Any (new/used/reman)'],
                  ['new', 'New Only'],
                  ['used', 'Used Only'],
                  ['reman', 'Reman Only'],
                ]}
              />
              <Select
                id="deliveryMethod"
                label="Fulfillment"
                value={form.deliveryMethod}
                onChange={v => update('deliveryMethod', v)}
                options={[
                  ['pickup', 'Pickup'],
                  ['delivery', 'Delivery'],
                  ['ship', 'Freight / Ship'],
                ]}
              />
            </div>

            <div className="mt-4">
              <Label text="Parts Needed" required htmlFor="partsNeeded" />
              <textarea
                id="partsNeeded"
                value={form.partsNeeded}
                onChange={e => update('partsNeeded', e.target.value)}
                required
                rows={5}
                placeholder="List part numbers, component names, quantities, and any preferred brands."
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E6DB4]"
              />
            </div>

            <div className="mt-4">
              <Label text="Repair Context" required htmlFor="repairContext" />
              <textarea
                id="repairContext"
                value={form.repairContext}
                onChange={e => update('repairContext', e.target.value)}
                required
                rows={4}
                placeholder="Describe the issue, failure symptoms, and what the technician has already inspected."
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E6DB4]"
              />
            </div>
          </section>

          {error && <p className="text-red-700 text-sm bg-red-50 border border-red-200 rounded-md px-3 py-2">{error}</p>}

          <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between pt-2">
            <p className="text-xs text-gray-500">After submission, associates receive this request in the quote queue for review and pricing.</p>
            <button
              type="submit"
              disabled={loading || !authReady || !isValid}
              className="bg-[#1B3A6B] hover:bg-[#2E6DB4] text-white font-semibold px-6 py-3 rounded-md transition-colors disabled:opacity-60"
            >
              {loading ? 'Submitting…' : 'Submit Quote Request'}
            </button>
          </div>
        </form>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white border border-gray-200 rounded-lg p-4 text-sm text-gray-700 flex items-start gap-2">
            <Phone className="h-4 w-4 text-[#1B3A6B] mt-0.5" />
            Need urgent help? Call the quote desk: <a href="tel:+18567853222" className="text-[#2E6DB4] font-medium">(856) 785-3222</a>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4 text-sm text-gray-700 flex items-start gap-2">
            <Mail className="h-4 w-4 text-[#1B3A6B] mt-0.5" />
            Quote follow-up email: <a href="mailto:mauricetowntruckrepair@gmail.com" className="text-[#2E6DB4] font-medium">mauricetowntruckrepair@gmail.com</a>
          </div>
        </div>
      </div>
    </div>
  )
}

function Label({ text, required = false, htmlFor }: { text: string; required?: boolean; htmlFor?: string }) {
  return (
    <label htmlFor={htmlFor} className="block text-sm font-medium text-gray-700 mb-1">
      {text} {required && <span className="text-red-500">*</span>}
    </label>
  )
}

function Input({
  id,
  label,
  value,
  onChange,
  type = 'text',
  required = false,
  readOnly = false,
  helperText,
}: {
  id?: string
  label: string
  value: string
  onChange: (value: string) => void
  type?: string
  required?: boolean
  readOnly?: boolean
  helperText?: string
}) {
  return (
    <div>
      <Label text={label} required={required} htmlFor={id ?? label} />
      <input
        id={id ?? label}
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        required={required}
        readOnly={readOnly}
        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E6DB4] read-only:bg-gray-50 read-only:text-gray-500"
      />
      {helperText ? <p className="mt-1 text-xs text-gray-500">{helperText}</p> : null}
    </div>
  )
}

function Select({
  id,
  label,
  value,
  onChange,
  options,
}: {
  id?: string
  label: string
  value: string
  onChange: (value: string) => void
  options: Array<[string, string]>
}) {
  return (
    <div>
      <Label text={label} htmlFor={id ?? label} />
      <select
        id={id ?? label}
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#2E6DB4]"
      >
        {options.map(([optionValue, optionLabel]) => (
          <option key={optionValue} value={optionValue}>
            {optionLabel}
          </option>
        ))}
      </select>
    </div>
  )
}
