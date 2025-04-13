'use client'

import { useState } from 'react'

interface UserProfile {
  name: string
  email: string
  role: string
  phone: string
  department: string
}

export default function MinSidePage() {
  const [profile, setProfile] = useState<UserProfile>({
    name: 'Ole Nordmann',
    email: 'ole.nordmann@driftig.no',
    role: 'Driftsleder',
    phone: '+47 123 45 678',
    department: 'Drift'
  })

  const [isEditing, setIsEditing] = useState(false)

  return (
    <div className="min-h-screen bg-gray-900 p-8 ml-64">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-bold text-white">Min side</h1>
            <p className="text-gray-400 mt-2">Din personlige oversikt</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Profilinformasjon */}
          <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
            <h2 className="text-xl font-semibold text-white mb-4">Profilinformasjon</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400">Navn</label>
                <p className="mt-1 text-white">{profile.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400">E-post</label>
                <p className="mt-1 text-white">{profile.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400">Telefon</label>
                <p className="mt-1 text-white">{profile.phone}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400">Stilling</label>
                <p className="mt-1 text-white">{profile.role}</p>
              </div>
            </div>
          </div>

          {/* Statistikk */}
          <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
            <h2 className="text-xl font-semibold text-white mb-4">Statistikk</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400">Antall inspeksjoner denne måneden</label>
                <p className="mt-1 text-2xl font-bold text-white">24</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400">Timer registrert denne måneden</label>
                <p className="mt-1 text-2xl font-bold text-white">156</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400">Aktive prosjekter</label>
                <p className="mt-1 text-2xl font-bold text-white">8</p>
              </div>
            </div>
          </div>

          {/* Nylige aktiviteter */}
          <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700 md:col-span-2">
            <h2 className="text-xl font-semibold text-white mb-4">Nylige aktiviteter</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-gray-700/50 rounded-xl">
                <div className="w-10 h-10 rounded-full bg-blue-900/50 flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-white">Fullførte inspeksjon av Bygning A</p>
                  <p className="text-sm text-gray-400">2 timer siden</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-gray-700/50 rounded-xl">
                <div className="w-10 h-10 rounded-full bg-green-900/50 flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-white">Registrerte 4 timer på Prosjekt X</p>
                  <p className="text-sm text-gray-400">5 timer siden</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 