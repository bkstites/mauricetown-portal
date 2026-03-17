'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Truck } from 'lucide-react'

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', company: '', email: '', phone: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClientComponentClient()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error: authError } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    })

    if (authError) {
      setError(authError.message)
      setLoading(false)
      return
    }

    // Create user in DB
    const res = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: form.email, name: form.name, company: form.company, phone: form.phone }),
    })

    if (!res.ok) {
      const d = await res.json()
      setError(d.error || 'Registration failed')
      setLoading(false)
      return
    }

    router.push('/inventory')
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-3">
            <Truck className="h-7 w-7 text-[#1B3A6B]" />
          </div>
          <h1 className="text-2xl font-bold text-[#1B3A6B]">Create your account</h1>
          <p className="text-gray-500 text-sm mt-1">Mauricetown Truck & Auto Repair Portal</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-8">
          <form onSubmit={handleRegister} className="space-y-4">
            {[
              { name: 'name', label: 'Full Name', type: 'text', placeholder: 'John Smith', required: true },
              { name: 'company', label: 'Company / Fleet Name', type: 'text', placeholder: 'Smith Trucking LLC', required: false },
              { name: 'email', label: 'Email address', type: 'email', placeholder: 'you@company.com', required: true },
              { name: 'phone', label: 'Phone Number', type: 'tel', placeholder: '(856) 555-0100', required: false },
              { name: 'password', label: 'Password', type: 'password', placeholder: '••••••••', required: true },
            ].map(field => (
              <div key={field.name}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {field.label} {field.required && <span className="text-red-500">*</span>}
                </label>
                <input
                  type={field.type}
                  required={field.required}
                  value={form[field.name as keyof typeof form]}
                  onChange={e => setForm({ ...form, [field.name]: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E6DB4]"
                  placeholder={field.placeholder}
                />
              </div>
            ))}
            {error && <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded px-3 py-2">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1B3A6B] hover:bg-[#2E6DB4] text-white font-semibold py-2 rounded-md transition-colors disabled:opacity-60"
            >
              {loading ? 'Creating account…' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{' '}
            <Link href="/login" className="text-[#2E6DB4] font-medium hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
