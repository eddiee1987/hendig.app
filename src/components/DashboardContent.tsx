'use client'

import { useState, useEffect } from 'react'
import { 
  UserGroupIcon, 
  ClipboardDocumentCheckIcon, 
  FolderIcon, 
  ChartBarIcon,
  ClockIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'

export default function DashboardContent() {
  const [greeting, setGreeting] = useState('')
  const [stats, setStats] = useState({
    kunder: 0,
    inspeksjoner: 0,
    prosjekter: 0,
    timer: 0
  })
  const [recentEvents, setRecentEvents] = useState([])

  useEffect(() => {
    // Hilsen basert på tidspunkt
    const hour = new Date().getHours()
    if (hour >= 5 && hour < 12) setGreeting('God morgen')
    else if (hour >= 12 && hour < 17) setGreeting('God dag')
    else if (hour >= 17 && hour < 22) setGreeting('God kveld')
    else setGreeting('God natt')

    // Her kan du legge til API-kall for å hente data
    setStats({
      kunder: 156,
      inspeksjoner: 23,
      prosjekter: 12,
      timer: 245
    })

    setRecentEvents([
      {
        type: 'inspeksjon',
        title: 'Ny takinspeksjon fullført',
        location: 'Bergveien 12, Bergen',
        time: '2 timer siden'
      },
      {
        type: 'kunde',
        title: 'Ny kunde registrert',
        location: 'Hansen Eiendom AS',
        time: '4 timer siden'
      },
      {
        type: 'prosjekt',
        title: 'Prosjekt "Torvtak Renovering" startet',
        location: 'Fjordgata 8, Bergen',
        time: '6 timer siden'
      }
    ])
  }, [])

  return (
    <div className="p-8">
      {/* Resten av koden er uendret */}
      {/* ... */}
    </div>
  )
} 