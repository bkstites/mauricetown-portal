'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Menu, X, Truck } from 'lucide-react'

interface NavProps {
  userRole?: string | null
  userName?: string | null
}

export default function Nav({ userRole, userName }: NavProps) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  const isActive = (path: string) =>
    pathname === path ? 'text-[#2E6DB4] font-semibold' : 'text-gray-600 hover:text-[#1B3A6B]'

  const publicLinks = [
    { href: '/', label: 'Services' },
    { href: '/request-quote', label: 'Request Quote' },
  ]
  const customerLinks = [
    { href: '/request-quote', label: 'Request Quote' },
    { href: '/orders', label: 'My Requests' },
  ]
  const adminLinks = [
    { href: '/admin/orders', label: 'Order Queue' },
  ]
  const links = userRole
    ? (userRole === 'CUSTOMER' ? [...publicLinks, ...customerLinks] : [...publicLinks, ...customerLinks, ...adminLinks])
    : publicLinks

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center gap-2">
            <Truck className="h-6 w-6 text-[#1B3A6B]" />
            <Link href="/" className="text-[#1B3A6B] font-bold text-lg leading-tight">
              Mauricetown<br className="hidden sm:block" />
              <span className="text-sm font-normal text-gray-500 hidden sm:block">Truck & Auto Repair</span>
            </Link>
          </div>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            {links.map(l => (
              <Link key={l.href} href={l.href} className={`text-sm transition-colors ${isActive(l.href)}`}>
                {l.label}
              </Link>
            ))}
            {userRole ? (
              <div className="flex items-center gap-3 ml-4 pl-4 border-l border-gray-200">
                <span className="text-sm text-gray-500">{userName}</span>
                <Link href="/api/auth/signout" className="text-sm text-gray-600 hover:text-red-600 transition-colors">
                  Sign out
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-3 ml-4 pl-4 border-l border-gray-200">
                <Link href="/login" className="text-sm text-gray-600 hover:text-[#1B3A6B]">Sign in</Link>
                <Link href="/register" className="bg-[#1B3A6B] text-white text-sm px-4 py-2 rounded-md hover:bg-[#2E6DB4] transition-colors">
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button className="md:hidden p-2" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-3 space-y-2">
          {links.map(l => (
            <Link key={l.href} href={l.href} className={`block py-2 text-sm ${isActive(l.href)}`} onClick={() => setMobileOpen(false)}>
              {l.label}
            </Link>
          ))}
          {userRole ? (
            <Link href="/api/auth/signout" className="block py-2 text-sm text-red-600" onClick={() => setMobileOpen(false)}>
              Sign out
            </Link>
          ) : (
            <>
              <Link href="/login" className="block py-2 text-sm text-gray-600" onClick={() => setMobileOpen(false)}>Sign in</Link>
              <Link href="/register" className="block py-2 text-sm text-[#1B3A6B] font-medium" onClick={() => setMobileOpen(false)}>Register</Link>
            </>
          )}
        </div>
      )}
    </nav>
  )
}
