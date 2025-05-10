'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { 
  ClipboardDocumentCheckIcon,
  CreditCardIcon,
  FolderIcon,
  ChartBarIcon,
  UserCircleIcon,
  ClockIcon,
  Bars3Icon,
  XMarkIcon,
  UsersIcon
} from '@heroicons/react/24/outline'
import { WarehouseIcon } from './WarehouseIcon';

type NavItem = {
  href: string;
  icon: React.ElementType;
  label: string;
}

export default function Navbar() {
  const [expanded, setExpanded] = useState(false)
  const [isHovering, setIsHovering] = useState(false)
  const pathname = usePathname()

  // Auto-collapse menu when navigating on mobile
  useEffect(() => {
    if (window.innerWidth < 1024) {
      setExpanded(false)
    }
  }, [pathname])

  // Toggle menu expansion
  const toggleMenu = () => {
    setExpanded(!expanded)
  }

  // Handle hover events
  const handleMouseEnter = () => {
    setIsHovering(true)
  }

  const handleMouseLeave = () => {
    setIsHovering(false)
  }

  // Determine if menu should be shown expanded
  const showExpanded = expanded || isHovering

  // Navigation items
  const navItems: NavItem[] = [
    { href: '/timeforing', icon: ClockIcon, label: 'Timeføring' },   
    { href: '/inspeksjoner', icon: ClipboardDocumentCheckIcon, label: 'Inspeksjoner' },
    { href: '/hms', icon: FolderIcon, label: 'HMS' },
    { href: '/abonnement', icon: CreditCardIcon, label: 'Abonnement' },
    { href: '/prosjekter', icon: FolderIcon, label: 'Prosjekter' },
    { href: '/lager', icon: WarehouseIcon, label: 'Lager' }, // <-- Lager shortcut
    { href: '/kunder', icon: UserCircleIcon, label: 'Kunder' },
    { href: '/ansatte', icon: UsersIcon, label: 'Ansatte' },
    { href: '/rapport', icon: ChartBarIcon, label: 'Rapport' },
    { href: '/min-side', icon: UserCircleIcon, label: 'Min Side' },
  ]

  return (
    <nav 
      className={cn(
        "fixed left-0 top-0 h-screen bg-gray-900 border-r border-gray-800 flex flex-col transition-all duration-300 ease-in-out z-10",
        showExpanded ? "w-64" : "w-16"
      )}
      onMouseEnter={handleMouseEnter}
    onMouseLeave={handleMouseLeave}
    >
      {/* Logo and toggle button */}
      <div className={cn(
        "flex items-center border-b border-gray-800",
        showExpanded ? "justify-between p-6" : "justify-center p-4"
      )}>
        {showExpanded && (
          <Link href="/dashboard" className="text-2xl font-bold text-white">
            Hendig
          </Link>
        )}
        <button 
          onClick={toggleMenu} 
          className="text-gray-400 hover:text-white transition-colors"
          aria-label={expanded ? "Minimer meny" : "Utvid meny"}
        >
          {expanded ? (
            <XMarkIcon className="w-5 h-5" />
          ) : (
            <Bars3Icon className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Menu links */}
      <div className="flex-1 p-2">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon
            
            return (
              <li key={item.href}>
                <Link 
                  href={item.href} 
                  className={cn(
                    "flex items-center p-3 rounded-lg transition-colors",
                    isActive 
                      ? "bg-gray-800 text-white" 
                      : "text-gray-400 hover:bg-gray-800 hover:text-white",
                    !showExpanded && "justify-center"
                  )}
                  title={!showExpanded ? item.label : undefined}
                >
                  <Icon className={cn(
                    "w-5 h-5",
                    showExpanded ? "mr-3" : "mx-auto"
                  )} />
                  {showExpanded && <span>{item.label}</span>}
                </Link>
              </li>
            )
          })}
        </ul>
      </div>

      {/* User profile */}
      <div className={cn(
        "border-t border-gray-800",
        showExpanded ? "p-4" : "p-2"
      )}>
        <div className={cn(
          "flex items-center p-3 rounded-lg hover:bg-gray-800 transition-colors",
          !showExpanded && "justify-center"
        )}>
          <UserCircleIcon className={cn(
            "w-8 h-8 text-gray-400",
            showExpanded ? "mr-3" : ""
          )} />
          {showExpanded && (
            <div>
              <p className="text-sm font-medium text-white">Admin</p>
              <p className="text-xs text-gray-500">admin@example.com</p>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
