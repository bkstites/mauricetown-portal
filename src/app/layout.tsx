import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Nav from '@/components/nav'
import { cookies } from 'next/headers'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { prisma } from '@/lib/prisma'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: 'Mauricetown Truck & Auto Repair — Parts Portal',
  description: 'Browse and order PAI Industries truck parts online.',
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  let userRole: string | null = null
  let userName: string | null = null

  try {
    const supabase = createServerComponentClient({ cookies })
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const dbUser = await prisma.user.findUnique({ where: { email: user.email! } })
      userRole = dbUser?.role ?? 'CUSTOMER'
      userName = dbUser?.name ?? user.email ?? null
    }
  } catch {
    // Supabase not configured — POC mode
  }

  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-[#F8FAFC] min-h-screen font-sans">
        <Nav userRole={userRole} userName={userName} />
        <main>{children}</main>
        <footer className="bg-[#1B3A6B] text-white mt-16">
          <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h3 className="font-semibold mb-2">Mauricetown Truck & Auto Repair</h3>
                <p className="text-sm text-blue-200">Your trusted PAI Industries distributor</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Contact</h3>
                <p className="text-sm text-blue-200">123 Main Street<br />Mauricetown, NJ 08329<br />(856) 555-0100</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Hours</h3>
                <p className="text-sm text-blue-200">Mon–Fri: 7am – 5pm<br />Sat: 8am – 12pm<br />Sun: Closed</p>
              </div>
            </div>
            <div className="mt-6 pt-6 border-t border-blue-800 text-center text-xs text-blue-300">
              © {new Date().getFullYear()} Mauricetown Truck & Auto Repair. All rights reserved.
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}
