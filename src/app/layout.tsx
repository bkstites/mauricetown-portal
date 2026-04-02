import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Nav from '@/components/nav'
import { getCurrentAppUser } from '@/lib/auth'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: 'Mauricetown Truck Repair — Diesel Parts Quote Portal',
  description: 'Submit diesel parts quote requests online with complete vehicle and repair details.',
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentAppUser()
  const userRole = user?.role ?? null
  const userName = user?.name ?? null

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
                <p className="text-sm text-blue-200">Legacy of reliability since 1979</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Contact</h3>
                <p className="text-sm text-blue-200">2110 E. Buckshutem Rd, PO Box 211<br />Mauricetown, NJ 08329<br />(856) 785-3222<br />mauricetowntruckrepair@gmail.com</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Hours</h3>
                <p className="text-sm text-blue-200">Mon-Fri: Quote Desk Coverage<br />Submit requests anytime online<br />Family owned and operated</p>
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
