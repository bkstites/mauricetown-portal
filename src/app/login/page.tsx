'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Truck } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClientComponentClient()
  const nextPath = searchParams.get('next') || '/request-quote'

  useEffect(() => {
    let active = true

    const redirectIfSignedIn = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (active && user) {
        router.replace(nextPath)
        router.refresh()
      }
    }

    redirectIfSignedIn()

    return () => {
      active = false
    }
  }, [nextPath, router, supabase.auth])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.replace(nextPath)
      router.refresh()
    }
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-3">
            <Truck className="h-7 w-7 text-[#1B3A6B]" />
          </div>
          <h1 className="text-2xl font-bold text-[#1B3A6B]">Sign in to your account</h1>
          <p className="text-gray-500 text-sm mt-1">Mauricetown Truck & Auto Repair Portal</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-8">
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email address</label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E6DB4] focus:border-transparent"
                placeholder="you@company.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E6DB4] focus:border-transparent"
                placeholder="••••••••"
              />
            </div>
            {error && <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded px-3 py-2">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1B3A6B] hover:bg-[#2E6DB4] text-white font-semibold py-2 rounded-md transition-colors disabled:opacity-60"
            >
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="text-[#2E6DB4] font-medium hover:underline">Register here</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
