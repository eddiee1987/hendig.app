'use client'

import { useState, useEffect } from 'react'

type Event = {
  type: string
  title: string
  location: string
  time: string
}

export default function DashboardContent() {
  const [greeting, setGreeting] = useState('')
  const [stats, setStats] = useState({
    kunder: 0,
    inspeksjoner: 0,
    prosjekter: 0,
    timer: 0
  })
  const [recentEvents, setRecentEvents] = useState<Event[]>([])

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
      <h1 className="text-2xl font-bold mb-4">{greeting}</h1>
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-100 p-4 rounded">
          <h3>Kunder</h3>
          <p className="text-xl font-bold">{stats.kunder}</p>
        </div>
        <div className="bg-gray-100 p-4 rounded">
          <h3>Inspeksjoner</h3>
          <p className="text-xl font-bold">{stats.inspeksjoner}</p>
        </div>
        <div className="bg-gray-100 p-4 rounded">
          <h3>Prosjekter</h3>
          <p className="text-xl font-bold">{stats.prosjekter}</p>
        </div>
        <div className="bg-gray-100 p-4 rounded">
          <h3>Timer</h3>
          <p className="text-xl font-bold">{stats.timer}</p>
        </div>
      </div>
      <div className="bg-gray-100 p-4 rounded">
        <h2 className="text-xl font-bold mb-4">Nylige hendelser</h2>
        <ul className="space-y-2">
          {recentEvents.map((event, index) => (
            <li key={index} className="border-b pb-2">
              <p className="font-medium">{event.title}</p>
              <p className="text-sm text-gray-600">{event.location}</p>
              <p className="text-xs text-gray-500">{event.time}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
