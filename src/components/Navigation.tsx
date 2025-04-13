'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Navigation() {
  const pathname = usePathname()

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center h-16 space-x-8">
          <Link href="/" className="text-xl font-bold">
            Hendig
          </Link>
          <Link
            href="/dashboard"
            className={pathname === '/dashboard' ? 'text-blue-500' : 'text-gray-500'}
          >
            Dashboard
          </Link>
          <Link
            href="/kunder"
            className={pathname === '/kunder' ? 'text-blue-500' : 'text-gray-500'}
          >
            Kunder
          </Link>
          <Link
            href="/timeforing"
            className={pathname === '/timeforing' ? 'text-blue-500' : 'text-gray-500'}
          >
            Timeføring
          </Link>
        </div>
      </div>
    </nav>
  )
} 