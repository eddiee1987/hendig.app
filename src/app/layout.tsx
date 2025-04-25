"use client";

import { Inter } from 'next/font/google'
import './globals.css'
import { cn } from "@/lib/utils"
import Navbar from '@/components/Navbar'
import { Toaster } from 'react-hot-toast'
import { usePathname } from 'next/navigation'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname();
  return (
    <html lang="en" className="dark">
      <body className="bg-gray-900 text-gray-100">
        <div className="flex min-h-screen">
          {pathname !== '/login' && <Navbar />}
          <main className="flex-1 transition-all duration-300 ml-16 p-8">
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </main>
        </div>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#333',
              color: '#fff',
            },
          }}
        />
      </body>
    </html>
  )
}
